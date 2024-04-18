import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    // Extract the paper ID from the request query parameter
    const { paperId } = req.query;
    console.log(paperId)

    // Use Prisma to find linked papers where either paperIdA or paperIdB matches the provided paperId
    const linkedPapers = await prisma.linkedPaper.findMany({
      where: {
        OR: [
          { paperIdA: paperId }, 
          { paperIdB: paperId }, 
        ],
      },
    });
    //we will check and send the paper id which is not equal to the paper id we are getting from the query
    //convert linked papers to json
    const papers =  JSON.parse(JSON.stringify(linkedPapers));
    console.log(papers)
    if (papers[0].paperIdA === paperId) {
      res.status(200).json({ paperId: papers[0].paperIdB });
    } else {
      res.status(200).json({ paperId: papers[0].paperIdA });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
