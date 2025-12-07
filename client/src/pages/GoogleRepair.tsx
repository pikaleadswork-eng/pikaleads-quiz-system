import Quiz from "@/components/Quiz";
import { quizzes } from "@/lib/quizData";

export default function GoogleRepair() {
  return <Quiz config={quizzes["google-repair"]!} />;
}
