import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-2 dark:bg-[#020d1a]">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-dark dark:text-white">404</h1>
        <p className="mb-6 text-xl text-body-color dark:text-dark-6">
          صفحه مورد نظر یافت نشد
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-medium text-white transition-all hover:bg-opacity-90"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
