import prisma from "@/lib/prisma";

const handler = async (req, res) => {

  try {
    const unread_notifications = await prisma.notification.findMany({
      where: {
        faculty_id: req.body.faculty_id,
        read: false,
      },
      select: {
        notification_id: true,
        notification: true,
        exam_id: true,
        faculty: true,
        faculty_id: true,
        read: true,
        time: true,
      },
    });
    res.status(200).json(unread_notifications);
  } catch (err) {
    console.log("Error in faculty/get_notifications.js: " + err);
    res.status(500).json("Error in faculty/get_notifications.js: " + err);
  }
};

export default handler;
