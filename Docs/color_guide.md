# 🎨 Color System Documentation – Store Management Website

## 1. Philosophy (فلسفه رنگ‌ها)

* **سفید مایل به سرخ** → پایه طراحی، نماد تازگی و لطافت.
* **سیاه** → خوانایی، اقتدار و ثبات.
* **سبز** → اقدام مثبت، امید و حرکت (CTAها).
* **خاکستری‌ها** → تعادل، خنثی‌سازی و جداسازی.

این انتخاب رنگ‌ها بر اساس روایت تاریخی-فرهنگی شکل گرفته و با اصول **UI/UX مدرن** (سادگی، کنتراست بالا، کاربردپذیری) ترکیب شده است.

---

## 2. Color Palette (HEX Codes)

| Role                      | Color Name   | HEX       | Usage                       |
| ------------------------- | ------------ | --------- | --------------------------- |
| **Primary Background**    | Warm White   | `#FFF8F6` | Background main, whitespace |
| **Primary Text**          | Deep Black   | `#121212` | Headings, body text, icons  |
| **Primary CTA**           | Calm Green   | `#2E7D32` | Buttons (Add, Confirm, Buy) |
| **CTA Hover/Active**      | Dark Green   | `#1B5E20` | Button hover state          |
| **Secondary Text/Icons**  | Neutral Gray | `#9E9E9E` | Subtext, secondary info     |
| **Card Background**       | Light Gray   | `#F2F2F2` | Cards, panels, table rows   |
| **Pure White (Optional)** | White        | `#FFFFFF` | Text on CTA, highlights     |

---

## 3. Usage Ratios (60–30–10 Rule)

* **60%** → Warm White `#FFF8F6` (Background, whitespace)
* **30%** → Deep Black `#121212` (Text, footer, icons)
* **10%** → Calm Green `#2E7D32` (CTAs, links, highlights)

---

## 4. Component Guidelines

### 4.1 Background

* Default background: `#FFF8F6`
* Cards / panels: `#F2F2F2`
* Footer: `#121212`

### 4.2 Typography

* Headings (H1–H6): `#121212`, weight: 600–700
* Body text: `#121212`, weight: 400–500
* Secondary text / captions: `#9E9E9E`

### 4.3 Buttons

* **Primary button:** background `#2E7D32`, text `#FFFFFF`
* **Hover:** `#1B5E20`
* **Disabled:** background `#9E9E9E`, text `#FFFFFF`

### 4.4 Links

* Default link: `#2E7D32`
* Hover / Active: underline + darker green `#1B5E20`

### 4.5 Cards & Tables

* Card background: `#F2F2F2`
* Card text: `#121212`
* Borders (if needed): `#E0E0E0`

### 4.6 Notifications

* **Success:** green base `#2E7D32` with light green background `#E8F5E9`
* **Error:** dark red `#C62828` with light red background `#FFEBEE` (اختیاری خارج از روایت برای UX)
* **Info:** neutral gray `#9E9E9E`

---

## 5. Accessibility

* کنتراست اصلی متن مشکی روی پس‌زمینه سفید مایل به سرخ → **AAA**
* سبز روی سفید مایل به سرخ → **AA** (مناسب CTA)
* توجه: از ترکیب مستقیم سبز و قرمز اجتناب شود (چشم را خسته می‌کند).

---

## 6. Extended Rules

* استفاده از **گرادیان ظریف** (Warm White → Green) در صفحات کلیدی مثل Dashboard برای ایجاد هویت بصری.
* فوتر همیشه تیره (سیاه) باشد تا بخش‌های سایت محکم‌تر به نظر برسند.
* سبز فقط در المان‌های Action/Positive استفاده شود تا معنای خودش را حفظ کند.

---

✅ این مستند آماده است برای اینکه مستقیم به تیم بدهی یا داخل ابزارهای **AI UI Builder** وارد کنی.
اگر بخوای، می‌تونم این رو به شکل **Design Tokens (مثلاً JSON یا Figma Variables)** هم تبدیل کنم تا مستقیم توی پروژه قابل استفاده بشه.

می‌خوای برات به **Design Tokens JSON** هم تبدیل کنم تا راحت توی AI ابزارها لودش کنی؟
