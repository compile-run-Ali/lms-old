import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { course_code } = req.query;
  console.log(course_code)
  try {

    const papers = await prisma.paper.findMany({
      where: {
        course_code: course_code,
      },
    });

    res.status(200).json(papers);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}
