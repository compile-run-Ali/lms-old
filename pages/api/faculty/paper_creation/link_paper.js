import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  console.log(req.body);
  try {
    //Create Paper and connect to course code then connect course with paperid
    const linkedPapers = await prisma.LinkedPaper.create({
      data: {
        paperIdA: req.body.paperIdA,
        paperIdB: req.body.paperIdB,
      },
    });
    console.log(linkedPapers);
    res.status(200).json(linkedPapers);
  } catch (err) {
    throw new Error(err.message);
  }
};

export default handler;