import prisma from "@/lib/prisma";

//the route is /api/student/paper/get_attempt_status

const handler = async (req, res) => {
  try {
    const SPA = await prisma.sPA.findMany({
      where: {
        paperId: req.body.paperId,
      },
      select: {
        studentId: true,
        status: true,
        obtainedMarks: true,
      },
    });

    res.status(200).json(SPA);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

export default handler;
