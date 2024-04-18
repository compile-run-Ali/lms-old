import prisma from "@/lib/prisma";

export default async function handler(req, res) {

    console.log(req.query)
  const { ie_id } = req.query;

  try {
    const ieQuestion = await prisma.ieQuestion.findUnique({
      where: {
        ie_id: ie_id,
      },
    });

    if (!ieQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }
    console.log(ieQuestion)
    const paperId = ieQuestion.paper_id;
    const ieQuestionMarks = ieQuestion.total_marks;
    const paper = await prisma.paper.findUnique({
      where: {
        paper_id: paperId,
      },
    });
    const newTotalMarks = paper.total_marks - ieQuestionMarks;
    await prisma.paper.update({
      where: {
        paper_id: paperId,
      },
      data: {
        total_marks: newTotalMarks,
      },
    });

    await prisma.ieQuestion.delete({
      where: {
        ie_id: ie_id,
      },
    });

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
}
