import {
  SyncIcon,
  InventoryIcon,
  OrderIcon,
  PriceIcon,
  ReportIcon,
  NotificationIcon,
  AutomationIcon,
  AnalyticsIcon,
  CustomerIcon,
  MarketingIcon,
} from "./icons";

export function PluginShowcase() {
  const plugins = [
    { name: "همگام‌سازی", description: "همگام‌سازی خودکار محصولات", icon: SyncIcon },
    { name: "مدیریت موجودی", description: "کنترل موجودی در همه پلتفرم‌ها", icon: InventoryIcon },
    { name: "مدیریت سفارش", description: "پیگیری سفارشات متمرکز", icon: OrderIcon },
    { name: "قیمت‌گذاری", description: "قیمت‌گذاری هوشمند و خودکار", icon: PriceIcon },
    { name: "گزارش‌گیری", description: "تحلیل و گزارش پیشرفته", icon: ReportIcon },
    { name: "اعلان‌ها", description: "اطلاع‌رسانی لحظه‌ای", icon: NotificationIcon },
    { name: "خودکارسازی", description: "اتوماسیون فرآیندها", icon: AutomationIcon },
    { name: "تحلیل داده", description: "تحلیل رفتار مشتریان", icon: AnalyticsIcon },
    { name: "مدیریت مشتری", description: "CRM یکپارچه", icon: CustomerIcon },
    { name: "بازاریابی", description: "کمپین‌های هدفمند", icon: MarketingIcon },
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-bold text-deep-black md:text-3xl">
              پلاگین‌های متنوع
            </h2>
            <p className="text-base text-neutral-gray md:text-lg">
              فقط اونایی رو انتخاب کن که نیاز داری
            </p>
          </div>

          {/* Plugins Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-5">
            {plugins.map((plugin, index) => {
              const Icon = plugin.icon;
              return (
                <div
                  key={index}
                  className="group flex flex-col items-center gap-3 rounded-[10px] bg-warm-white p-5 shadow-1 transition-all hover:shadow-card hover:-translate-y-1"
                >
                  <Icon className="h-12 w-12 transition-transform group-hover:scale-110" />
                  <div className="text-center">
                    <h3 className="text-sm font-semibold text-deep-black mb-1">
                      {plugin.name}
                    </h3>
                    <p className="text-xs text-neutral-gray leading-tight">
                      {plugin.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
