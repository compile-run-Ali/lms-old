import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    //Find IP
    const ip = await prisma.Ip.findMany({
      select: {
        ip_address: true,
        /* rank: true, */
        role: true,
      },
    });
    res.status(200).json(ip);
  } catch (err) {
    console.log(err.message);
  }
};

export default handler;
