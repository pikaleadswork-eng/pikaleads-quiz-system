import Quiz from "@/components/Quiz";
import { quizzes } from "@/lib/quizData";

export default function MetaProducts() {
  return <Quiz config={quizzes["meta-products"]!} />;
}
