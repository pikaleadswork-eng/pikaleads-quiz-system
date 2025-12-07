import Quiz from "@/components/Quiz";
import { quizzes } from "@/lib/quizData";

export default function GoogleFurniture() {
  return <Quiz config={quizzes["google-furniture"]!} />;
}
