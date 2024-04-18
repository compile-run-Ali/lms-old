import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    await prisma.paper.update({
      where: {
        paper_id: req.body.paper_id,
      },
      data: {
        status: req.body.examofficer === null ? "Draft" : "Pending Approval",
      },
    });

    const approval = await prisma.paperApproval.findUnique({
      where: {
        paper_id: req.body.paper_id,
      },
    });
    
    if (approval) {
      await prisma.paperApproval.delete({
        where: {
          paper_id: req.body.paper_id,
        },
      });
    }
    

    req.body.examofficer !== null &&
      (await prisma.paperApproval.create({
        data: {
          paper: {
            connect: {
              paper_id: req.body.paper_id,
            },
          },
          faculty: {
            connect: {
              faculty_id: req.body.examofficer,
            },
          },
          level: req.body.level,
        },
      }));
    res
      .status(200)
      .json({ message: "Subjective Question Deleted Successfully" });
  } catch (err) {
    throw new Error(err.message);
  }
};

export default handler;
