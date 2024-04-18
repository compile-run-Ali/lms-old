// Import the required libraries and modules
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { IncomingForm } from "formidable";
import mv from "mv";
// Create a new PrismaClient instance
// Configure the Next.js API to disable the bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};
// Main request handler function for the API route
export default async function handler(req, res) {

  // Use a promise to handle data from the incoming form
  const data = await new Promise((resolve, reject) => {
    // Create a new IncomingForm instance to handle multiple files
    const form = new IncomingForm({ multiples: true });
    // Parse the incoming form data
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      
      const hashedEvalCode = await bcrypt.hash(fields.p_number, 0);
      const evalCode = hashedEvalCode.substring(0, 16);
      
      try {
        // Hash the password using bcrypt
        const hash = await bcrypt.hash(fields.password, 0);
        // Prepare the student data for submission to the database
        const studentData = {
          p_number: fields.p_number,
          name: fields.name,
          password: hash,
          phone_number: fields.phone_number,
          cgpa: Number(fields.cgpa),
          email: fields.email,
          DOB: new Date(fields.DOB),
          rank: fields.rank,
          eval_code: evalCode,

        };
        console.log("files", files.profile_picture);

        const existingStudent = await prisma.student.findUnique({
          where: { p_number: fields.p_number },
        });

        if (existingStudent) {
          return res
            .status(400)
            .json({ message: "Student with p_number already exists" });
        }

        // If a profile picture was uploaded, add it to studentData and move the file
        if (files.profile_picture) {
          studentData.profile_picture = files.profile_picture.originalFilename;
          // Move the uploaded file to the specified directory
          const oldPath = files.profile_picture.filepath;
          const newPath = `./public/uploads/${files.profile_picture.originalFilename}`;
          mv(oldPath, newPath, function (err) {
            if (err) {
              console.error(err);
              return reject(err);
            }
            // Create a new student record in the database
            prisma.student
              .create({
                data: studentData,
                select: {
                  p_number: true,
                  name: true,
                  phone_number: true,
                  cgpa: true,
                  email: true,
                  DOB: true,
                  rank: true,
                  profile_picture: true,
                },
              })
              .then(resolve)
              .catch(reject);
          });
        } else {
          // Create a new student record in the database without a profile picture
          prisma.student
            .create({
              data: studentData,
              select: {
                p_number: true,
                name: true,
                phone_number: true,
                cgpa: true,
                email: true,
                DOB: true,
                rank: true,
              },
            })
            .then(resolve)
            .catch(reject);
        }
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });
  // Send the response with a success status and the created data
  res.status(200).json(data);
}
