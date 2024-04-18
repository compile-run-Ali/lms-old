import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    const new_notification = await prisma.notification.create({
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
        message: req.body.message,
      },
    });
    res.status(200).json(new_notification);
  } catch (err) {
    throw new Error(err.message);
  }
};
