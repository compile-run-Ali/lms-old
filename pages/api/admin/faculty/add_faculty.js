import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { IncomingForm } from "formidable";
import mv from "mv";


export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return reject(err);
      }

      try {
        // const existingFaculty = await prisma.faculty.findUnique({
        //   where: {
        //     email: fields.email,
        //   },
        // });

        // if (existingFaculty) {
        //   res.json({
        //     emailExists: true,
        //   });
        // }

        const hash = await bcrypt.hash(fields.password, 0);
        const facultyData = {
          pa_number: fields.pa_number,
          name: fields.name,
          email: fields.email,
          password: hash,
          level: Number(fields.level),
          phone_number: fields.phone_number,
          position: fields.position,
          rank: fields.rank,
        };

        if (files.profile_picture) {
          facultyData.profile_picture = files.profile_picture.originalFilename;

          // Move the uploaded file to the specified directory
          const oldPath = files.profile_picture.filepath;
          const newPath = `./public/uploads/${files.profile_picture.originalFilename}`;

          mv(oldPath, newPath, function (err) {
            if (err) {
              console.error(err);
              return reject(err);
            }

            prisma.faculty
              .create({
                data: facultyData,
                select: {
                  pa_number: true,
                  faculty_id: true,
                  name: true,
                  email: true,
                  level: true,
                  position: true,
                  phone_number: true,
                  rank: true,
                  profile_picture: true,
                },
              })
              .then(resolve)
              .catch(reject);
          });
        } else {
          prisma.faculty
            .create({
              data: facultyData,
              select: {
                faculty_id: true,
                name: true,
                pa_number: true,
                email: true,
                rank: true,
                position: true,
                level: true,
                phone_number: true,
              },
            })
            .then(resolve)
            .catch(reject);
        }
      } catch (err) {
        console.error(err);
        return reject(err);
      }
    });
  });
  res.status(200).json({
    ...data,
    emailExists: false,
  });
};

export default handler;
