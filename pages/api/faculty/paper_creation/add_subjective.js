import prisma from "@/lib/prisma";


const handler = async (req, res) => {
  try {
    // Use transaction API to ensure that both create and update operations are executed as a single transaction
    const result = await prisma.$transaction(async (prisma) => {
      let updatedSQ;

      // Create new SQ and connect to paper
      const newSQ = await prisma.subjectiveQuestion.create({
        data: {
          question: req.body.question,
          answer: req.body.answer,
          marks: req.body.marks,
          long_question: req.body.long_question,
          questionnumber: req.body.questionnumber,
          paper: {
            connect: {
              paper_id: req.body.paper_id,
            },
          },
        },
      });

      updatedSQ = newSQ;
      // Update parent question and add child question to its "child_question" array
      if (req.body.parent_sq_id) {
        await prisma.subjectiveQuestion.update({
          where: {
            sq_id: req.body.parent_sq_id,
          },
          data: {
            child_question: {
              connect: {
                sq_id: newSQ.sq_id,
              },
            },
          },
          select: {
            sq_id: true,
            question: true,
            marks: true,
            long_question: true,
            parent_sq_id: true,
            questionnumber: true,
            child_question: true,
            answer:true,
          },
        });
      }

      return updatedSQ;
    });

    res.status(200).json({
      ...result,
      parent_sq_id: req.body.parent_sq_id,
    });
  } catch (err) {
    console.log(err);
  }
};

export default handler;
