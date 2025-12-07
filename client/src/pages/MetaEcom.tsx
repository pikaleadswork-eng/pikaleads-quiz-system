import { useState } from "react";
import Quiz from "@/components/Quiz";
import QuizLanding from "@/components/QuizLanding";
import { quizzes } from "@/lib/quizData";

export default function MetaEcom() {
  const [showQuiz, setShowQuiz] = useState(false);
  const config = quizzes.find((q) => q.id === "meta-ecom")!;

  if (!showQuiz) {
    return <QuizLanding quizId="meta-ecom" onStartQuiz={() => setShowQuiz(true)} />;
  }

  return <Quiz config={config} />;
}
