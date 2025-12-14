import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import Quiz from "@/components/Quiz";
import QuizLanding from "@/components/QuizLanding";
import { useState } from "react";

export default function QuizPage() {
  const [, params] = useRoute("/quiz/:slug");
  const slug = params?.slug || "";
  
  const [quizStarted, setQuizStarted] = useState(false);

  // Load quiz by slug
  const { data: quiz, isLoading, error } = trpc.quizzes.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading quiz...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Quiz not found</h1>
          <p className="text-gray-400">The quiz you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // For now, show a simple message - need to integrate with existing Quiz component
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">{quiz.name}</h1>
        <p className="text-gray-400 mb-8">{quiz.description}</p>
        <p className="text-yellow-400">Quiz functionality coming soon...</p>
        <p className="text-sm text-gray-500 mt-4">Quiz ID: {quiz.id} | Slug: {slug}</p>
      </div>
    </div>
  );
}
