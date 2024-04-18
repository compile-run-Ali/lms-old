// get paper by id
import prisma from "@/lib/prisma";
import { getPaperDateTime, compareDateTime } from "@/lib/TimeCalculations";

const handle = async (req, res) => {
  const { index } = req.query;
  let id = index;
  try {
    const paper = await prisma.paper.findUnique({
      where: {
        paper_id: String(id),
      },
      select: {
        paper_id: true,
        date: true,
        duration: true,
        objDuration: true,
        attempts: true,
        course: true,
        freeflow: true,
        examofficer: true,
        course_code: true,
        paper_name: true,
        status: true,
        paper_type: true,
        review: true,
        weightage: true,
        language:true,

        objective_questions: {
          select: {
            oq_id: true,
            question: true,
            correct_answer: true,
            answers: true,
            timeAllowed: true,
            marks: true,
            paper: true,
            paper_id: true,
            student_attempst: true,
          },
        },
        ie_questions: {
          select: {
            ie_id: true,
            fileName: true,
            fileUrl: true,
            paper: true,
            paper_id: true,
          },
        },
        subjective_questions: {
          where: {
            parent_question: null,
          },
          orderBy: {
            questionnumber: "asc",
          },
          select: {
            questionnumber: true,
            _count: true,
            sq_id: true,
            question: true,
            marks: true,
            long_question: true,
            parent_question: true,
            parent_sq_id: true,
            student_attempts: true,
            paper: true,
            paper_id: true,
            child_question: {
              orderBy: {
                questionnumber: "asc",
              },
              select: {
                questionnumber: true,
                sq_id: true,
                question: true,
                marks: true,
                long_question: true,
                parent_question: true,
                parent_sq_id: true,
                student_attempts: true,
                paper: true,
                paper_id: true,
              },
            },
          },
        },
      },
    });
    if (!paper) return res.status(404).json("Paper not found");
    console.log(paper)
    res.status(200).json(paper);
  } catch (error) {
    console.log(
      "Error in /pages/api/paper/[index].js: ",
      JSON.stringify(error)
    );
    res.status(500).json({ error: "Server Error" });
  }
};

export default handle;
