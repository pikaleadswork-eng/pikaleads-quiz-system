# Meta Ads Custom Conversions Setup Guide

## Огляд

Цей посібник допоможе вам налаштувати Custom Conversions (Користувацькі конверсії) в Meta Ads Manager для оптимізації рекламних кампаній на основі подій життєвого циклу лідів у вашій CRM системі.

**Мета:** Створити спеціальні конверсії для відстеження ключових етапів воронки продажів та оптимізації рекламних кампаній на події, які найбільше корелюють з фінальним продажем.

---

## 📊 Структура подій

Ваша система відправляє наступні події в Meta Pixel через Conversions API:

| Подія Meta | Опис | Коли відправляється | Призначення |
|------------|------|---------------------|-------------|
| `PageView` | Перегляд сторінки | При завантаженні квізу | Базове відстеження трафіку |
| `ViewContent` | Перегляд контенту | При старті квізу | Залученість аудиторії |
| `CompleteRegistration` | Реєстрація завершена | **При відправці форми квізу (ЛІД)** | **Основна конверсія** |
| `InitiateCheckout` | Початок оформлення | **При плануванні дзвінка в CRM** | Проміжна конверсія |
| `AddToCart` | Додано в кошик | **При запиті callback в CRM** | Проміжна конверсія |
| `Purchase` | Покупка | **При зміні статусу на "Виграно"** | **Фінальна конверсія** |

---

## 🎯 Рекомендовані Custom Conversions

### 1. Qualified Lead (Кваліфікований лід)

**Назва:** `Qualified_Lead`  
**Базова подія:** `CompleteRegistration`  
**Правило:** Всі події `CompleteRegistration`

**Призначення:**
- Оптимізація кампаній на генерацію лідів
- Базова конверсія для нових кампаній
- Використовується для Lookalike Audiences

**Налаштування:**
1. Meta Ads Manager → **Events Manager**
2. Виберіть Pixel (720023837850036)
3. **Custom Conversions** → **Create Custom Conversion**
4. Назва: `Qualified_Lead`
5. Data Source: Ваш Pixel
6. Conversion Event: `CompleteRegistration`
7. Rules: (залишити порожнім - всі події)
8. Value: Default (0)
9. **Create**

---

### 2. Call Scheduled (Дзвінок заплановано)

**Назва:** `Call_Scheduled`  
**Базова подія:** `InitiateCheckout`  
**Правило:** Всі події `InitiateCheckout`

**Призначення:**
- Оптимізація на лідів, які доходять до етапу планування дзвінка
- Вища якість ніж просто `CompleteRegistration`
- Використовується для Value-Based Lookalike

**Налаштування:**
1. Meta Ads Manager → **Events Manager**
2. **Custom Conversions** → **Create Custom Conversion**
3. Назва: `Call_Scheduled`
4. Data Source: Ваш Pixel
5. Conversion Event: `InitiateCheckout`
6. Rules: (залишити порожнім)
7. Value: Default (0)
8. **Create**

**Оптимізація кампанії:**
```
Campaign Objective: Conversions
Conversion Event: Call_Scheduled
Bid Strategy: Lowest Cost або Cost Cap (встановіть максимальну ціну за конверсію)
```

---

### 3. Callback Requested (Запит на зворотний дзвінок)

**Назва:** `Callback_Requested`  
**Базова подія:** `AddToCart`  
**Правило:** Всі події `AddToCart`

**Призначення:**
- Відстеження лідів, які активно зацікавлені (просять передзвонити)
- Проміжна конверсія між лідом та продажем
- Використовується для ретаргетингу

**Налаштування:**
1. Meta Ads Manager → **Events Manager**
2. **Custom Conversions** → **Create Custom Conversion**
3. Назва: `Callback_Requested`
4. Data Source: Ваш Pixel
5. Conversion Event: `AddToCart`
6. Rules: (залишити порожнім)
7. Value: Default (0)
8. **Create**

---

### 4. High-Value Lead (Високоцінний лід)

**Назва:** `High_Value_Lead`  
**Базова подія:** `CompleteRegistration`  
**Правило:** `value > 0` (якщо передається lead score)

**Призначення:**
- Оптимізація на лідів з високим потенціалом
- Використовується для премиум кампаній
- Lookalike на найкращих клієнтів

**Налаштування:**
1. Meta Ads Manager → **Events Manager**
2. **Custom Conversions** → **Create Custom Conversion**
3. Назва: `High_Value_Lead`
4. Data Source: Ваш Pixel
5. Conversion Event: `CompleteRegistration`
6. Rules: `value` → `is greater than` → `0`
7. Value: Use event value
8. **Create**

---

## 🚀 Стратегії оптимізації кампаній

### Стратегія 1: Воронка оптимізації (для нових кампаній)

**Етап 1 (Тиждень 1-2):** Оптимізація на `Qualified_Lead`
```
Objective: Conversions
Conversion Event: Qualified_Lead
Budget: $50-100/день
Bid Strategy: Lowest Cost
```

**Етап 2 (Тиждень 3-4):** Перехід на `Call_Scheduled`
```
Objective: Conversions
Conversion Event: Call_Scheduled
Budget: $100-150/день
Bid Strategy: Cost Cap (встановіть на основі CPL з Етапу 1)
```

**Етап 3 (Тиждень 5+):** Оптимізація на `Purchase`
```
Objective: Conversions
Conversion Event: Purchase
Budget: $150-200/день
Bid Strategy: ROAS-based (Target ROAS 300%)
```

---

### Стратегія 2: Паралельні кампанії (для досвідчених)

**Кампанія A:** Генерація лідів
```
Objective: Conversions
Conversion Event: Qualified_Lead
Budget: 60% загального бюджету
Audience: Broad або Lookalike 1-3%
```

**Кампанія B:** Якісні ліди
```
Objective: Conversions
Conversion Event: Call_Scheduled
Budget: 30% загального бюджету
Audience: Lookalike 1% (на основі Purchase)
```

**Кампанія C:** Ретаргетинг
```
Objective: Conversions
Conversion Event: Purchase
Budget: 10% загального бюджету
Audience: Engaged (ViewContent, CompleteRegistration але не Purchase)
```

---

## 📈 Audiences для Lookalike

### Audience 1: All Leads (Всі ліди)

**Джерело:** `CompleteRegistration`  
**Розмір:** Мінімум 100 подій  
**Lookalike:** 1-3%  
**Використання:** Холодний трафік

**Створення:**
1. Ads Manager → **Audiences**
2. **Create Audience** → **Custom Audience**
3. Source: Website
4. Events: `CompleteRegistration` (Last 30 days)
5. Name: `All_Leads_30d`
6. **Create Audience**

**Lookalike:**
1. **Create Audience** → **Lookalike Audience**
2. Source: `All_Leads_30d`
3. Location: Ukraine
4. Audience Size: 1-3%
5. **Create Audience**

---

### Audience 2: Scheduled Calls (Заплановані дзвінки)

**Джерело:** `InitiateCheckout`  
**Розмір:** Мінімум 100 подій  
**Lookalike:** 1-2%  
**Використання:** Якісний трафік

**Створення:**
1. Ads Manager → **Audiences** → **Create Custom Audience**
2. Source: Website
3. Events: `InitiateCheckout` (Last 60 days)
4. Name: `Call_Scheduled_60d`
5. **Create Audience**

**Lookalike:**
1. **Create Lookalike Audience**
2. Source: `Call_Scheduled_60d`
3. Location: Ukraine
4. Audience Size: 1-2%
5. **Create Audience**

---

### Audience 3: Purchasers (Покупці)

**Джерело:** `Purchase`  
**Розмір:** Мінімум 100 подій (може зайняти 2-3 місяці)  
**Lookalike:** 1% (найкраща якість)  
**Використання:** Премиум кампанії

**Створення:**
1. Ads Manager → **Audiences** → **Create Custom Audience**
2. Source: Website
3. Events: `Purchase` (Last 180 days)
4. Name: `Purchasers_180d`
5. **Create Audience**

**Value-Based Lookalike:**
1. **Create Lookalike Audience**
2. Source: `Purchasers_180d`
3. Location: Ukraine
4. Audience Size: 1%
5. **Advanced Options** → Use value-based similarity
6. **Create Audience**

---

## 🎨 Exclusion Audiences (Виключення)

### Audience 4: Recent Leads (Нещодавні ліди)

**Призначення:** Виключити людей, які вже залишили заявку (щоб не витрачати бюджет)

**Створення:**
1. Ads Manager → **Audiences** → **Create Custom Audience**
2. Source: Website
3. Events: `CompleteRegistration` (Last 7 days)
4. Name: `Recent_Leads_7d`
5. **Create Audience**

**Використання:**
- Додайте як **Exclusion** в усіх кампаніях генерації лідів
- Зменшує витрати на повторні покази тим самим людям

---

### Audience 5: Existing Customers (Існуючі клієнти)

**Призначення:** Виключити людей, які вже купили (якщо немає repeat purchases)

**Створення:**
1. Ads Manager → **Audiences** → **Create Custom Audience**
2. Source: Website
3. Events: `Purchase` (Last 365 days)
4. Name: `Customers_365d`
5. **Create Audience**

**Використання:**
- Додайте як **Exclusion** в кампаніях генерації лідів
- Залиште для ретаргетингу (upsell/cross-sell)

---

## 🔧 Налаштування Attribution Window

**Рекомендації для B2C (короткий цикл продажу):**
```
Click-through attribution: 7 days
View-through attribution: 1 day
```

**Рекомендації для B2B (довгий цикл продажу):**
```
Click-through attribution: 28 days
View-through attribution: 7 days
```

**Налаштування:**
1. Ads Manager → **Events Manager**
2. Виберіть Pixel → **Settings**
3. **Attribution Settings**
4. Встановіть Click і View windows
5. **Save**

---

## 📊 Моніторинг та аналітика

### Key Metrics (Ключові метрики)

| Метрика | Формула | Цільове значення |
|---------|---------|------------------|
| CPL (Cost Per Lead) | Витрати / CompleteRegistration | $5-15 (залежить від ніші) |
| CPS (Cost Per Scheduled Call) | Витрати / InitiateCheckout | $15-30 |
| CPA (Cost Per Acquisition) | Витрати / Purchase | $50-150 |
| ROAS (Return on Ad Spend) | Дохід / Витрати | 300-500% |
| Lead-to-Call Rate | InitiateCheckout / CompleteRegistration | 30-50% |
| Call-to-Sale Rate | Purchase / InitiateCheckout | 10-20% |
| Overall Conversion Rate | Purchase / CompleteRegistration | 5-10% |

### Dashboard Setup

**Рекомендовані колонки в Ads Manager:**
1. Campaign Name
2. Delivery
3. Results (за вашою конверсією)
4. Cost per Result
5. Amount Spent
6. Reach
7. Impressions
8. Link Clicks
9. CTR (Link Click-Through Rate)
10. CPC (Cost per Link Click)
11. CompleteRegistration (Custom Column)
12. InitiateCheckout (Custom Column)
13. Purchase (Custom Column)
14. ROAS (Custom Column)

**Створення Custom Column для ROAS:**
1. Ads Manager → **Columns** → **Customize Columns**
2. **Create Custom Metric**
3. Name: `ROAS`
4. Formula: `Purchase Conversion Value / Amount Spent`
5. Format: Percentage
6. **Save**

---

## 🧪 A/B Testing Strategy

### Test 1: Conversion Event Optimization

**Hypothesis:** Оптимізація на `Call_Scheduled` дасть вищий ROAS ніж на `CompleteRegistration`

**Setup:**
- Ad Set A: Optimize for `Qualified_Lead`
- Ad Set B: Optimize for `Call_Scheduled`
- Budget: $50/день кожен
- Duration: 14 днів
- Same creative, same audience

**Success Criteria:**
- Lower CPA
- Higher ROAS
- Better Lead-to-Sale conversion rate

---

### Test 2: Audience Quality

**Hypothesis:** Lookalike на `Purchase` дасть кращих лідів ніж Lookalike на `CompleteRegistration`

**Setup:**
- Ad Set A: Lookalike 1% (All Leads)
- Ad Set B: Lookalike 1% (Purchasers)
- Budget: $50/день кожен
- Duration: 14 днів
- Same creative, same optimization event

**Success Criteria:**
- Higher Lead-to-Call rate
- Higher Call-to-Sale rate
- Lower CPA

---

## 🛠️ Troubleshooting

### Problem: Custom Conversion не отримує події

**Рішення:**
1. Перевірте, що події приходять в Events Manager (Data Sources → Pixel → Events)
2. Перевірте правила Custom Conversion (може бути занадто строгі)
3. Зачекайте 24 години (події можуть з'являтися з затримкою)
4. Перевірте Conversions API (Server Events) в Events Manager → Diagnostics

---

### Problem: Занадто мало подій для оптимізації

**Рішення:**
1. Почніть з оптимізації на `CompleteRegistration` (більше подій)
2. Збільште бюджет для швидшого збору даних
3. Розширте аудиторію (Lookalike 3-5% замість 1%)
4. Використовуйте Broad targeting для Learning Phase
5. Зачекайте мінімум 50 подій за тиждень перед оптимізацією

---

### Problem: Високий CPL але низький ROAS

**Рішення:**
1. Перевірте якість лідів (можливо привертаєте не ту аудиторію)
2. Змініть креатив (більш чіткий CTA, кваліфікація аудиторії)
3. Додайте питання-фільтри в квіз (відсіяти нецільову аудиторію)
4. Перейдіть на оптимізацію на `Call_Scheduled` або `Purchase`
5. Використовуйте Lookalike на `Purchasers` замість `All Leads`

---

## 📚 Додаткові ресурси

- [Meta Business Help Center - Custom Conversions](https://www.facebook.com/business/help/1151869044868946)
- [Meta Conversions API Best Practices](https://developers.facebook.com/docs/marketing-api/conversions-api/best-practices)
- [Meta Attribution Settings Guide](https://www.facebook.com/business/help/370704083280490)
- [Lookalike Audiences Guide](https://www.facebook.com/business/help/164749007013531)

---

## ✅ Checklist

- [ ] Створено Custom Conversion: `Qualified_Lead`
- [ ] Створено Custom Conversion: `Call_Scheduled`
- [ ] Створено Custom Conversion: `Callback_Requested`
- [ ] Створено Custom Conversion: `High_Value_Lead` (опціонально)
- [ ] Створено Custom Audience: `All_Leads_30d`
- [ ] Створено Lookalike Audience: `LAL_All_Leads_1-3%`
- [ ] Створено Custom Audience: `Call_Scheduled_60d`
- [ ] Створено Lookalike Audience: `LAL_Call_Scheduled_1-2%`
- [ ] Створено Exclusion Audience: `Recent_Leads_7d`
- [ ] Налаштовано Attribution Window (7d click / 1d view)
- [ ] Додано Custom Columns в Ads Manager (ROAS, конверсії)
- [ ] Запущено тестову кампанію з оптимізацією на `Qualified_Lead`
- [ ] Заплановано перехід на `Call_Scheduled` через 2 тижні

---

**Автор:** Manus AI  
**Дата оновлення:** 17 грудня 2024  
**Версія:** 1.0
