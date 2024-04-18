// api to get student subjective answer

import prisma from "@/lib/prisma";


export default async function handler(req, res) {
  console.log("received", req.query.sq_ids);
  try {
    const p_number = req.query.p_number;
    const sq_ids = req.query.sq_ids.split(","); // Split the sq_ids string into an array
    const existingSSAs = await prisma.sSA.findMany({
      where: {
        ssa_id: {
          // Filter the results to include only the sq_ids in the array
          in: sq_ids.map((sq_id) => p_number + sq_id),
        },
      },
    });

    if (existingSSAs) {
      res.status(200).json(existingSSAs);
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    console.log(err);
  }
}
