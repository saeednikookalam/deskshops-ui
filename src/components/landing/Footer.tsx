export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-deep-black text-white">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="mb-3 text-xl font-bold">دسک‌شاپ</h3>
            <p className="max-w-xs text-sm text-neutral-gray">
              راه‌حل هوشمند مدیریت فروشگاه‌های آنلاین
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm text-neutral-gray">
              <li>
                <a href="/login" className="transition-colors hover:text-white">
                  ورود به پنل
                </a>
              </li>
              <li>
                <a href="mailto:support@deskshops.com" className="transition-colors hover:text-white">
                  پشتیبانی
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">ارتباط با ما</h4>
            <a
              href="mailto:support@deskshops.com"
              className="inline-block text-sm text-neutral-gray transition-colors hover:text-white"
            >
              support@deskshops.com
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-neutral-gray">
          <p>© {currentYear} دسک‌شاپ. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
