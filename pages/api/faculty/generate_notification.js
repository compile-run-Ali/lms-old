import prisma from "@/lib/prisma";

const handler = async (req, res) => {

  try {
    const existingNotification = await prisma.notification.findFirst({
      where: {
        AND: [
          { notification: req.body.notification },
          { faculty_id: req.body.faculty_id },
        ],
      },
    });

    if (existingNotification) {
      // Notification already exists, return some message that it exists
      res.status(200).json({
        message: "Notification already exists",
      });
    } else {
      // Notification doesn't exist, create new record
      const newNotification = await prisma.notification.create({
        data: {
          notification: req.body.notification,
          faculty_id: req.body.faculty_id,
        },
      });
      res.status(200).json(newNotification);
    }
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  } finally {
    await prisma.$disconnect();
  }
};

export default handler;
