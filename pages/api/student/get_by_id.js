// get student by p_number
import prisma from "@/lib/prisma";

const handle = async (req, res) => {
  let p_number = req.query;
  console.log(
    "🚀 ~ file: get_by_id.js ~ line 1 ~ handle ~ p_number",
    req.query
  );

  try {
    const student = await prisma.student.findUnique({
      where: {
        p_number: req.query.p_number,
      },
    });

    if (!student) return res.status(404).json("Student not found");
    res.status(200).json(student);
  } catch (error) {
    console.log(
      error
    );
    res.status(500).json(error);
  }
};

export default handle;
