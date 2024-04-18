import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        paper: {
          paper_id: req.body.paper_id,
        },
      },
      select: {
        faculty: {
          select: {
            name: true,
          },
        },
        message: true,
      },
    });
    res.status(200).json(notifications);
  } catch (err) {
    throw new Error(err.message);
  }
};
