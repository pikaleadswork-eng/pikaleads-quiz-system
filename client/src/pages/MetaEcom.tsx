import Quiz from "@/components/Quiz";
import { quizzes } from "@/lib/quizData";

export default function MetaEcom() {
  return <Quiz config={quizzes["meta-ecom"]!} />;
}
