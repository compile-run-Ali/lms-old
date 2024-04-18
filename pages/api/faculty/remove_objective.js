import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    //Remove Faculty
    await prisma.objectiveQuestion.delete({
      where: {
        oq_id: req.body.oq_id,
      },
    });
    await prisma.$disconnect();
    res
      .status(200)
      .json({ message: "Objective Question Deleted Successfully" });
  } catch (err) {
    throw new Error(err.message);
  }
};

export default handler;
