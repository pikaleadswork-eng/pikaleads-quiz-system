import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import QuizLanding from "@/components/QuizLanding";
import Quiz from "@/components/Quiz";
import { quizzesMap } from "@/lib/quizData";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ECommerceQuiz() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const [showQuiz, setShowQuiz] = useState(false);
  const config = quizzesMap["meta-ecom"];

  // Capture UTM parameters from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmData = {
      campaign: params.get("utm_campaign") || "",
      adgroup: params.get("utm_adgroup") || "",
      ad: params.get("utm_ad") || "",
      placement: params.get("utm_placement") || "",
      keyword: params.get("utm_keyword") || "",
      site: params.get("utm_site") || "",
      source: params.get("utm_source") || "",
      medium: params.get("utm_medium") || "",
      content: params.get("utm_content") || "",
      term: params.get("utm_term") || "",
    };
    sessionStorage.setItem("utmParams", JSON.stringify(utmData));
  }, []);

  if (!config) {
    return <div>Quiz not found</div>;
  }

  if (showQuiz) {
    return (
      <Quiz config={config} />
    );
  }

  return (
    <QuizLanding
      quizId="e-commerce"
      onStartQuiz={() => setShowQuiz(true)}
    />
  );
}
