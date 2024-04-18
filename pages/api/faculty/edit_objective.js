import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    const updatedOQ = await prisma.objectiveQuestion.update({
      where: {
        oq_id: req.body.oq_id,
      },
      data: {
        question: req.body.question,
        correct_answer: req.body.correct_answer,
        answers: req.body.answers,
        marks: req.body.marks,
        timeAllowed: req.body.timeAllowed,
        
      },
    });
    res.status(200).json(updatedOQ);
  } catch (err) {
    throw new Error(err.message);
  }
};

export default handler;
