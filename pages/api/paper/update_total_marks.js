import prisma from "@/lib/prisma";


export default async function handle(req, res) {
  const { paper_id, add_marks, is_objective } = req.body;
  // find paper and get its marks, and received marks to its total_marks
  try {
    const paper = await prisma.paper.findUnique({
      where: {
        paper_id: paper_id,
      },
    });
    const total_marks = is_objective
      ? add_marks + paper.subjective_marks
      : add_marks + paper.objective_marks;
    const updatedPaper = await prisma.paper.update({
      where: {
        paper_id: paper_id,
      },
      data: {
        total_marks: total_marks,
        objective_marks: is_objective ? add_marks : paper.objective_marks,
        subjective_marks: is_objective ? paper.subjective_marks : add_marks,
      },
    });
    res.status(200).json(updatedPaper);
  } catch (err) {
    console.log("Error in update_total_marks: " + err);
  }
}
