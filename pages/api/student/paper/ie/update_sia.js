import prisma from "@/lib/prisma";
import { IncomingForm } from "formidable";
import mv from "mv";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to parse form data" });
    }

    try {
      const { paperId, studentId } = fields;

      const file = files.files;
      const oldPath = file.filepath;
      // let fileName = file.originalFilename.replace(/,/g, ""); // Remove commas from the filename
      let fileName = `${studentId}_${file.originalFilename.replace(/,/g, "")}`
      const newPath = `./public/attempts/${fileName.replace(/,/g, "")}`; // Remove commas from the path
      mv(oldPath, newPath, function (err) {
        if (err) {
          console.log(err);
        }
      });

      const newSIA = await prisma.sIA.create({
        data: {
          fileName: fileName,
          fileUrl: newPath,
          paperId: paperId,
          studentId: studentId,
        },
      });

      res.status(200).json(newSIA);
    } catch (e) {
      console.log("error");
      console.log(e);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });
}
