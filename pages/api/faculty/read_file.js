// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const readXlsxFile = require('read-excel-file/node')


export default async function handler(req, res) {
    let data = []
    const route = req.body.fileUrl;
    try {
        const rows = await readXlsxFile(route);

        for (let i = 0; i < rows.length; i++) {
            if (rows[i][0] === null) {
                data.push({
                    "stop_number": data[data.length - 1]["stop_number"],
                    "cosignment_number": rows[i][1],
                })
            } else {
                data.push({
                    "stop_number": rows[i][0],
                    "cosignment_number": rows[i][1],
                })
            }
        }
        res.status(200).json(data)
    } catch (e) {
        res.status(400).json("error")
    }

}