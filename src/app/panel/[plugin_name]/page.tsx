import { notFound } from 'next/navigation';

// این تابع به Next.js می‌گوید که کدام plugin_name ها معتبر هستند
// file-importer را از لیست حذف می‌کنیم تا static route باشد
export async function generateStaticParams() {
  return [];
}

export default async function PluginPage({ params }: { params: Promise<{ plugin_name: string }> }) {
  const { plugin_name } = await params;

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h1 className="text-xl font-bold text-dark dark:text-white">
        Plugin: {plugin_name}
      </h1>
      <p className="mt-2 text-sm text-body-color dark:text-dark-6">
        این صفحه dynamic route است
      </p>
    </div>
  );
}