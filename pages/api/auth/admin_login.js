import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

const confirmPasswordHash = (plainPassword, hashedPassword) => {
  return new Promise((resolve) => {
    bcrypt.compare(plainPassword, hashedPassword, function (err, res) {
      resolve(res);
    });
  });
};

const handler = async (email, password) => {
  try {
    const admin = await prisma.faculty.findFirst({
      where: {
        email,
        level: 6,
      },
    });

    if (faculty !== null) {
      //Compare the hash
      const matched = await confirmPasswordHash(password, admin.password);
      if (matched) {
        res.status(200).json(admin);
      } else {
        throw new Error("Invalid Password");
      }
    } else {
      throw new Error("Admin not found");
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

export default handler;
