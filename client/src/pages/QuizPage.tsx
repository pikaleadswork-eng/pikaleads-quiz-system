import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-2xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{quiz.name}</h1>
          <p className="text-xl text-gray-300 mb-12">{quiz.description}</p>
          <Button 
            onClick={() => setQuizStarted(true)}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-6 text-lg"
          >
            Почати квіз →
          </Button>
        </div>
      </div>
    );
  }

  // Quiz questions and lead form - to be implemented
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-3xl font-bold text-white mb-4">{quiz.name}</h1>
        <p className="text-gray-400 mb-8">{quiz.description}</p>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
          <p className="text-yellow-400 text-lg mb-2">🚧 Quiz Questions Coming Soon</p>
          <p className="text-gray-400 text-sm">
            The quiz designer is ready in the admin panel. Questions and lead form integration is in development.
          </p>
        </div>
      </div>
    </div>
  );
}
