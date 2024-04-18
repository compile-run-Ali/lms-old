// api to get answer of student if exists

import prisma from "@/lib/prisma";


export default async function handler(req, res) {
  try {
    const existingSOA = await prisma.sOA.findUnique({
      where: {
        soa_id: req.query.p_number + req.query.oq_id,
      },
      select: {
        answer: true,
        oq_id: true,
        marksobtained: true,
        is_attempted: true,
      },
    });

    if (existingSOA) {
      res.status(200).json(existingSOA);
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    console.log(err);
  }
}
