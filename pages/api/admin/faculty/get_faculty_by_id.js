// get faculty by id

import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    const faculty = await prisma.faculty.findUnique({
      where: {
        faculty_id: req.body.faculty_id,
      },
      select: {
        faculty_id: true,
        pa_number: true,
        name: true,
        email: true,
        phone_number: true,
        profile_picture: true,
        rank: true,
        level: true,
        position: true,
      },
    });
    res.status(200).json(faculty);
  } catch (err) {
    throw new Error(err.message);
  }
};

export default handler;
