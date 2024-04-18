import prisma from "@/lib/prisma";
import { IncomingForm } from "formidable";
import mv from "mv";


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
            try {
                const ipData = {
                    ip_address: fields.ip_address,
                    rank: fields.rank,
                    role: fields.role,
                };

                prisma.Ip
                    .update({
                        where: {
                            ip_address: fields.prev_ip,
                        },
                        data: ipData,
                        select: {
                            ip_address: true,
                            rank: true,
                            role: true,
                        },
                    })
                    .then(resolve)
                    .catch(reject);



            } catch (err) {
                console.error(err);
                return reject(err);
            }
        });
    });
    res.status(200).json(data);
};

export default handler;
