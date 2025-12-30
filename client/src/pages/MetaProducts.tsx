import { useState } from "react";
import Quiz from "@/components/Quiz";
import QuizLanding from "@/components/QuizLanding";
import { quizzes } from "@/lib/quizData";

export default function MetaProducts() {
  const [showQuiz, setShowQuiz] = useState(false);
  const config = quizzes.find((q) => q.id === "meta-products")!;

  if (!showQuiz) {
    return <QuizLanding quizId="meta-products" onStartQuiz={() => setShowQuiz(true)} />;
  }

  return <Quiz config={config} />;
}
