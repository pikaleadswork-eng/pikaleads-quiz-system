import React from 'react';
import { TrendingUp, Users, DollarSign, Target, Zap, Shield, Award, Rocket } from 'lucide-react';

export const AboutUsSection: React.FC = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with grid */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,217,61,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,217,61,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <div className="inline-block mb-4 px-4 py-2 bg-zinc-900/80 border border-yellow-400/30 rounded-full">
            <span className="text-yellow-400 text-sm font-bold tracking-wider">ПРО НАС</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: 'Bungee, sans-serif' }}>
            <span className="text-white">ДОСВІД БЕЗ </span>
            <span className="text-yellow-400 drop-shadow-[0_0_30px_rgba(255,217,61,0.5)]">ПРИКРАС</span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Ми працюємо в рекламі та маркетингу понад 9 років. Не з теорії, не з курсів і не з презентацій — з реальних запусків, помилок і відповідальності за бюджети.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Stat 1 - Years */}
          <div className="group relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-yellow-400/20 rounded-2xl p-8 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-16 h-16 bg-yellow-400/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-400/20 transition-colors">
                <TrendingUp className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="text-5xl font-bold text-yellow-400 mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>9+</div>
              <div className="text-zinc-400 text-lg">РОКІВ ДОСВІДУ</div>
              <div className="mt-4 text-sm text-zinc-500">У рекламі та маркетингу</div>
            </div>
          </div>

          {/* Stat 2 - Clients */}
          <div className="group relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-5xl font-bold text-purple-400 mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>200+</div>
              <div className="text-zinc-400 text-lg">КЛІЄНТІВ</div>
              <div className="mt-4 text-sm text-zinc-500">Різні ніші та ринки</div>
            </div>
          </div>

          {/* Stat 3 - Budget */}
          <div className="group relative bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-yellow-400/20 rounded-2xl p-8 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-16 h-16 bg-yellow-400/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-400/20 transition-colors">
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="text-5xl font-bold text-yellow-400 mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>$8.2M+</div>
              <div className="text-zinc-400 text-lg">РЕКЛАМНИХ ІНВЕСТИЦІЙ</div>
              <div className="mt-4 text-sm text-zinc-500">Управління бюджетами</div>
            </div>
          </div>
        </div>

        {/* Experience Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Real Experience */}
          <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-8 h-8 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Eurostile, sans-serif' }}>РЕАЛЬНИЙ ДОСВІД</h3>
              </div>
              <p className="text-zinc-400 mb-6 leading-relaxed">
                Реальний маркетинг — це не стабільні графіки і не "завжди росте". За ці роки ми пройшли все, що зазвичай не показують у кейсах:
              </p>
              <ul className="space-y-3">
                {[
                  'Зливи бюджетів через неправильні гіпотези',
                  'Кампанії, які працювали в плюс, а потім ламались при масштабі',
                  'Блокування рекламних акаунтів',
                  'Помилки в аналітиці, які коштували дорого',
                  'Неправильні управлінські рішення',
                  'Проєкти, які доводилось перезапускати з нуля'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-zinc-300">
                    <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-xl">
                <p className="text-sm text-yellow-200">
                  Цей досвід — не абстрактний. Він напряму впливає на те, як ми приймаємо рішення сьогодні.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Our Approach */}
          <div className="animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
            <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-purple-400" />
                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Eurostile, sans-serif' }}>НАШ ПІДХІД</h3>
              </div>
              <p className="text-zinc-400 mb-6 leading-relaxed">
                Ми працюємо тільки з тим, що можна порахувати і перевірити. В основі нашого підходу:
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { icon: Target, label: 'Аналітика' },
                  { icon: Zap, label: 'Події' },
                  { icon: TrendingUp, label: 'Конверсії' },
                  { icon: DollarSign, label: 'Окупність' }
                ].map((item, index) => (
                  <div key={index} className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 hover:border-purple-500/50 transition-colors">
                    <item.icon className="w-6 h-6 text-purple-400 mb-2" />
                    <div className="text-sm text-zinc-300 font-semibold">{item.label}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <p className="text-zinc-300 text-sm">
                  ✓ Кожне рішення має логіку і цифри під собою
                </p>
                <p className="text-zinc-300 text-sm">
                  ✓ Те, що не дає результат — не масштабується
                </p>
                <p className="text-zinc-300 text-sm">
                  ✓ Те, що не проходить перевірку — відключається
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: Award, title: 'БЕЗ ІЛЮЗІЙ', desc: 'Тільки реальні факти та цифри' },
            { icon: Shield, title: 'БЕЗ ВОДИ', desc: 'Конкретика замість обіцянок' },
            { icon: Rocket, title: 'БЕЗ ПРИКРАС', desc: 'Чесність про успіхи та помилки' },
            { icon: Zap, title: 'З РЕЗУЛЬТАТОМ', desc: 'Практика замість теорії' }
          ].map((value, index) => (
            <div 
              key={index} 
              className="group bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-xl p-6 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 animate-fadeInUp"
              style={{ animationDelay: `${0.6 + index * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-yellow-400/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-400/20 transition-colors">
                <value.icon className="w-6 h-6 text-yellow-400" />
              </div>
              <h4 className="text-white font-bold mb-2" style={{ fontFamily: 'Eurostile, sans-serif' }}>{value.title}</h4>
              <p className="text-sm text-zinc-400">{value.desc}</p>
            </div>
          ))}
        </div>

        {/* Final Statement */}
        <div className="mt-16 text-center animate-fadeInUp" style={{ animationDelay: '1s' }}>
          <div className="inline-block bg-gradient-to-r from-yellow-400/10 via-purple-500/10 to-yellow-400/10 border border-yellow-400/30 rounded-2xl p-8 max-w-4xl">
            <p className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Eurostile, sans-serif' }}>
              МИ НЕ НОВА АГЕНЦІЯ І НЕ ЕКСПЕРИМЕНТ
            </p>
            <p className="text-lg text-zinc-300">
              Ми — команда з довгим практичним бекграундом у рекламі та маркетингу. Реальні факапи і реальні рішення.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
