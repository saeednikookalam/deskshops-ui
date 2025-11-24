import { UsersIcon, PuzzleIcon, SupportIcon } from "./icons";

export function TrustSignals() {
  const stats = [
    {
      icon: UsersIcon,
      value: "2,000+",
      label: "کسب‌وکار فعال",
      color: "bg-calm-green/10 text-calm-green"
    },
    {
      icon: PuzzleIcon,
      value: "50+",
      label: "پلاگین آماده",
      color: "bg-dark-green/10 text-dark-green"
    },
    {
      icon: SupportIcon,
      value: "24/7",
      label: "پشتیبانی آنلاین",
      color: "bg-calm-green/10 text-calm-green"
    },
  ];

  return (
    <section className="bg-warm-white py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-bold text-deep-black md:text-3xl">
              اعداد و ارقام
            </h2>
            <p className="text-base text-neutral-gray md:text-lg">
              اعتماد هزاران کسب‌وکار
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group rounded-[10px] bg-white p-8 text-center shadow-1 transition-all hover:shadow-card hover:-translate-y-1"
              >
                <div className="mb-5 flex justify-center">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full ${stat.color} transition-transform group-hover:scale-110`}>
                    <stat.icon className="h-8 w-8" />
                  </div>
                </div>
                <div className="mb-2 text-4xl font-bold text-deep-black">
                  {stat.value}
                </div>
                <div className="text-base font-medium text-neutral-gray">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
