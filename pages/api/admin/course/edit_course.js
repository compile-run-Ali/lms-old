import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    //Edit Faculty Details
    console.log(
      req.body 
    );
    const faculty = await prisma.course.update({
      where: {
        course_code: req.body.course_code,
      },
      data: {
        course_name: req.body.name,
        course_code: req.body.updated_course_code,
        credit_hours: Number(req.body.credit_hours),
        max_students: Number(req.body.max_students),
      }
    })
    res.status(200).json(faculty)
  } catch (err) {
    throw new Error(err.message)
  }
}

export default handler;