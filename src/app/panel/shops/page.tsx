import { Suspense } from 'react';
import ShopsPageContent from './ShopsPageContent';

export default function ShopsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          <p className="text-body-color dark:text-dark-6">در حال بارگذاری...</p>
        </div>
      </div>
    }>
      <ShopsPageContent />
    </Suspense>
  );
}
