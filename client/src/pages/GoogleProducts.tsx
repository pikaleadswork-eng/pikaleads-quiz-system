import Quiz from "@/components/Quiz";
import { quizzes } from "@/lib/quizData";

export default function GoogleProducts() {
  return <Quiz config={quizzes["google-products"]!} />;
}
