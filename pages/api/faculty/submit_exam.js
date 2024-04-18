import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    //create paper approval
    await prisma.paperApproval.create({
      data: {
        paper: {
          connect: {
            paper_id: req.body.paper_id,
          },
        },
        faculty: {
          connect: {
            faculty_id: req.body.faculty_id,
          },
        },
        level: req.body.level,
      },
    });
    await prisma.paper.update({
      where: {
        paper_id: req.body.paper_id,
      },
      data: {
        status: "Pending Approval",
      },
    });
    res.status(200).json({ message: "Exam has been submitted for approval" });
  } catch (err) {
    throw new Error(err.message);
  }
};

export default handler;
