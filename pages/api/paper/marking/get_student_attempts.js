import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    const existingSSA = await prisma.sSA.findMany({
      where: {
        p_number: req.body.p_number,
        sq_id: { in: req.body.question },
      },
    });

    if (existingSSA) {
      res.status(200).json(existingSSA);
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

export default handler;
