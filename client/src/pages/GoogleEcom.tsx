import Quiz from "@/components/Quiz";
import { quizzes } from "@/lib/quizData";

export default function GoogleEcom() {
  return <Quiz config={quizzes["google-ecom"]!} />;
}
