import prisma from "@/lib/prisma";
import bcrypt from "bcrypt"



const handler = async (req, res) => {
    if (req.method === "POST")
    {
      
        const {p_number, name, phone_number, email, cgpa, password, DOB } = req.body;

        try
        {
            const hash = await bcrypt.hash(password, 0);
            const newStudent = await prisma.student.create({
                data: {
                  p_number,
                  name,
                  phone_number,
                  email,
                  cgpa,
                  DOB,
                  rank,
                  password: hash
                }
            });

            return res.status(200).json(newStudent);
        }
        catch (err)
        {
            return res.status(503).json({err: err.toString()});
        }
    }
    else
    {
        return res.status(405).json({error: "This request only supports POST requests"})
    }
}

export default handler;