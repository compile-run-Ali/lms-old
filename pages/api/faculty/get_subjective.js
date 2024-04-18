import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    //get all papers
    const paper = await prisma.paper.findUnique({
      where: {
        paper_id: req.body.paper_id,
      },
      select: {
        subjective_questions: {
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
        },
      },
    });
    res.status(200).json(paper.subjective_questions);
  } catch (err) {
    console.log(err);
  }
};

export default handler;
