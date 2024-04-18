import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { IncomingForm } from "formidable";

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler = async (req, res) => {
    const data = await new Promise((resolve, reject) => {
        const form = new IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error(err);
                return reject(err);
            }
            const ipData = {
                ip_address: Number(fields.ip_address),
                /* rank: fields.rank, */
                role: fields.role,
            };
            try {
                prisma.Ip
                    .create({
                        data: {
                            ip_address: fields.ip_address,
                            /* rank: fields.rank, */
                            role: fields.role,
                        }
                    })
                    .then(resolve)
                    .catch(reject);
            }
            catch (err) {
                console.error(err);
                return reject(err);
            }
        });
    });
    res.status(200).json({
        ...data,
        ipExists: false,
    });
};

export default handler;
