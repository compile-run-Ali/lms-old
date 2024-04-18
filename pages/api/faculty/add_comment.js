import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    const addPaperComment = await prisma.paperComment.create({
      data: {
        comment: req.body.comment,
        user_generated: req.body.user_generated,
        faculty: {
          connect: {
            faculty_id: req.body.faculty_id,
          },
        },
        paper: {
          connect: {
            paper_id: req.body.paper_id,
          },
        },
      },
      select: {
        faculty: {
          select: {
            name: true,
            email: true,
            level: true,
            faculty_id: true,
          },
        },
        comment: true,
        user_generated: true,
        time: true,
      },
    });
    res.status(200).json(addPaperComment);
  } catch (err) {
    throw new Error(err.message);
  }
};

export default handler;
