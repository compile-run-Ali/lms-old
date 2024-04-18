import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { p_number, questions } = req.body;

  console.log("questions", questions, "TYPE", typeof questions);

  try {
    const existingSOA = await prisma.sOA.findMany({
      where: {
        p_number: p_number,
        oq_id: { in: questions },
      },
    });

    if (existingSOA) {
      // filter the results to only include records that match both p_number and oq_id
      const matchingSOA = existingSOA.filter(
        (record) =>
          record.p_number === p_number && questions.includes(record.oq_id)
      );
      res.status(200).json(matchingSOA);
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    throw new Error(err.message);
  }
}
