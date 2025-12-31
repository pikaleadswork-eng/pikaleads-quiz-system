import { ReactNode } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import Footer from "./Footer";

interface QuizLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function QuizLayout({ children, title, subtitle }: QuizLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logo */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            <div className="flex items-center justify-center flex-1">
              <img
                src="/pikaleads-logo.png"
                alt="PIKALEADS"
                className="h-16 md:h-20 w-auto"
              />
            </div>
            <div className="flex-1 flex justify-end">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12 md:py-16">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4 leading-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
