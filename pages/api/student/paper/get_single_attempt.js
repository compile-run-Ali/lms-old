// api that fetches student paper attempt aka SPA where student and paper id match

import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const {  p_number,  paper_id } = req.query;
  try {
    const spa = await prisma.sPA.findUnique({
      where: {
        spaId: p_number + paper_id,
      },
    });

    if (!spa) {
      return res.status(404).json({ message: "SPA not found" });
    }

    return res.json(spa);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
