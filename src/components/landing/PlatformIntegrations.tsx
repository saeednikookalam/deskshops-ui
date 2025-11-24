import {
  BasalamIcon,
  WooCommerceIcon,
  DigikalaIcon,
  DivarIcon,
  InstagramIcon,
  ShopifyIcon,
  TorbIcon,
  SnapfoodIcon,
} from "./icons";

export function PlatformIntegrations() {
  const platforms = [
    { name: "باسلام", icon: BasalamIcon },
    { name: "ووکامرس", icon: WooCommerceIcon },
    { name: "دیجی‌کالا", icon: DigikalaIcon },
    { name: "دیوار", icon: DivarIcon },
    { name: "اینستاگرام", icon: InstagramIcon },
    { name: "شاپیفای", icon: ShopifyIcon },
    { name: "ترب", icon: TorbIcon },
    { name: "اسنپ‌فود", icon: SnapfoodIcon },
  ];

  return (
    <section className="bg-warm-white py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-bold text-deep-black md:text-3xl">
              پلتفرم‌های متصل
            </h2>
            <p className="text-base text-neutral-gray md:text-lg">
              یک پنل، همه فروشگاه‌ها
            </p>
          </div>

          {/* Platforms Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
            {platforms.map((platform, index) => {
              const Icon = platform.icon;
              return (
                <div
                  key={index}
                  className="group flex flex-col items-center gap-3 rounded-[10px] bg-white p-6 shadow-1 transition-all hover:shadow-card hover:-translate-y-1"
                >
                  <Icon className="h-12 w-12 transition-transform group-hover:scale-110" />
                  <span className="text-sm font-semibold text-deep-black">
                    {platform.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
