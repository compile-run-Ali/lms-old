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
    const faculty = await prisma.faculty.findFirst({
      where: {
        email,
      },
    });

    if (faculty !== null && faculty !== undefined && faculty.length !== 0) {
      //Compare the hash
      const matched = await confirmPasswordHash(password, faculty.password);
      if (matched) {
        return faculty;
      } else {
        throw new Error("Invalid Password");
      }
    } else {
      throw new Error("Faculty not found");
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

export default handler;
