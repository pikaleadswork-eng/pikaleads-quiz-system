import Quiz from "@/components/Quiz";
import { quizzes } from "@/lib/quizData";

export default function MetaRepair() {
  return <Quiz config={quizzes["meta-repair"]!} />;
}
