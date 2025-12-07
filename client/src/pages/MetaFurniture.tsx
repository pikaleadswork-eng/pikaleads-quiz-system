import Quiz from "@/components/Quiz";
import { quizzes } from "@/lib/quizData";

export default function MetaFurniture() {
  return <Quiz config={quizzes["meta-furniture"]!} />;
}
