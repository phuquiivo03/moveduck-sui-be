export type Answer = "A" | "B" | "C" | "D";

export type IQuizzRequest = {
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: Answer;
  imageUrl: string;
  styleId: number;
};

export type IQuizzValidateRequest = {
  quizId: string;
  select: Answer;
};


