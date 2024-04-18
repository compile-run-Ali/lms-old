// Get faculty by level
import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    //Find Faculty
    const faculty = await prisma.faculty.findMany({
      where: {
        level: {
          gt: req.body.level,
        },
      },
      select: {
        pa_number: true,
        faculty_id: true,
        name: true,
        email: true,
        phone_number: true,
        password: true,
        rank: true,
        profile_picture: true,
        level: true,
        position: true,
      },
    });
    res.status(200).json(faculty);
  } catch (err) {
    throw new Error(err.message);
  }
};
