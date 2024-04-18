// get a paper by id

import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  console.log("body", req.body, "query", req.query);
  try {
    const paper = await prisma.paper.findUnique({
      where: {
        paper_id: req.query.paper_id,
      },
      select: {
        course_code: true,
        paper_id: true,
        paper_name: true,
        paper_type: true,
        duration: true,
        objDuration: true,
        date: true,
        status: true,
        objective_questions: {
          select: {
            oq_id: true,
            question: true,
            answers: true,
            correct_answer: true,
            marks: true,
            timeAllowed: true,
          },
        },
        subjective_questions: {
          select: {
            sq_id: true,
            question: true,
            marks: true,
            questionnumber: true,
            long_question: true,
            parent_sq_id: true,
            answer:true,
          },
        },
        ie_questions: {
          select: {
            ie_id: true,
            fileName: true,
            fileUrl: true,
           // total_marks: true,
          },
        },
      },
    });
    res.status(200).json(paper);
  } catch (err) {
    console.log(err)
    throw new Error(err.message);
  }
};

export default handler;
