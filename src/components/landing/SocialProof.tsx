export function SocialProof() {
  const testimonials = [
    {
      name: "علی احمدی",
      role: "مدیر فروشگاه آنلاین پوشاک",
      content:
        "قبل از دسک‌شاپ، مدیریت موجودی بین باسلام و سایت خودم یک کابوس واقعی بود. الان همه چیز خودکار شده و وقت بیشتری برای رشد کسب‌وکارم دارم.",
      rating: 5,
      avatar: "ع",
      color: "bg-calm-green"
    },
    {
      name: "مریم کریمی",
      role: "صاحب فروشگاه لوازم خانگی",
      content:
        "با پلاگین‌های دسک‌شاپ، هزینه‌های ماهانه‌ام تقریباً نصف شد. فقط برای چیزی که واقعاً استفاده می‌کنم پول میدم و این عالیه!",
      rating: 5,
      avatar: "م",
      color: "bg-dark-green"
    },
    {
      name: "رضا محمدی",
      role: "فروشنده دیجی‌کالا و ترب",
      content:
        "مدیریت سفارشات از چندین مارکت‌پلیس خیلی راحت شد. دیگه نیازی نیست هر روز چند بار وارد پنل‌های مختلف بشم. همه چیز توی یه جا!",
      rating: 5,
      avatar: "ر",
      color: "bg-calm-green"
    },
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-bold text-deep-black md:text-3xl">
              نظر کاربران
            </h2>
            <p className="text-base text-neutral-gray md:text-lg">
              اعتماد بیش از 2,000 کسب‌وکار
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group rounded-[10px] bg-warm-white p-6 shadow-1 transition-all hover:shadow-card hover:-translate-y-1"
              >
                {/* Avatar & Author */}
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${testimonial.color} text-white text-xl font-bold`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-deep-black">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-neutral-gray">
                      {testimonial.role}
                    </div>
                  </div>
                </div>

                {/* Stars */}
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 fill-yellow-dark text-yellow-dark"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Content */}
                <p className="text-sm leading-relaxed text-neutral-gray">
                  &quot;{testimonial.content}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
