import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    const paperId = req.body.paper_id;
    const selectedCourse = req.body.selectedCourse;

    // Step 1: Find CoursePaper records associated with the paper
    const coursePapers = await prisma.coursePaper.findMany({
      where: {
        paper_id: paperId,
      },
    });

    // Step 2: Extract course codes from the CoursePaper records
    let courseCodes = [];
    if (!selectedCourse) {
    courseCodes = coursePapers.map((coursePaper) => coursePaper.course_code);
    }

    // Step 3: Find students enrolled in courses with the obtained course codes
    const students = await prisma.sRC.findMany({
      where: {
        course_code: {
          in : selectedCourse? [selectedCourse]: courseCodes,
        },
      },
      select: {
        student: {
          select: {
            p_number: true,
            name: true,
            eval_code: true,
          },
        },
      },
    });
    console.log(students, "students")

    res.status(200).json(students);
  } catch (err) {
    throw new Error(err.message);
  }
};

export default handler;
