import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";


export default async function handler(req, res) {
  const { oldPassword, newPassword, recovery, id } = req.body;

  const oldHash = await bcrypt.hash(oldPassword, 0);
  const newHash = await bcrypt.hash(newPassword, 0);
  try {
    if (recovery) {
      // change password
      const faculty = await prisma.faculty.update({
        where: {
          faculty_id: id,
        },
        data: {
          password: newHash,
        },
      });
    } else {
      // check if old password matches current encrypted password

      const faculty = await prisma.faculty.findUnique({
        where: {
          faculty_id: id,
        },
      });

      const match = await bcrypt.compare(oldPassword, faculty.password);

      if (match) {
        // change password
        const faculty = await prisma.faculty.update({
          where: {
            faculty_id: id,
          },
          data: {
            password: newHash,
          },
        });
      } else {
        res
          .status(200)
          .json({ message: "Old Password does not match", notMatch: true });
      }
    }

    res.status(200).json({ message: "Password Changed Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in change_password", error: error });
  }
}
