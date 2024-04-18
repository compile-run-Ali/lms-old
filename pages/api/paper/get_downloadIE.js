import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";
var mime = require('mime');

export default async function handler(req, res) {
  const { fileId } = req.query;

  try {
    // Retrieve the file details from the database
    const file = await prisma.ieQuestion.findUnique({
      where: {
        ie_id: fileId,
      },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Construct the absolute file path on the server
    console.log(file.fileUrl)
    const filePath = path.join(process.cwd(), file.fileUrl);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }
    const mimeType = mime.getType(filePath);
    // Set the appropriate headers for the download response
    res.setHeader("Content-Disposition", `attachment; filename=`+file.fileName);
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Length", fs.statSync(filePath).size);

    // Stream the file as the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err) {
    console.error("Error downloading file:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
