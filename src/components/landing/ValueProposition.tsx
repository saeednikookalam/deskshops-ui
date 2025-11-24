import { BoltIcon, CurrencyIcon, ShieldIcon } from "./icons";

export function ValueProposition() {
  const values = [
    {
      icon: CurrencyIcon,
      title: "پرداخت هوشمند",
      description:
        "فقط برای پلاگین‌هایی که فعال کردی پرداخت کن. نیازی به خرید پکیج‌های گران‌قیمت نیست.",
      bgColor: "bg-green/10",
      iconColor: "text-calm-green",
    },
    {
      icon: BoltIcon,
      title: "انعطاف کامل",
      description:
        "نیازت عوض شد؟ پلاگین‌ها رو در هر لحظه فعال یا غیرفعال کن بدون هیچ محدودیتی.",
      bgColor: "bg-blue/10",
      iconColor: "text-blue",
    },
    {
      icon: ShieldIcon,
      title: "صرفه‌جویی واقعی",
      description:
        "تا 70% کمتر از پکیج‌های ثابت هزینه کن. با دسک‌شاپ فقط برای چیزی که واقعاً استفاده می‌کنی پول بده.",
      bgColor: "bg-orange-light/10",
      iconColor: "text-orange-light",
    },
  ];

  return (
    <section className="bg-warm-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center md:mb-16">
            <h2 className="mb-4 text-3xl font-bold text-deep-black md:text-4xl lg:text-5xl">
              تفاوت ما چیه؟
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-gray">
              هزینه کمتر، امکانات بیشتر، انعطاف بی‌نظیر
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {values.map((value, index) => (
              <div
                key={index}
                className="group rounded-2xl bg-white p-8 shadow-card transition-all hover:shadow-3"
              >
                {/* Icon */}
                <div className="mb-6">
                  <div
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${value.bgColor} transition-transform group-hover:scale-110`}
                  >
                    <value.icon className={`h-7 w-7 ${value.iconColor}`} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-bold text-deep-black">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="leading-relaxed text-neutral-gray">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
