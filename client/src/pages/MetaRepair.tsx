import { useState } from "react";
import Quiz from "@/components/Quiz";
import QuizLanding from "@/components/QuizLanding";
import { quizzes } from "@/lib/quizData";

export default function MetaRepair() {
  const [showQuiz, setShowQuiz] = useState(false);
  const config = quizzes.find((q) => q.id === "meta-repair")!;

  if (!showQuiz) {
    return <QuizLanding quizId="meta-repair" onStartQuiz={() => setShowQuiz(true)} />;
  }

  return <Quiz config={config} />;
}
