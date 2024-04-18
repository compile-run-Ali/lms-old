import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  console.log("Add Objective Question", req.body);
  try {
    //Create New Objective Question
    const newObjective = await prisma.objectiveQuestion.create({
      data: {
        question: req.body.question,
        answers: req.body.answers,
        marks: req.body.marks,
        correct_answer: req.body.correct_answer,
        timeAllowed: req.body.timeAllowed,
        paper: {
          connect: {
            paper_id: req.body.paper_id,
          },
        },
      },
    });
    //Update Paper enty with new questions
    // await prisma.paper.update({
    //   where: {
    //     paper_id: req.body.paper_id,
    //   },
    //   data: {
    //     objective_questions: {
    //       connect: {
    //         oq_id: newObjective.oq_id,
    //       },
    //     },
    //   },
    // })
    res.status(200).json(newObjective);
  } catch (err) {
    throw new Error(err.message);
  }
};

export default handler;
