import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { index } = req.query;
  const p_number = index;

  try {
    // Fetch all the courses in which the student is enrolled
    const courses = await prisma.sRC.findMany({
      where: {
        p_number: p_number,
      },
    });

    // Check if any courses were found
    if (!courses || courses.length === 0) {
      return res.status(404).json("Student not found or not enrolled in any course");
    }

    // Collect the course codes of all enrolled courses
    const courseCodes = courses.map((course) => course.course_code);



    // Fetch data from the CoursePaper model
    const coursePapers = await prisma.coursePaper.findMany({
      where: {
        course_code: {
          in: courseCodes,
        },
      },
      include: {
        paper: true, // Include paper data associated with course papers
      },
    });
    
    // Create an object to track unique papers using their paper_id
    const uniquePapers = {};
    
    // Combine paper data with course paper data while avoiding duplicates
    const papersWithCoursePapers = coursePapers.map((coursePaper) => {
      const paper = coursePaper.paper;
    
      // Only process papers that haven't been added yet
      if (!uniquePapers[paper.paper_id]) {
        uniquePapers[paper.paper_id] = true; // Mark paper as added
        return {
          ...paper,
        };
      }
      return null; // Skip duplicate papers
    }).filter(Boolean); // Remove null (filtered out duplicates)
    
    console.log(papersWithCoursePapers, "papersWithCoursePapers");
    
    res.status(200).json(papersWithCoursePapers);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}
