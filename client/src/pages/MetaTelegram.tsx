import Quiz from "@/components/Quiz";
import { quizzes } from "@/lib/quizData";

export default function MetaTelegram() {
  return <Quiz config={quizzes["meta-telegram"]!} />;
}
