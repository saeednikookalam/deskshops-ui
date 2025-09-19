export default function PanelPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          خوش آمدید به پنل مدیریت
        </h2>
        <p className="mt-2 text-body-color dark:text-dark-6">
          پنل مدیریت شما آماده استفاده است
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <h3 className="text-lg font-semibold text-dark dark:text-white">محصولات</h3>
          <p className="text-2xl font-bold text-primary mt-2">۱۲۳</p>
        </div>

        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <h3 className="text-lg font-semibold text-dark dark:text-white">سفارشات</h3>
          <p className="text-2xl font-bold text-green mt-2">۴۵</p>
        </div>

        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <h3 className="text-lg font-semibold text-dark dark:text-white">مشتریان</h3>
          <p className="text-2xl font-bold text-blue mt-2">۶۷</p>
        </div>

        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <h3 className="text-lg font-semibold text-dark dark:text-white">فروش</h3>
          <p className="text-2xl font-bold text-yellow-dark mt-2">۸۹۰</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <h3 className="text-xl font-bold text-dark dark:text-white mb-4">آخرین فعالیت‌ها</h3>
          <div className="space-y-4">
            {[1,2,3,4,5].map((item) => (
              <div key={item} className="flex items-center gap-3 p-3 rounded bg-gray-1 dark:bg-dark-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-dark dark:text-white">فعالیت شماره {item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          <h3 className="text-xl font-bold text-dark dark:text-white mb-4">اعلان‌ها</h3>
          <div className="space-y-3">
            {[1,2,3].map((item) => (
              <div key={item} className="p-3 rounded bg-gray-1 dark:bg-dark-2">
                <p className="text-sm text-dark dark:text-white">اعلان شماره {item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}