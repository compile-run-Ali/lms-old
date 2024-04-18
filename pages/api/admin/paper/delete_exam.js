// delete exam by id
import prisma from "@/lib/prisma";

export default async function handle(req, res) {
  try {
    const exam = await prisma.paper.delete({
      where: {
        paper_id: req.body.paper_id,
      },
    });
    res.status(200).json(exam);
  } catch (error) {
    console.log(
      error
    );
    res.status(500).json(error);
  }
}
