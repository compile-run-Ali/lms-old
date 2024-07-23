import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    // Retrieve all paperapproval data from the database
    const exams = await prisma.paperApproval.findMany({
      select: {
        level: true,
        paper: {
          select: {
            paper_id: true,
            paper_name: true,
            paper_type: true,
            date: true,
            duration: true,
            objDuration: true,
            weightage: true,
            freeflow: true,
            status: true,
            total_marks: true,
            course: true,
            PaperComment: {
              select: {
                comment: true,
                user_generated: true,
              },
            },
          },
        },
      },
    });

    // Retrieve all courses from the database
    const courses = await prisma.course.findMany({
      select: {
        course_code: true,
        course_name: true,
        credit_hours: true,
        paper: {
          select: {
            paper_id: true,
            paper_name: true,
            paper_type: true,
            date: true,
            duration: true,
            objDuration: true,
            weightage: true,
            freeflow: true,
            examofficer: true,
            status: true,
            total_marks: true,
            PaperComment: {
              select: {
                comment: true,
                user_generated: true,
              },
            },
          },
        },
      },
    });

    // Retrieve papers for the selected courses using the CoursePaper model
    const selectedCoursePapers = await prisma.coursePaper.findMany({
      select: {
        course_code: true,
        paper: {
          select: {
            paper_id: true,
            paper_name: true,
            paper_type: true,
            date: true,
            duration: true,
            objDuration: true,
            weightage: true,
            freeflow: true,
            status: true,
            total_marks: true,
            objective_marks: true,
            subjective_marks: true,
            language: true,
            subjective_questions: true,
            objective_questions: true,
            ie_questions: true,
            PaperComment: {
              select: {
                comment: true,
                user_generated: true,
              },
            },
          },
        },
      },
    });

    // Create an array to store selectedCoursePapers by course code
    const selectedCoursePapersByCourse = {};

    // Group selectedCoursePapers by course code
    selectedCoursePapers.forEach((paper) => {
      if (!selectedCoursePapersByCourse[paper.course_code]) {
        selectedCoursePapersByCourse[paper.course_code] = [];
      }
      selectedCoursePapersByCourse[paper.course_code].push(paper.paper);
    });

    // Merge selectedCoursePapers into courses[].course.paper
    courses.forEach((course) => {
      const courseCode = course.course_code;
      if (selectedCoursePapersByCourse[courseCode]) {
        // Check if paper of the course is already present in the exams
        const paperIds = course.paper.map((paper) => paper.paper_id);
        const newPapers = selectedCoursePapersByCourse[courseCode].filter(
          (paper) => !paperIds.includes(paper.paper_id)
        );
        course.paper = [...course.paper, ...newPapers];
      }
    });

    // Create the response object
    const all_exams = {
      exams,
      courses,
    };

    // Send the response
    res.status(200).json(all_exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default handler;
