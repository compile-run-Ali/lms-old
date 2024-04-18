import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    //Remove Faculty
    await prisma.subjectiveQuestion.delete({
      where: {
        sq_id: req.body.sq_id,
      },
    });
    await prisma.$disconnect();
    res
      .status(200)
      .json({ message: "Subjective Question Deleted Successfully" });
  } catch (err) {
    throw new Error(err.message);
  }
};

export default handler;
