import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    //get all papers
    const paper = await prisma.paper.findUnique({
      where: {
        paper_id: req.body.paper_id,
      },
      select: {
        objective_questions: {
          select: {
            oq_id: true,
            question: true,
            correct_answer: true,
            answers: true,
            marks: true,
            timeAllowed: true,
          },
        },
      },
    });
    res.status(200).json(paper.objective_questions);
  } catch (err) {
    throw new Error(err.message);
  }
};

export default handler;
