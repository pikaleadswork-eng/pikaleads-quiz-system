import Quiz from "@/components/Quiz";
import { quizzes } from "@/lib/quizData";

export default function GoogleTelegram() {
  return <Quiz config={quizzes["google-telegram"]!} />;
}
