import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  console.log(req.body);
  try {
    // Create Paper
    const paper = await prisma.paper.create({
      data: {
        paper_name: req.body.paper_name,
        paper_type: req.body.paper_type,
        course_code: req.body.course_code,
        date: req.body.date,
        duration: req.body.duration,
        objDuration: req.body.objDuration,
        weightage: req.body.weightage,
        freeflow: req.body.freeflow,
        review: req.body.review,
        language: req.body.language,
      },
    });

    // Check if selectedCourses exists in the request body
    if (req.body.selectedCourses.length > 0) {
      // Create CoursePaper records
      const createCoursePapers = req.body.selectedCourses.map(async (courseCode) => {
        await prisma.coursePaper.create({
          data: {
            course_code: courseCode,
            paper_id: paper.paper_id, // Use the actual field name from your schema
          },
        });
      });

      // Wait for all CoursePaper records to be created
      await Promise.all(createCoursePapers);
    }

    res.status(200).json(paper);
  } catch (err) {
    throw new Error(err.message);
  }
};

export default handler;
