import { useState } from "react";
import Quiz from "@/components/Quiz";
import QuizLanding from "@/components/QuizLanding";
import { quizzes } from "@/lib/quizData";

export default function GoogleEcom() {
  const [showQuiz, setShowQuiz] = useState(false);
  const config = quizzes.find((q) => q.id === "google-ecom")!;

  if (!showQuiz) {
    return <QuizLanding quizId="google-ecom" onStartQuiz={() => setShowQuiz(true)} />;
  }

  return <Quiz config={config} />;
}
