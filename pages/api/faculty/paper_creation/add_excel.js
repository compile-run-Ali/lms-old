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
      const { paperId, total_marks } = fields;
      const float_marks = parseFloat(total_marks);
      const ExcelFile = files.Excel;
      const WordFile = files.Word

      const oldPath = ExcelFile.filepath;
      let fileName = ExcelFile.originalFilename.replace(/,/g, ""); // Remove commas from the filename
      const newPath = `./public/excels/${fileName.replace(/,/g, "")}`; // Remove commas from the path

      const oldPathWord = WordFile.filepath;
      let fileNameWord = WordFile.originalFilename.replace(/,/g, ""); // Remove commas from the filename
      const newPathWOrd = `./public/excels/${fileNameWord.replace(/,/g, "")}`; // Remove commas from the path

      fileName = paperId + fileName;
      fileNameWord = paperId + fileNameWord;

      mv(oldPath, newPath, function (err) {
        if (err) {
          console.log(err);
        }
      });

      mv(oldPathWord, newPathWOrd, function (err) {
        if (err) {
          console.log(err);
        }
      });
      const newIE = await prisma.IeQuestion.create({
        data: {
          fileName: fileName,
          fileUrl: newPath,
          fileNameWord: fileNameWord,
          fileUrlWord: newPathWOrd,
          total_marks: float_marks,
          paper: {
            connect: {
              paper_id: paperId,
            },
          },
        },
      });

      // We will also have to update marks in the paper table
      const paper = await prisma.paper.findUnique({
        where: {
          paper_id: paperId,
        },
      });
      const newMarks = paper.total_marks + float_marks;
      const updatedPaper = await prisma.paper.update({
        where: {
          paper_id: paperId,
        },
        data: {
          total_marks: newMarks,
        },
      });
      console.log(updatedPaper);

      res.status(200).json(newIE);
    } catch (e) {
      console.log("error");
      console.log(e);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });
}
