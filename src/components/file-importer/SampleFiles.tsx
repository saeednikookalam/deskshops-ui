"use client";

interface SampleFilesProps {
  operationType: 'update' | 'create';
}

interface CreateProductSample {
  shop_id: string;
  name: string;
  category_id: string;
  preparation_days: string;
  package_weight: string;
  photo_urls: string;
  status: string;
  sku: string;
  brief: string;
  description: string;
  primary_price: string;
  stock: string;
  weight: string;
  keywords: string;
}

interface UpdateProductSample {
  shop_id: string;
  shop_product_id: string;
  name: string;
  primary_price: string;
  price: string;
  stock: string;
  status: string;
  preparation_days: string;
}

export function SampleFiles({ operationType }: SampleFilesProps) {
  const downloadSampleCSV = () => {
    let csvContent: string;

    if (operationType === 'create') {
      csvContent = `shop_id,name,category_id,preparation_days,package_weight,photo_urls,status,sku,brief,description,primary_price,stock,weight,keywords
12345,گوشی موبایل سامسونگ گلکسی A54,138,2,500,"https://example.com/img1.jpg,https://example.com/img2.jpg,https://example.com/img3.jpg",active,SAMSUNG-A54,گوشی هوشمند با صفحه AMOLED,"گوشی سامسونگ گلکسی A54 با صفحه نمایش 6.4 اینچی Super AMOLED و دوربین 50 مگاپیکسل",15000000,25,400,"گوشی,سامسونگ,موبایل,A54,هوشمند"
12345,هدفون بلوتوثی Sony WH-1000XM5,140,1,350,"https://example.com/headphone1.jpg,https://example.com/headphone2.jpg",active,SONY-WH1000,هدفون بی‌سیم با نویزکنسلینگ,هدفون بلوتوثی Sony WH-1000XM5 با قابلیت حذف نویز فعال و کیفیت صدای Hi-Res,8500000,15,250,"هدفون,بلوتوث,Sony,نویزکنسلینگ,بی‌سیم"
12345,ساعت هوشمند Apple Watch Series 9,142,3,200,"https://example.com/watch1.jpg,https://example.com/watch2.jpg",active,APPLE-WATCH9,ساعت هوشمند با GPS,ساعت هوشمند Apple Watch Series 9 با تراشه S9 و قابلیت ردیابی سلامت و فیتنس,18000000,10,55,"ساعت,اپل,هوشمند,Apple Watch,GPS,سلامت"`;
    } else {
      csvContent = `shop_id,shop_product_id,name,primary_price,price,stock,status,preparation_days
12345,PROD-001,گوشی موبایل سامسونگ گلکسی A54,15000000,14500000,25,active,2
12345,PROD-002,هدفون بلوتوثی Sony WH-1000XM5,8500000,8200000,15,active,1
12345,PROD-003,ساعت هوشمند Apple Watch Series 9,18000000,17500000,10,active,3`;
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = operationType === 'create' ? "sample_create_products.csv" : "sample_update_products.csv";
    link.click();
  };

  const downloadSampleJSON = () => {
    let jsonContent: CreateProductSample[] | UpdateProductSample[];

    if (operationType === 'create') {
      jsonContent = [
        {
          shop_id: "12345",
          name: "گوشی موبایل سامسونگ گلکسی A54",
          category_id: "138",
          preparation_days: "2",
          package_weight: "500",
          photo_urls: "https://example.com/img1.jpg,https://example.com/img2.jpg,https://example.com/img3.jpg",
          status: "active",
          sku: "SAMSUNG-A54",
          brief: "گوشی هوشمند با صفحه AMOLED",
          description: "گوشی سامسونگ گلکسی A54 با صفحه نمایش 6.4 اینچی Super AMOLED و دوربین 50 مگاپیکسل",
          primary_price: "15000000",
          stock: "25",
          weight: "400",
          keywords: "گوشی,سامسونگ,موبایل,A54,هوشمند",
        },
        {
          shop_id: "12345",
          name: "هدفون بلوتوثی Sony WH-1000XM5",
          category_id: "140",
          preparation_days: "1",
          package_weight: "350",
          photo_urls: "https://example.com/headphone1.jpg,https://example.com/headphone2.jpg",
          status: "active",
          sku: "SONY-WH1000",
          brief: "هدفون بی‌سیم با نویزکنسلینگ",
          description: "هدفون بلوتوثی Sony WH-1000XM5 با قابلیت حذف نویز فعال و کیفیت صدای Hi-Res",
          primary_price: "8500000",
          stock: "15",
          weight: "250",
          keywords: "هدفون,بلوتوث,Sony,نویزکنسلینگ,بی‌سیم",
        },
        {
          shop_id: "12345",
          name: "ساعت هوشمند Apple Watch Series 9",
          category_id: "142",
          preparation_days: "3",
          package_weight: "200",
          photo_urls: "https://example.com/watch1.jpg,https://example.com/watch2.jpg",
          status: "active",
          sku: "APPLE-WATCH9",
          brief: "ساعت هوشمند با GPS",
          description: "ساعت هوشمند Apple Watch Series 9 با تراشه S9 و قابلیت ردیابی سلامت و فیتنس",
          primary_price: "18000000",
          stock: "10",
          weight: "55",
          keywords: "ساعت,اپل,هوشمند,Apple Watch,GPS,سلامت",
        },
      ];
    } else {
      jsonContent = [
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
    }

    const blob = new Blob([JSON.stringify(jsonContent, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = operationType === 'create' ? "sample_create_products.json" : "sample_update_products.json";
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
{operationType === 'create' ?
`shop_id,name,category_id,preparation_days,package_weight,photo_urls,status,sku,brief,description,primary_price,stock,weight,keywords
12345,گوشی سامسونگ A54,138,2,500,"https://example.com/img1.jpg,https://example.com/img2.jpg",active,SAMSUNG-A54,گوشی هوشمند با صفحه AMOLED,"گوشی سامسونگ با صفحه 6.4 اینچی",15000000,25,400,"گوشی,سامسونگ,A54"
12345,هدفون Sony,140,1,350,"https://example.com/headphone.jpg",active,SONY-WH1000,هدفون بی‌سیم,هدفون بلوتوثی با نویزکنسلینگ,8500000,15,250,"هدفون,Sony,بلوتوث"` :
`shop_id,shop_product_id,name,primary_price,price,stock,status,preparation_days
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
{operationType === 'create' ?
`[
  {
    "shop_id": "12345",
    "name": "گوشی سامسونگ A54",
    "category_id": "138",
    "preparation_days": "2",
    "package_weight": "500",
    "photo_urls": "https://example.com/img1.jpg,https://example.com/img2.jpg",
    "status": "active",
    "sku": "SAMSUNG-A54",
    "brief": "گوشی هوشمند با صفحه AMOLED",
    "description": "گوشی سامسونگ با صفحه 6.4 اینچی",
    "primary_price": "15000000",
    "stock": "25",
    "weight": "400",
    "keywords": "گوشی,سامسونگ,A54"
  }
]` :
`[
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
