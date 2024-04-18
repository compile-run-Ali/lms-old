// api to fetch subjective questions using paper

import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { index } = req.query;
  const paper_id = index;
  try {
    const questions = await prisma.subjectiveQuestion.findMany({
      where: {
        paper_id: paper_id,
      },
      select: {
        sq_id: true,
        question: true,
        marks: true,
        long_question: true,
        parent_question: true,
        questionnumber: true,
        parent_sq_id: true,
        child_question: {
          select: {
            sq_id: true,
            question: true,
            marks: true,
            long_question: true,
            parent_question: true,
            questionnumber: true,
            parent_sq_id: true,
          },
        },
      },
      orderBy: {
        questionnumber: "asc",
      },
    });
    if (!questions) {
      console.log("questions not found");
      return res.status(404).json("Questions not found");
    }
    res.status(200).json(questions);
  } catch (error) {
    console.log("inside catch");
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
}
