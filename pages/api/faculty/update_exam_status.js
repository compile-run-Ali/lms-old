import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  console.log(req.body);
  try {
    const paper = await prisma.paper.update({
      where: {
        paper_id: req.body.paper_id,
      },
      data: {
        status: req.body.status,
      },
      include: {
        course: true,
      },
    });

    res.status(200).json(paper);
  } catch (err) {
    throw new Error(err.message);
  }
};

export default handler;
