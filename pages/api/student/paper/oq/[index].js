// api to fetch objective questions using paper

import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { index } = req.query;
  const paper_id = index;
  try {
    const questions = await prisma.objectiveQuestion.findMany({
      where: {
        paper_id: paper_id,
      },
    });
    if (!questions) {
      console.log("questions not found");
      return res.status(404).json("Questions not found");
    }
    res.status(200).json(questions);
  } catch {
    console.log("inside catch");
    res.status(500).json({ error: "Server Error" });
  }
}
