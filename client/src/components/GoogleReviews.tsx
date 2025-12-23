import { Star } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  initials: string;
  date: string;
  rating: 5;
  text: string;
  avatar: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Олександр Коваленко",
    initials: "ОК",
    date: "2 тижні тому",
    rating: 5,
    text: "Працюємо з PIKALEADS вже 4 місяці. Запустили рекламу меблів через Meta Ads - результат перевершив очікування! CPL знизився з $12 до $4.5, а конверсія виросла на 280%. Команда професійна, завжди на зв'язку. Рекомендую!",
    avatar: "#3B82F6"
  },
  {
    id: 2,
    name: "Марина Шевченко",
    initials: "МШ",
    date: "1 місяць тому",
    rating: 5,
    text: "Найкраще агентство з трафіку в Україні! Допомогли налаштувати Google Ads для нашої стоматології. За перший місяць отримали 87 якісних лідів при вартості $12 за ліда. ROI 420%! Дякую за професіоналізм!",
    avatar: "#EC4899"
  },
  {
    id: 3,
    name: "Дмитро Петренко",
    initials: "ДП",
    date: "3 тижні тому",
    rating: 5,
    text: "Запускали TikTok Ads для інтернет-магазину одягу. Креативи зайшли на ура - 2.5 млн переглядів за тиждень! CPM всього $1.2, а продажі виросли в 3 рази. PIKALEADS - це справжні експерти в performance-маркетингу.",
    avatar: "#10B981"
  },
  {
    id: 4,
    name: "Анна Мельник",
    initials: "АМ",
    date: "2 місяці тому",
    rating: 5,
    text: "Працювали з багатьма агентствами, але PIKALEADS - це інший рівень. Налаштували Telegram Ads для онлайн-школи - 340 лідів за місяць при вартості $3.8. Аналітика на висоті, звіти детальні. Продовжуємо співпрацю!",
    avatar: "#F59E0B"
  },
  {
    id: 5,
    name: "Сергій Бондаренко",
    initials: "СБ",
    date: "1 тиждень тому",
    rating: 5,
    text: "Замовляли розробку лендінгу + налаштування Meta Ads. Сайт зробили за 8 днів, дизайн супер! Реклама запрацювала одразу - конверсія 14% з трафіку. ROAS 520%. Рекомендую всім, хто шукає результат, а не обіцянки!",
    avatar: "#8B5CF6"
  },
  {
    id: 6,
    name: "Ірина Ткаченко",
    initials: "ІТ",
    date: "3 місяці тому",
    rating: 5,
    text: "Найкращий вибір для e-commerce! Налаштували Google Shopping + Performance Max. За 2 місяці продажі виросли на 380%, а ROAS стабільно тримається на рівні 680%. Команда завжди на зв'язку, швидко реагує на зміни ринку.",
    avatar: "#EF4444"
  }
];

export default function GoogleReviews() {
  const averageRating = 5.0;
  const totalReviews = reviews.length;

  return (
    <section className="relative py-12 md:py-20 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,217,61,0.05)_0%,transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(91,46,144,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(91,46,144,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 animate-fadeInUp">
          <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-purple-900/30 to-yellow-900/30 border border-yellow-400/20 rounded-full">
            <span className="text-yellow-400 text-xs md:text-sm font-semibold tracking-wider uppercase">
              ⭐ Відгуки клієнтів
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6" style={{ fontFamily: 'Eurostile, sans-serif' }}>
            <span className="text-white">ЩО КАЖУТЬ </span>
            <span className="text-yellow-400" style={{ textShadow: '0 0 30px rgba(255,217,61,0.5)' }}>КЛІЄНТИ</span>
          </h2>

          {/* Overall Rating */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-5xl md:text-6xl font-bold text-yellow-400">{averageRating}</span>
              <div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-400 mt-1">{totalReviews} відгуків</p>
              </div>
            </div>
            
            {/* Google Logo */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/20">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-white font-semibold text-sm">Google</span>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="bg-zinc-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-2xl p-6 hover:border-yellow-400/40 hover:shadow-[0_0_30px_rgba(255,217,61,0.15)] transition-all duration-300 animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Review Header */}
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ backgroundColor: review.avatar }}
                >
                  {review.initials}
                </div>
                
                {/* Name & Date */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-lg mb-1 truncate">{review.name}</h3>
                  <p className="text-gray-400 text-sm">{review.date}</p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-300 text-sm leading-relaxed">
                {review.text}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12 md:mt-16 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          <a
            href="https://www.google.com/search?q=PIKALEADS"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(255,217,61,0.5)] transition-all duration-300 hover:scale-105"
            style={{ fontFamily: 'Eurostile, sans-serif' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            ЧИТАТИ БІЛЬШЕ ВІДГУКІВ
          </a>
        </div>
      </div>
    </section>
  );
}
