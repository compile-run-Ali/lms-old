import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    //Find Faculty
    const faculty = await prisma.faculty.findMany({
      select: {
        faculty_id: true,
        pa_number: true,
        name: true,
        email: true,
        phone_number: true,
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

export default handler;
