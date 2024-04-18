import prisma from "@/lib/prisma";


export default async function handle(req, res) {
  const { faculty_ids, exam, shared_by } = req.body;

  try {
    const notifications = await Promise.all(
      faculty_ids.map((faculty_id) =>
        prisma.notification.create({
          data: {
            notification: `${shared_by} has shared ${exam.paper_name} result with you.`,
            faculty_id: faculty_id,
            exam_id: exam.paper_id,
          },
        })
      )
    );
    res.status(200).json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}
