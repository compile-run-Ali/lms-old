import prisma from "@/lib/prisma";


const handler = async (req, res) => {
  try {
    const ssa = await prisma.sSA.findUnique({
      where: {
        ssa_id: req.body.ssa_id,
      },
    });

    if (!ssa) {
      return res.status(404).json({ message: "SSA record not found" });
    }

    const updatedExam = await prisma.sSA.update({
      where: {
        ssa_id: req.body.ssa_id,
      },
      data: {
        marksobtained: req.body.marksobtained,
      },
    });

    res.status(200).json(updatedExam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};

export default handler;
