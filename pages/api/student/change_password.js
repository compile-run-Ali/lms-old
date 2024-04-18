import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";


export default async function handler(req, res) {
  const { oldPassword, newPassword, recovery, id } = req.body;

  const oldHash = await bcrypt.hash(oldPassword, 0);
  const newHash = await bcrypt.hash(newPassword, 0);
  try {
    if (recovery) {
      // change password
      const student = await prisma.student.update({
        where: {
          p_number: id,
        },
        data: {
          password: newHash,
        },
      });
    } else {
      // check if old password matches current encrypted password

      const student = await prisma.student.findUnique({
        where: {
          p_number: id,
        },
      });

      const match = await bcrypt.compare(oldPassword, student.password);

      if (match) {
        // change password
        const student = await prisma.student.update({
          where: {
            p_number: id,
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
    console.log("Error in change_password", error);
    res.status(500).json({ message: "Error in change_password", error: error });
  }
}
