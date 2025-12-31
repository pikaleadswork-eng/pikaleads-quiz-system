import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Скільки коштують ваші послуги?",
    answer: "Ціна обговорюється індивідуально в залежності від обсягу роботи і задач. Кожен проєкт унікальний, тому ми аналізуємо ваш бізнес, цілі та бюджет, щоб запропонувати оптимальне рішення. Зв'яжіться з нами для безкоштовної консультації та розрахунку вартості."
  },
  {
    question: "Як швидко можна запустити рекламу?",
    answer: "Meta Ads та Telegram Ads - 1-3 дні. Google Ads - 3-5 днів. TikTok Ads - 3-5 днів (включно з підготовкою креативів). X (Twitter) Ads - 2-3 дні. Перші результати зазвичай видно через 3-7 днів після запуску. Повна оптимізація кампанії займає 2-4 тижні."
  },
  {
    question: "Який мінімальний бюджет потрібен для старту?",
    answer: "Рекомендуємо мінімум $500-1000 на рекламний бюджет + вартість послуг агенції. Для Meta Ads оптимально $30-50/день, Google Ads $40-60/день, TikTok Ads $50-100/день. Менший бюджет не дасть достатньо даних для оптимізації. Ми працюємо тільки з клієнтами, готовими інвестувати в результат."
  },
  {
    question: "Які гарантії результату ви надаєте?",
    answer: "Ми гарантуємо професійний підхід, прозорість звітності та постійну оптимізацію. Конкретні KPI (CPL, ROAS, ROI) обговорюємо індивідуально після аналізу ніші. Якщо протягом першого місяця не досягнемо узгоджених показників - продовжимо роботу безкоштовно або повернемо оплату за послуги (рекламний бюджет не повертається)."
  },
  {
    question: "Чи потрібно мені самому створювати креативи?",
    answer: "Ні, ми беремо це на себе. У вартість послуг входить: написання текстів, підбір зображень, створення банерів, монтаж відео (для TikTok/Reels). Якщо потрібен професійний дизайн або відеозйомка - це окрема послуга від $200. Ви тільки надаєте інформацію про продукт, ми створюємо креативи, які продають."
  },
  {
    question: "Як часто ви надаєте звіти?",
    answer: "Щотижневі звіти з основними метриками (ліди, витрати, CPL, ROAS). Щомісячні детальні звіти з аналізом та рекомендаціями. Доступ до рекламних кабінетів 24/7 - ви завжди бачите, куди йдуть гроші. Також проводимо онлайн-зустрічі раз на 2 тижні для обговорення результатів та стратегії."
  },
  {
    question: "Які ніші ви НЕ берете в роботу?",
    answer: "Не працюємо з: азартними іграми, фінансовими пірамідами, криптовалютними проектами без ліцензій, товарами для дорослих, медичними послугами без сертифікатів, нелегальними товарами. Також не беремо проекти з бюджетом менше $500/міс або якщо продукт/послуга не відповідає нашим етичним стандартам."
  },
  {
    question: "Чи можу я відмовитися від послуг у будь-який момент?",
    answer: "Так, ми працюємо без прив'язки до довгострокових контрактів. Мінімальний термін співпраці - 1 місяць (потрібен для тестування та збору даних). Після цього можете відмовитися у будь-який момент з повідомленням за 7 днів. Повертаємо доступи до всіх кабінетів та передаємо всі матеріали."
  },
  {
    question: "Чи працюєте ви з міжнародними проектами?",
    answer: "Так, маємо досвід роботи з 12+ країнами: Україна, Польща, Німеччина, США, Канада, Великобританія, ОАЕ та інші. Запускаємо рекламу на будь-яких ринках, де доступні Meta, Google, TikTok, X. Враховуємо локальні особливості, часові пояни, мову та культурні відмінності. Комунікація англійською/українською/російською."
  },
  {
    question: "Що робити, якщо у мене вже є налаштована реклама?",
    answer: "Проведемо безкоштовний аудит поточних кампаній (15-20 хв). Покажемо, що можна покращити, де втрачаються гроші, які є точки зростання. Якщо ваші кампанії налаштовані добре - чесно скажемо про це. Якщо є що оптимізувати - запропонуємо план дій. Можемо взяти в роботу існуючі кабінети або створити нові."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-full mb-6">
            <span className="text-sm font-mono text-purple-300">FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white" style={{ fontFamily: 'Eurostile, sans-serif' }}>
            ЧАСТІ ПИТАННЯ
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            Відповіді на найпопулярніші питання про наші послуги, процес роботи та умови співпраці
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-purple-500/30"
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors duration-200 hover:bg-zinc-800/50"
              >
                <span className="text-base sm:text-lg font-semibold text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-yellow-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5 pt-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-4" />
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
