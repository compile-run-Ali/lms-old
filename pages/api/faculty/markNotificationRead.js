import prisma from "@/lib/prisma";

const handler = async (req, res) => {

  try {
    const updatedNotification = await prisma.notification.update({
      where: {
        notification_id: req.body.notification_id,
      },
      data: {
        read: true,
      },
    });
    res.status(200).json(updatedNotification);
  } catch (err) {
    throw new Error(err.message);
  }
};

export default handler;
