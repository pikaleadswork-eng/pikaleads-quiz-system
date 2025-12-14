import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function QuizPage() {
  const [, params] = useRoute("/quiz/:slug");
  const slug = params?.slug || "";
  
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

  // Load quiz by slug
  const { data: quiz, isLoading, error } = trpc.quizzes.getBySlug.useQuery({ slug });
  
  // Load quiz questions
  const { data: questions = [], isLoading: questionsLoading } = trpc.quizDesign.getQuestions.useQuery(
    { quizId: quiz?.id || 0 },
    { enabled: !!quiz?.id && quizStarted }
  );

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

  // Show lead form after all questions
  if (showLeadForm) {
    if (submitted) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full text-center">
            <div className="inline-block bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-full mb-8">
              Ваша знижка <span className="font-bold">15 %</span> 👍
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Дякуємо за вашу заявку</h2>
            <p className="text-xl text-gray-600 mb-12">
              Ми з вами зв'яжемось протягом 15 - 20 хвилин
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - info */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Залишіть свої контакти для зв'язку</h2>
            <p className="text-gray-600 mb-6">Тільки правильні дані для зв'язку</p>
          </div>

          {/* Right side - form */}
          <Card className="p-8 bg-white shadow-lg">
            <div className="inline-block bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-full mb-6">
              Ваша знижка <span className="font-bold">15 %</span> 👍
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              console.log("Lead data:", { ...leadData, quizId: quiz.id, answers });
              setSubmitted(true);
            }} className="space-y-4">
              <div>
                <Label className="text-gray-700 text-sm font-medium">ВВЕДИТЕ ІМ'Я</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                  <input 
                    type="text" 
                    required
                    placeholder="Іван"
                    value={leadData.name}
                    onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:border-yellow-500 focus:outline-none" 
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-gray-700 text-sm font-medium">ВВЕДИТЕ EMAIL</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                  <input 
                    type="email" 
                    required
                    placeholder="mail@example.com"
                    value={leadData.email}
                    onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:border-yellow-500 focus:outline-none" 
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-gray-700 text-sm font-medium">ВВЕДИТЕ ТЕЛЕФОН</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📞</span>
                  <input 
                    type="tel" 
                    required
                    placeholder="+7 (900) 000-00-00"
                    value={leadData.phone}
                    onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:border-yellow-500 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Checkbox id="privacy" defaultChecked />
                <Label htmlFor="privacy" className="cursor-pointer">
                  Я погоджуюсь на <span className="text-yellow-600 underline">обробку персональних даних</span> згідно <span className="text-yellow-600 underline">політике конфіденціальності</span>
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white py-4 text-lg font-semibold mt-6"
              >
                Отримати результати
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  // Show quiz questions
  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Завантаження питань...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-2xl px-4">
          <h1 className="text-3xl font-bold text-white mb-4">{quiz.name}</h1>
          <p className="text-yellow-400">🚧 Питання ще не додані до цього квізу</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowLeadForm(true);
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: [value],
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Питання {currentQuestionIndex + 1} з {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <Card className="p-8 bg-gray-900 border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6">{currentQuestion.question}</h2>
          
          {currentQuestion.type === 'single' && (
            <RadioGroup 
              value={answers[currentQuestion.id]?.[0] || ""}
              onValueChange={handleAnswerChange}
            >
              <div className="space-y-3">
                {currentQuestion.options?.map((option: any, idx: number) => (
                  <div key={idx} className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 cursor-pointer">
                    <RadioGroupItem value={option.text} id={`option-${idx}`} />
                    <Label htmlFor={`option-${idx}`} className="text-white cursor-pointer flex-1">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {currentQuestion.type === 'multiple' && (
            <div className="space-y-3">
              {currentQuestion.options?.map((option: any, idx: number) => (
                <div key={idx} className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 cursor-pointer">
                  <Checkbox 
                    id={`option-${idx}`}
                    checked={answers[currentQuestion.id]?.includes(option.text) || false}
                    onCheckedChange={(checked) => {
                      const current = (answers[currentQuestion.id] as string[]) || [];
                      if (checked) {
                        setAnswers({
                          ...answers,
                          [currentQuestion.id]: [...current, option.text],
                        });
                      } else {
                        setAnswers({
                          ...answers,
                          [currentQuestion.id]: current.filter((a: string) => a !== option.text),
                        });
                      }
                    }}
                  />
                  <Label htmlFor={`option-${idx}`} className="text-white cursor-pointer flex-1">
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-4 mt-8">
            {currentQuestionIndex > 0 && (
              <Button 
                variant="outline"
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                className="flex-1"
              >
                ← Назад
              </Button>
            )}
            <Button 
              onClick={handleNext}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              disabled={!answers[currentQuestion.id] || (answers[currentQuestion.id] as string[]).length === 0}
            >
              {currentQuestionIndex < questions.length - 1 ? 'Далі →' : 'Завершити'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
