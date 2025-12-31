import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ServicePageProps {
  heroImage: string;
  title: string;
  subtitle: string;
  description: string;
  problems: Array<{ icon: ReactNode; title: string; description: string }>;
  solution: {
    title: string;
    subtitle: string;
    steps: Array<{ number: string; title: string; description: string }>;
  };
  benefits: Array<{ icon: ReactNode; title: string; description: string }>;
  process: Array<{ step: string; title: string; description: string }>;
  faq: Array<{ question: string; answer: string }>;
  cta: { title: string; description: string };
  pageVisibility: string;
}

export function ServicePage(props: ServicePageProps) {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  const { data: cases } = trpc.caseStudies.getByPage.useQuery({ page: props.pageVisibility });
  const leadMutation = trpc.leads.create.useMutation({
    onSuccess: () => {
      toast.success("Дякуємо! Ми зв'яжемося з вами найближчим часом.");
      setFormData({ name: "", phone: "", message: "" });
    },
    onError: () => toast.error("Помилка відправки. Спробуйте ще раз."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    leadMutation.mutate({ ...formData, source: props.pageVisibility });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
                <span className="text-purple-400 text-sm font-medium">{props.subtitle}</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                {props.title}
              </h1>
              <p className="text-xl text-zinc-400 leading-relaxed">{props.description}</p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                  Замовити консультацію <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                  Дізнатися більше
                </Button>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 blur-3xl" />
              <div className="relative z-10 w-full aspect-square max-w-md mx-auto">
                <img src={props.heroImage} alt={props.title} className="w-full h-full object-contain drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-20 bg-zinc-900/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Знайомі проблеми?</h2>
            <p className="text-xl text-zinc-400">Ми знаємо, як їх вирішити</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {props.problems.map((problem, i) => (
              <Card key={i} className="bg-zinc-800/50 border-zinc-700 hover:border-purple-500/50 transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400">
                    {problem.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{problem.title}</h3>
                  <p className="text-zinc-400">{problem.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">{props.solution.title}</h2>
            <p className="text-xl text-zinc-400">{props.solution.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {props.solution.steps.map((step, i) => (
              <Card key={i} className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-purple-500/20 hover:border-purple-500/50 transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl font-black text-white">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-zinc-400">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Form Section */}
      <section className="py-20 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10">
        <div className="container max-w-2xl">
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-8">
              <h2 className="text-3xl font-black text-white mb-4 text-center">Отримайте безкоштовну консультацію</h2>
              <p className="text-zinc-400 mb-8 text-center">Залиште заявку і ми зв'яжемося з вами протягом 15 хвилин</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Ваше ім'я"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-zinc-900 border-zinc-700"
                />
                <Input
                  placeholder="Телефон"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="bg-zinc-900 border-zinc-700"
                />
                <Textarea
                  placeholder="Опишіть ваш проєкт (необов'язково)"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-zinc-900 border-zinc-700 min-h-[100px]"
                />
                <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700" disabled={leadMutation.isPending}>
                  {leadMutation.isPending ? "Відправка..." : "Отримати консультацію"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-16 text-center">Чому обирають нас</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {props.benefits.map((benefit, i) => (
              <Card key={i} className="bg-zinc-800/50 border-zinc-700 hover:border-cyan-500/50 transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center text-cyan-400">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{benefit.title}</h3>
                  <p className="text-zinc-400">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-zinc-900/50">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-16 text-center">Як ми працюємо</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {props.process.map((item, i) => (
              <div key={i} className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-black text-white">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="text-zinc-400">{item.description}</p>
                </div>
                {i < props.process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-purple-500/50 to-cyan-500/50" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      {cases && cases.length > 0 && (
        <section className="py-20">
          <div className="container">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-16 text-center">Кейси та результати</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cases.map((caseStudy) => (
                <Card key={caseStudy.id} className="bg-zinc-800/50 border-zinc-700 hover:border-purple-500/50 transition-all overflow-hidden group">
                  {caseStudy.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img src={caseStudy.imageUrl} alt={caseStudy.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  )}
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white">{caseStudy.title}</h3>
                    <p className="text-zinc-400 line-clamp-3">{caseStudy.description}</p>
                    {caseStudy.metrics && (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(caseStudy.metrics as Record<string, string>).map(([key, value]) => (
                          <div key={key} className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                            <span className="text-green-400 text-sm font-semibold">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-20 bg-zinc-900/50">
        <div className="container max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-16 text-center">Часті питання</h2>
          <div className="space-y-4">
            {props.faq.map((item, i) => (
              <Card key={i} className="bg-zinc-800/50 border-zinc-700 hover:border-purple-500/50 transition-all cursor-pointer" onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-bold text-white">{item.question}</h3>
                    <div className={`transition-transform ${expandedFaq === i ? "rotate-180" : ""}`}>
                      <ArrowRight className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  {expandedFaq === i && (
                    <p className="text-zinc-400 mt-4">{item.answer}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">{props.cta.title}</h2>
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">{props.cta.description}</p>
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-lg px-8 py-6">
            Почати зараз <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </div>
      </section>
    </div>
  );
}
