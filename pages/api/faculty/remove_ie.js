import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query 

  try {
    const deletedQuestion = await prisma.ieQuestion.delete({
      where: {
        ie_id: Number(id)
      }
    })
    res.status(200).json({ message: 'Question deleted successfully' })
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: 'Failed to delete question' })
  }
}
