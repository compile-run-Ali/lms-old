import prisma from "@/lib/prisma";


export default async function handler(req, res) {
  const { questions, paperId } = req.body;

  try {
    // Delete existing questions for the given paperId
    await prisma.objectiveQuestion.deleteMany({
      where: {
        paper_id: paperId,
      },
    });

    await prisma.paper.update({
      where: {
        paper_id: paperId,
      },
      data: {
        total_marks: questions.length,
        objective_marks: questions.length,
      },
    });

    // Create new questions for the given paperId
    const objectiveQuestions = await Promise.all(
      questions.map(async (question) => {
        const createdQuestion = await prisma.objectiveQuestion.create({
          data: {
            question: question.question,
            answers: question.answers,
            correct_answer: question.correct_answer,
            marks: question.marks,
            timeAllowed: question.timeAllowed,
            paper: {
              connect: {
                paper_id: paperId,
              },
            },
          },
        });
        return createdQuestion;
      })
    );

    res.status(200).json(objectiveQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
