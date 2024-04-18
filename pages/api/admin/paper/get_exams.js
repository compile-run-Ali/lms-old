import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    //get all papers
    const papers = await prisma.paper.findMany({
      include: {
        course: true,
        examofficer: true,
        subjective_questions: true,
        objective_questions: true,
      },
    })
    res.status(200).json(papers);
  } catch (err) {
    throw new Error(err.message)
  }
}

export default handler;