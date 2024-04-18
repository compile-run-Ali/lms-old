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
    const filePathWord = path.join(process.cwd(), file.fileUrlWord);

    // Check if the file exists
    if (!fs.existsSync(filePathWord)) {
      return res.status(404).json({ error: "File not found" });
    }
    const mimeTypeWord = mime.getType(filePathWord);
    // Set the appropriate headers for the download response
    res.setHeader("Content-Disposition", `attachment; filename=`+file.fileNameWord);
    res.setHeader("Content-Type", mimeTypeWord);
    res.setHeader("Content-Length", fs.statSync(filePathWord).size);

    // Stream the file as the response
    const fileStreamWord = fs.createReadStream(filePathWord);
    fileStreamWord.pipe(res);
  } catch (err) {
    console.error("Error downloading file:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
