import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    console.log("received", req.body);

    const existingSSA = await prisma.sSA.findUnique({
      where: {
        ssa_id: req.body.p_number + req.body.sq_id,
      },
    });

    if (existingSSA) {
      const updatedSSA = await prisma.sSA.update({
        where: {
          ssa_id: existingSSA.ssa_id,
        },
        data: {
          answer: req.body.answer,
        },
      });

      res.status(200).json(updatedSSA);
    } else {
      const newSSA = await prisma.sSA.create({
        data: {
          ssa_id: req.body.p_number + req.body.sq_id,
          p_number: req.body.p_number,
          sq_id: req.body.sq_id,
          answer: req.body.answer,
        },
      });

      res.status(200).json(newSSA);
    }
  } catch (err) {
    throw new Error(err.message);
  }
}
