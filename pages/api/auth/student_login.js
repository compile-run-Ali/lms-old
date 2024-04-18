import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

const confirmPasswordHash = (plainPassword, hashedPassword) => {
  return new Promise((resolve) => {
    bcrypt.compare(plainPassword, hashedPassword, function (err, res) {
      resolve(res);
    });
  });
};

const handler = async (p_number, password) => {

  try {
    const student = await prisma.student.findFirst({
      where: {
        p_number: p_number,
      },
    });

    if (student !== null) {
      //Compare the hash
      const matched = await confirmPasswordHash(password, student.password);
      if (matched) {
        return student;
      } else {
        throw new Error("Invalid Password");
      }
    } else {
      throw new Error("Student not found");
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

export default handler;
