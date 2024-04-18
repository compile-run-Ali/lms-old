import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { paper_id } = req.body;

  try {
    //update spa status to Attempted
    const timeCompleted = new Date();
    // get gmt offset in hours, and add that in startTime
    const timeCompletedString = `${timeCompleted.getHours().toString().padStart(2, "0")}:${timeCompleted.getMinutes().toString().padStart(2, "0")}`;

    const closedExam = await prisma.paper.update({
      where: {
        paper_id: paper_id,
      },
      data: {
        status: "Closed",
      },
    });

    const submittedSPAs = await prisma.sPA.updateMany({
      where: {
        paperId: paper_id,
        status: "Attempted",
      },
      data: {
        status: "Submitted",
        timeCompleted: timeCompletedString,
      },
    });

    res.status(200).json({ closedExam, submittedSPAs });
  } catch (error) {
    console.log("Error in closing exam: ", error);
    res.status(500).json({
      error,
    });
  }
}
