import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    const { course_code, p_number } = req.body;

    const course = await prisma.course.findUnique({
      where: {
        course_code,
      },
    });
    if (!course) {
      return res.status(404).json("Course not found");
    }

    const student = await prisma.student.findUnique({
      where: {
        p_number,
      },
    });
    if (!student) {
      return res.status(404).json("Student not found");
    }

    const deleted = await prisma.sRC.deleteMany({
      where: {
        course_code,
        p_number,
      },
    });

    res.status(200).json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error deleting student's enrollment in course");
  }
}
