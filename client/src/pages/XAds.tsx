import ServicePage from "@/components/ServicePage";

export default function XAds() {
  const pageData = {
    hero: {
      title: { uk: "X (Twitter) Ads", ru: "X (Twitter) Ads", en: "X (Twitter) Ads" },
      subtitle: { uk: "Реклама для бізнес-аудиторії", ru: "Реклама для бизнес-аудитории", en: "Advertising for business audience" },
      description: { uk: "Залучайте платоспроможну аудиторію X з високою конверсією.", ru: "Привлекайте платежеспособную аудиторию X с высокой конверсией.", en: "Attract solvent X audience with high conversion." },
      image: "/hero-x.png",
      stats: [
        { value: "$0.5", label: { uk: "CPC", ru: "CPC", en: "CPC" } },
        { value: "15%", label: { uk: "CTR", ru: "CTR", en: "CTR" } },
        { value: "500K", label: { uk: "Охоплення/місяць", ru: "Охват/месяц", en: "Reach/month" } }
      ]
    },
    problems: {
      title: { uk: "Чому реклама в X не працює?", ru: "Почему реклама в X не работает?", en: "Why X ads don't work?" },
      items: [
        { icon: "❌", title: { uk: "Неправильна аудиторія", ru: "Неправильная аудитория", en: "Wrong audience" }, description: { uk: "X - це не Facebook. Тут інша аудиторія та підходи.", ru: "X - это не Facebook. Здесь другая аудитория и подходы.", en: "X is not Facebook. Different audience and approaches here." } },
        { icon: "💸", title: { uk: "Високий CPC", ru: "Высокий CPC", en: "High CPC" }, description: { uk: "Без оптимізації CPC може бути $2-5 за клік.", ru: "Без оптимизации CPC может быть $2-5 за клик.", en: "Without optimization CPC can be $2-5 per click." } },
        { icon: "📉", title: { uk: "Мало конверсій", ru: "Мало конверсий", en: "Few conversions" }, description: { uk: "Багато кліків, але мало продажів? Проблема в оффері.", ru: "Много кликов, но мало продаж? Проблема в оффере.", en: "Many clicks but few sales? Problem is in offer." } }
      ]
    },
    solution: {
      title: { uk: "Як ми запускаємо X Ads", ru: "Как мы запускаем X Ads", en: "How we launch X Ads" },
      steps: [
        { number: "01", title: { uk: "Аналіз ніші", ru: "Анализ ниши", en: "Niche analysis" }, description: { uk: "Вивчаємо вашу аудиторію в X.", ru: "Изучаем вашу аудиторию в X.", en: "We study your audience in X." }, icon: "🎯" },
        { number: "02", title: { uk: "Створення креативів", ru: "Создание креативов", en: "Creative creation" }, description: { uk: "Робимо текстові та візуальні оголошення.", ru: "Делаем текстовые и визуальные объявления.", en: "We create text and visual ads." }, icon: "✍️" },
        { number: "03", title: { uk: "Налаштування", ru: "Настройка", en: "Setup" }, description: { uk: "Запускаємо кампанії з різними стратегіями.", ru: "Запускаем кампании с разными стратегиями.", en: "We launch campaigns with different strategies." }, icon: "⚙️" },
        { number: "04", title: { uk: "Оптимізація", ru: "Оптимизация", en: "Optimization" }, description: { uk: "Знижуємо CPC, підвищуємо конверсії.", ru: "Снижаем CPC, повышаем конверсии.", en: "We reduce CPC, increase conversions." }, icon: "📈" }
      ]
    },
    serviceType: "x_ads",
    howWeWork: {
      title: { uk: "Процес роботи", ru: "Процесс работы", en: "Work process" },
      steps: [
        { title: { uk: "Аудит", ru: "Аудит", en: "Audit" }, description: { uk: "Аналізуємо ваш бізнес та конкурентів.", ru: "Анализируем ваш бизнес и конкурентов.", en: "We analyze your business and competitors." }, duration: { uk: "1-2 дні", ru: "1-2 дня", en: "1-2 days" } },
        { title: { uk: "Запуск", ru: "Запуск", en: "Launch" }, description: { uk: "Налаштовуємо кампанії.", ru: "Настраиваем кампании.", en: "We set up campaigns." }, duration: { uk: "2-3 дні", ru: "2-3 дня", en: "2-3 days" } }
      ]
    },
    faq: [
      { question: { uk: "Скільки коштує реклама в X?", ru: "Сколько стоит реклама в X?", en: "How much does X advertising cost?" }, answer: { uk: "Мінімальний бюджет - $1000/місяць.", ru: "Минимальный бюджет - $1000/месяц.", en: "Minimum budget - $1000/month." } }
    ]
  };

  return <ServicePage {...pageData} />;
}
