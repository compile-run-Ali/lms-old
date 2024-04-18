import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    //create Course
    const course = await prisma.course.create({
      data: {
        course_code: req.body.course_code,
        course_name: req.body.name,
        credit_hours: Number(req.body.credit_hours),
        max_students: Number(req.body.max_students),
      },
    });
    res.status(200).json(course)
  } catch (err) {
    throw new Error(err.message)
  }
}

export default handler