import prisma from "@/lib/prisma";

const handler = async (req, res) => {
      try {
        const paperComments = await prisma.paperComment.findMany({
            where: {    
                paper_id: req.body.paper_id,
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
                time: true,
                user_generated: true,
            },
        });
        res.status(200).json(paperComments);
    } catch (err) {
        throw new Error(err.message);
    }
}

export default handler;