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
        const facultyData = {
          pa_number: fields.pa_number,
          name: fields.name,
          email: fields.email,
          phone_number: fields.phone_number,
          level: Number(fields.level),
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
              .update({
                where: {
                  faculty_id: fields.faculty_id,
                },
                data: facultyData,
                pa_number: true,
                select: {
                  pa_number: true,
                  faculty_id: true,
                  name: true,
                  email: true,
                  phone_number: true,
                  rank: true,
                  level: true,
                  position: true,
                  profile_picture: true,
                },
              })
              .then(resolve)
              .catch(reject);
          });
        } else {
          prisma.faculty
            .update({
              where: {
                faculty_id: fields.faculty_id,
              },
              data: facultyData,
              select: {
                pa_number: true,
                faculty_id: true,
                name: true,
                email: true,
                rank: true,
                phone_number: true,
                level: true,
                position: true,
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
