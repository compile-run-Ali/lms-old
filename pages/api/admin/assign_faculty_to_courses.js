import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    // Check if record with given faculty_id and course_code already exists
    const ftcExists = await prisma.fTC.findFirst({
      where: {
        AND: [
          { course_code: req.body.course_code },
          { faculty_id: req.body.faculty_id },
        ],
      },
    })

    if (ftcExists) {
      // If record already exists, return a custom error message with facultyExists flag set to true
      res.status(409).json({
        error: "Record already exists",
        facultyExists: true,
      })
    } else {
      // If record does not exist, create new record
      const ftc = await prisma.fTC.create({
        data: {
          course: {
            connect: {
              course_code: req.body.course_code,
            },
          },
          faculty: {
            connect: {
              faculty_id: req.body.faculty_id,
            },
          },
        },
        select: {
          course: {
            select: {
              course_code: true,
            },
          },
          faculty: {
            select: {
              faculty_id: true,
              name: true,
            },
          },
        },
      })
      res.status(200).json(ftc)
    }
  } catch (err) {
    // Handle any other errors by returning a custom error message with facultyExists flag set to false
    res.status(500).json({
      error: "An error occurred",
      facultyExists: false,
    })
  }
}

export default handler;
