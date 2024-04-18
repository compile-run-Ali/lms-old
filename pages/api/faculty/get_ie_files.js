import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    //get all papers
    const paper = await prisma.paper.findUnique({
      where: {
        paper_id: req.query.paperId,
      },
      select: {
        ie_questions: {
          select: {
            fileName: true,
            ie_id: true,
            fileUrl: true,
            fileNameWord: true,
            fileUrlWord: true,
            total_marks: true,
          },
        },
      },
    });
    res.status(200).json(paper);
  } catch (err) {
    throw new Error(err.message);
  }
};

export default handler;
