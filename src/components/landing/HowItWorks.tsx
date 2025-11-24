export function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "ثبت‌نام رایگان",
      description:
        "با چند کلیک ساده حساب کاربری خودت رو بساز. نیازی به کارت اعتباری نیست.",
    },
    {
      number: "2",
      title: "انتخاب پلاگین‌ها",
      description:
        "از بین بیش از 50 پلاگین، فقط اون‌هایی که واقعاً نیاز داری رو انتخاب و فعال کن.",
    },
    {
      number: "3",
      title: "شروع مدیریت",
      description:
        "فروشگاه‌های مختلف خودت رو از یک پنل واحد مدیریت کن و وقت و هزینه صرفه‌جویی کن.",
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24" id="how-it-works">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center md:mb-16">
            <h2 className="mb-4 text-3xl font-bold text-deep-black md:text-4xl lg:text-5xl">
              چطوری کار میکنه؟
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-gray">
              فقط 3 قدم تا شروع کار
            </p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connection Line (Desktop) */}
            <div className="absolute right-1/2 top-16 hidden h-0.5 w-full -translate-y-1/2 bg-gradient-to-l from-calm-green via-calm-green/50 to-transparent lg:block"></div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Step Card */}
                  <div className="group relative rounded-2xl bg-warm-white p-8 transition-all hover:shadow-card">
                    {/* Number Badge */}
                    <div className="mb-6 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-calm-green text-2xl font-bold text-white shadow-2 transition-transform group-hover:scale-110">
                        {step.number}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <h3 className="mb-3 text-xl font-bold text-deep-black">
                        {step.title}
                      </h3>
                      <p className="leading-relaxed text-neutral-gray">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="mb-4 text-lg text-neutral-gray">
              آماده شروعی؟ همین الان شروع کن!
            </p>
            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-calm-green px-8 py-4 font-semibold text-white transition-all hover:bg-dark-green focus:outline-none focus:ring-2 focus:ring-calm-green focus:ring-offset-2"
            >
              ثبت‌نام رایگان
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
