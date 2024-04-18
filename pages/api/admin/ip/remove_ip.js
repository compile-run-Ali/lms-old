import prisma from "@/lib/prisma";

const handler = async (req, res) => {
  try {
    await prisma.Ip.delete({
      where: {
        ip_address: req.body.ip_address,
      }
    })
    await prisma.$disconnect()
    res.status(200).json({message: "Ip has been Deleted"})
  } catch (err) {
    console.log(err.message)
  }
}

export default handler