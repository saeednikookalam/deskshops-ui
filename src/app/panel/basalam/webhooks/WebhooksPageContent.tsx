"use client";

interface WebhooksPageContentProps {
  shopId: string | null;
}

export default function WebhooksPageContent({ shopId }: WebhooksPageContentProps) {
  return (
    <div className="rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-dark dark:text-white">
          تنظیمات وب‌هوک
        </h1>
        {shopId && (
          <p className="mt-2 text-body-color dark:text-dark-6">
            شناسه فروشگاه: {shopId}
          </p>
        )}
      </div>
      
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-body-color dark:text-dark-6">در حال توسعه...</p>
      </div>
    </div>
  );
}
