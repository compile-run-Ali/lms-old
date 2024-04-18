import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    //  Find Student
    const student = await prisma.student.findMany({
      select: {
        p_number: true,
        name: true,
        email: true,
        cgpa: true,
        DOB: true,
        password: true,
        phone_number: true,
        profile_picture: true,
        rank: true,
        courses: {
          select: {
            course_code: true,
            course: true,
          },
        },
      },
    });
    res.status(200).json(student);
  } catch (err) {
    throw new Error(err.message);
  }
};

export default handler;
