"use client";

export function SampleFiles() {
  const downloadSampleCSV = () => {
    const csvContent = `shop_id,shop_product_id,name,primary_price,price,stock,status,preparation_days
12345,PROD-001,گوشی موبایل سامسونگ گلکسی A54,15000000,14500000,25,active,2
12345,PROD-002,هدفون بلوتوثی Sony WH-1000XM5,8500000,8200000,15,active,1
12345,PROD-003,ساعت هوشمند Apple Watch Series 9,18000000,17500000,10,active,3`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sample_products.csv";
    link.click();
  };

  const downloadSampleJSON = () => {
    const jsonContent = [
      {
        shop_id: "12345",
        shop_product_id: "PROD-001",
        name: "گوشی موبایل سامسونگ گلکسی A54",
        primary_price: "15000000",
        price: "14500000",
        stock: "25",
        status: "active",
        preparation_days: "2",
      },
      {
        shop_id: "12345",
        shop_product_id: "PROD-002",
        name: "هدفون بلوتوثی Sony WH-1000XM5",
        primary_price: "8500000",
        price: "8200000",
        stock: "15",
        status: "active",
        preparation_days: "1",
      },
      {
        shop_id: "12345",
        shop_product_id: "PROD-003",
        name: "ساعت هوشمند Apple Watch Series 9",
        primary_price: "18000000",
        price: "17500000",
        stock: "10",
        status: "active",
        preparation_days: "3",
      },
    ];

    const blob = new Blob([JSON.stringify(jsonContent, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sample_products.json";
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Download Cards */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          دانلود فایل‌های نمونه
        </h3>
        <p className="mb-6 text-sm text-body-color dark:text-dark-6">
          برای شروع سریع، یکی از فایل‌های نمونه را دانلود کنید و با اطلاعات محصولات خود پر کنید
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* CSV */}
          <div className="group overflow-hidden rounded-xl border-2 border-stroke bg-white p-6 transition-all hover:border-green hover:shadow-lg dark:border-dark-3 dark:bg-gray-dark">
            <div className="mb-4 flex h-20 items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green/10 transition-all group-hover:scale-110">
                <span className="text-4xl">📄</span>
              </div>
            </div>
            <h4 className="mb-2 text-center text-lg font-bold text-dark dark:text-white">
              فایل CSV
            </h4>
            <p className="mb-4 text-center text-sm text-body-color dark:text-dark-6">
              مناسب برای Excel و Google Sheets
            </p>
            <button
              onClick={downloadSampleCSV}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-green/90"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              دانلود CSV
            </button>
          </div>

          {/* Excel */}
          <div className="group overflow-hidden rounded-xl border-2 border-stroke bg-white p-6 transition-all hover:border-blue hover:shadow-lg dark:border-dark-3 dark:bg-gray-dark">
            <div className="mb-4 flex h-20 items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue/10 transition-all group-hover:scale-110">
                <span className="text-4xl">📊</span>
              </div>
            </div>
            <h4 className="mb-2 text-center text-lg font-bold text-dark dark:text-white">
              فایل Excel
            </h4>
            <p className="mb-4 text-center text-sm text-body-color dark:text-dark-6">
              فرمت .xlsx برای Microsoft Excel
            </p>
            <button
              onClick={downloadSampleCSV}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue/90"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              دانلود Excel
            </button>
          </div>

          {/* JSON */}
          <div className="group overflow-hidden rounded-xl border-2 border-stroke bg-white p-6 transition-all hover:border-purple hover:shadow-lg dark:border-dark-3 dark:bg-gray-dark">
            <div className="mb-4 flex h-20 items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple/10 transition-all group-hover:scale-110">
                <span className="text-4xl">📋</span>
              </div>
            </div>
            <h4 className="mb-2 text-center text-lg font-bold text-dark dark:text-white">
              فایل JSON
            </h4>
            <p className="mb-4 text-center text-sm text-body-color dark:text-dark-6">
              مناسب برای توسعه‌دهندگان و API
            </p>
            <button
              onClick={downloadSampleJSON}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-purple/90"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              دانلود JSON
            </button>
          </div>
        </div>
      </div>

      {/* CSV Example */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          نمونه فایل CSV
        </h3>
        <div className="overflow-hidden rounded-lg border border-stroke dark:border-dark-3">
          <div className="bg-gray-2 dark:bg-dark-2 px-4 py-2 border-b border-stroke dark:border-dark-3">
            <span className="text-xs font-medium text-body-color dark:text-dark-6">CSV Format</span>
          </div>
          <div className="bg-[#1e1e1e] dark:bg-[#0d0d0d] p-4 overflow-x-auto">
            <pre dir="ltr" className="font-mono text-xs text-gray-300">
{`shop_id,shop_product_id,name,primary_price,price,stock,status,preparation_days
12345,PROD-001,گوشی سامسونگ A54,15000000,14500000,25,active,2
12345,PROD-002,هدفون Sony,8500000,8200000,15,active,1`}
            </pre>
          </div>
        </div>
      </div>

      {/* JSON Example */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          نمونه فایل JSON
        </h3>
        <div className="overflow-hidden rounded-lg border border-stroke dark:border-dark-3">
          <div className="bg-gray-2 dark:bg-dark-2 px-4 py-2 border-b border-stroke dark:border-dark-3">
            <span className="text-xs font-medium text-body-color dark:text-dark-6">JSON Format</span>
          </div>
          <div className="bg-[#1e1e1e] dark:bg-[#0d0d0d] p-4 overflow-x-auto">
            <pre dir="ltr" className="font-mono text-xs text-gray-300">
{`[
  {
    "shop_id": "12345",
    "shop_product_id": "PROD-001",
    "name": "گوشی سامسونگ A54",
    "primary_price": "15000000",
    "price": "14500000",
    "stock": "25",
    "status": "active",
    "preparation_days": "2"
  }
]`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
