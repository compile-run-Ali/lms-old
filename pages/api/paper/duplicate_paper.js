import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    console.log("FINDING PAPER", req.body);
    const { id } = req.body;
    const originalPaper = await prisma.paper.findUnique({
      where: { paper_id: id },
      include: {
        objective_questions: true,
        subjective_questions: {
          include: {
            child_question: true,
          },
        },
        ie_questions: true,
      },
    });
    if (!originalPaper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    const {
      paper_id,
      examofficer,
      PaperComment,
      attempts,
      ie_questions,
      objective_questions,
      subjective_questions,
      ...newPaper
    } = originalPaper;

    const newObjectiveQuestions = originalPaper.objective_questions.map(
      (question) => {
        const { oq_id, ...newQuestion } = question;
        return newQuestion;
      }
    );

    const newSubjectiveQuestions = originalPaper.subjective_questions.map(
      (question) => {
        const { sq_id, ...newQuestion } = question;
        return newQuestion;
      }
    );

    const newIEQuestions = originalPaper.ie_questions.map((question) => {
      const { ie_id, ...newQuestion } = question;
      return newQuestion;
    });

    console.log("NEW PAPER", newPaper);

    const createdPaper = await prisma.paper.create({
      data: {
        ...newPaper,
        paper_name: `${newPaper.paper_name} (copy)`,
        status: "Draft",
      },
    });

    const createdObjectiveQuestions = await prisma.objectiveQuestion.createMany(
      {
        data: newObjectiveQuestions.map((question) => ({
          ...question,
          paper_id: createdPaper.paper_id,
        })),
      }
    );

    /* 
model SubjectiveQuestion {
  sq_id String @id @default(uuid())

  questionnumber Int
  question       String
  long_question  Boolean
  marks          Int

  paper    Paper  @relation(fields: [paper_id], references: [paper_id], onDelete: Cascade)
  paper_id String

  child_question SubjectiveQuestion[] @relation("QuestionByParts")

  parent_sq_id    String?
  parent_question SubjectiveQuestion? @relation("QuestionByParts", fields: [parent_sq_id], references: [sq_id], onDelete: Cascade)

  student_attempts SSA[]
}
    */

    // if subjective questions have child questions, its child id will be saved
    // in the parent question's child_id field. So we need to update the child_id
    // field of the new subjective questions to point to the new child questions
    // that were created

    // const createdSubjectiveQuestions =
    //   await prisma.subjectiveQuestion.createMany({
    //     data: newSubjectiveQuestions.map((question) => ({
    //       ...question,
    //       paper_id: createdPaper.paper_id,
    //     })),
    //   });

    const createdSubjectiveQuestions = await Promise.all(
      newSubjectiveQuestions.map(async (question) => {
        // if question is a child question, dont create it
        if (question.parent_sq_id) {
          return;
        }

        // else create the question
        const { child_question, ...newQuestion } = question;
        const createdQuestion = await prisma.subjectiveQuestion.create({
          data: {
            ...newQuestion,
            paper_id: createdPaper.paper_id,
          },
        });

        // if question has child questions, create them
        if (child_question) {
          const createdChildQuestions = await Promise.all(
            child_question.map(async (child) => {
              const { parent_question, parent_sq_id, sq_id, ...newChild } =
                child;
              const createdChild = await prisma.subjectiveQuestion.create({
                data: {
                  ...newChild,
                  paper_id: createdPaper.paper_id,
                  parent_sq_id: createdQuestion.sq_id,
                },
              });
              return createdChild;
            })
          );
          return {
            ...createdQuestion,
            child_question: createdChildQuestions,
          };
        }
        return createdQuestion;
      })
    );

    const createdIEQuestions = await prisma.ieQuestion.createMany({
      data: newIEQuestions.map((question) => ({
        ...question,
        paper_id: createdPaper.paper_id,
      })),
    });

    return res.status(200).json({
      ...createdPaper,
      objective_questions: createdObjectiveQuestions,
      subjective_questions: createdSubjectiveQuestions,
      ie_questions: createdIEQuestions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
