import { useState } from "react";
import Quiz from "@/components/Quiz";
import QuizLanding from "@/components/QuizLanding";
import { quizzes } from "@/lib/quizData";

export default function MetaTelegram() {
  const [showQuiz, setShowQuiz] = useState(false);
  const config = quizzes.find((q) => q.id === "meta-telegram")!;

  if (!showQuiz) {
    return <QuizLanding quizId="meta-telegram" onStartQuiz={() => setShowQuiz(true)} />;
  }

  return <Quiz config={config} />;
}
