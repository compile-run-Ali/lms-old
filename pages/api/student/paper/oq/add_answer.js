import prisma from "@/lib/prisma";
export default async function handler(req, res) {
  try {
    console.log("received body", req.body);
    const existingSOA = await prisma.sOA.findUnique({
      where: {
        soa_id: req.body.p_number + req.body.oq_id,
      },
    });
    if (existingSOA) {
      console.log("updatedSOA");
      const updatedSOA = await prisma.sOA.update({
        where: {
          soa_id: existingSOA.soa_id,
        },
        data: {
          answer: req.body.answer,
          is_attempted: req.body.is_attempted,
          marksobtained: req.body.marks,
        },
      });
      res.status(200).json(updatedSOA);
    } else {
      console.log("newSOA");
      const newSOA = await prisma.sOA.create({
        data: {
          soa_id: req.body.p_number + req.body.oq_id,
          p_number: req.body.p_number,
          oq_id: req.body.oq_id,
          answer: req.body.answer,
          marksobtained: req.body.marks,
        },
      });

      if (newSOA) {
        const addAttempt = await prisma.sOA.update({
          where: {
            soa_id: req.body.p_number + req.body.oq_id,
          },
          data: {
            is_attempted: req.body.is_attempted,
          },
        });
        res.status(200).json(addAttempt);
      }
    }
  } catch (err) {
    if (err.code === "P2002") {
      // If the error is due to a duplicate primary key, send a 400 Bad Request response
      res
        .status(400)
        .json({ error: "Record with the specified key already exists." });
    } else {
      // Otherwise, send a 500 Internal Server Error response
      res
        .status(500)
        .json({ error: "An unexpected error occurred.", details: err.message });
    }
  }
}
