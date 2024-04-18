import prisma from "@/lib/prisma";
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
        const studentData = {
          name: fields.name,
          email: fields.email,
          phone_number: fields.phone_number,
          cgpa: Number(fields.cgpa),
          DOB: new Date(fields.DOB),
          rank: fields.rank,
          p_number: fields.p_number,
        };


        
        const newData = fields.course_code;

        const { course_code: previousData } = await prisma.sRC.findFirst({
          where: {
            p_number: fields.p_number,
          },
          select: {
            course_code: true,
          },
        });

        if (previousData !== newData) {
          await prisma.sRC.deleteMany({
            where: {
              p_number: fields.p_number,
            },
          });
          await prisma.sRC.create({
            data: {
              p_number: fields.p_number,
              course_code: newData,
            },
          });
        }



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
            prisma.student
              .update({
                where: {
                  p_number: fields.p_number,
                },
                data: studentData,
                select: {
                  p_number: true,
                  name: true,
                  email: true,
                  phone_number: true,
                  cgpa: true,
                  DOB: true,
                  rank: true,
                  profile_picture: true,
                },
              })
              .then(resolve)
              .catch(reject);
          });
        } else {
          prisma.student
            .update({
              where: {
                p_number: fields.p_number,
              },
              data: studentData,
              select: {
                p_number: true,
                name: true,
                email: true,
                phone_number: true,
                rank: true,
                cgpa: true,
                DOB: true,
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
  res.status(200).json(data);
};

export default handler;
