import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    //Remove Faculty
    await prisma.faculty.delete({
      where: {
        faculty_id: req.body.faculty_id,
      }
    })
    await prisma.$disconnect()
    res.status(200).json({message: "Faculty has been Deleted"})
  } catch (err) {
    throw new Error(err.message)
  }
}

export default handler