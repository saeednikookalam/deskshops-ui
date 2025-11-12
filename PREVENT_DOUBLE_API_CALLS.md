# راهنمای جلوگیری از دوبار کال شدن APIها

## مشکل

در React (به خصوص با StrictMode در Next.js 13+)، useEffect ها ممکن است دوبار اجرا بشن که باعث دوبار کال شدن APIها میشه.

## راه‌حل‌های استاندارد

### 1. استفاده از Custom Hook `useOnce`

ساده‌ترین و بهترین راه حل استفاده از hook `useOnce` است:

```tsx
import { useOnceAsync } from '@/hooks/use-once';

export default function MyPage() {
  const [data, setData] = useState([]);

  useOnceAsync(async () => {
    const response = await api.getData();
    setData(response);
  });

  // بقیه کد...
}
```

### 2. استفاده از `useRef` برای Track کردن

اگر نیاز به کنترل بیشتر داری:

```tsx
import { useEffect, useRef } from 'react';

export default function MyPage() {
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (initialLoadDone.current) return;

    const loadData = async () => {
      initialLoadDone.current = true;
      // API calls...
    };

    loadData();
  }, []);
}
```

## الگوهای رایج و راه حل‌ها

### الگوی 1: بارگذاری اولیه داده

**❌ اشتباه:**
```tsx
useEffect(() => {
  loadData();
}, []); // این دوبار اجرا میشه
```

**✅ درست:**
```tsx
const initialLoadDone = useRef(false);

useEffect(() => {
  if (!initialLoadDone.current) {
    initialLoadDone.current = true;
    loadData();
  }
}, []);
```

یا بهتر:
```tsx
useOnceAsync(async () => {
  const data = await loadData();
  setData(data);
});
```

### الگوی 2: بارگذاری با Dependencies

**❌ اشتباه:**
```tsx
useEffect(() => {
  loadSettings();
}, [connectionStatus]); // هر بار که connectionStatus تغییر کنه، دوبار کال میشه
```

**✅ درست:**
```tsx
const initialLoadDone = useRef(false);

// Initial load
useEffect(() => {
  if (!initialLoadDone.current) {
    initialLoadDone.current = true;
    loadData();
  }
}, []);

// Reload on dependency change
useEffect(() => {
  if (initialLoadDone.current) {
    loadData();
  }
}, [connectionStatus]);
```

### الگوی 3: چند API Call با هم

**❌ اشتباه:**
```tsx
useEffect(() => {
  loadBalance();
}, []);

useEffect(() => {
  loadCredits();
}, []);
// هر دو دوبار کال میشن و ممکنه race condition ایجاد کنن
```

**✅ درست:**
```tsx
const initialLoadDone = useRef(false);

useEffect(() => {
  if (initialLoadDone.current) return;

  const loadData = async () => {
    initialLoadDone.current = true;
    await Promise.all([
      loadBalance(),
      loadCredits()
    ]);
  };

  loadData();
}, []);
```

### الگوی 4: بارگذاری Sequential (پشت سر هم)

**✅ درست:**
```tsx
useOnceAsync(async () => {
  // اول subscriptions رو بارگذاری کن
  const subscriptions = await loadSubscriptions();

  // بعد با استفاده از اطلاعات subscriptions، plugins رو بارگذاری کن
  const plugins = await loadPlugins();

  // و نهایتاً state رو update کن
  setData({ subscriptions, plugins });
});
```

### الگوی 5: Filters و Search

**✅ درست:**
```tsx
const initialLoadDone = useRef(false);

// Initial load
useEffect(() => {
  if (!initialLoadDone.current) {
    initialLoadDone.current = true;
    loadProducts(1, false);
  }
}, []);

// Reload when filters change
useEffect(() => {
  if (initialLoadDone.current) {
    loadProducts(1, false);
  }
}, [statusFilter, searchQuery]);
```

## Checklist برای صفحات جدید

قبل از push کردن کد، این موارد رو چک کن:

- [ ] آیا از `useOnce` یا `useRef` برای جلوگیری از دوبار کال استفاده کردی؟
- [ ] آیا تمام useEffect های با dependency خالی `[]` فقط یک بار اجرا میشن؟
- [ ] آیا useCallback ها dependency های درست دارن؟
- [ ] آیا چند useEffect برای بارگذاری داده نداری که میتونی ترکیبشون کنی؟
- [ ] آیا تست کردی که در development mode API ها فقط یک بار کال میشن؟

## تست کردن

برای تست اینکه API فقط یک بار کال میشه:

1. سرور backend رو اجرا کن
2. لاگ‌ها رو مشاهده کن
3. روی منو کلیک کن
4. بررسی کن که هر API فقط **یک بار** کال شده باشه

## مثال‌های کامل

### مثال 1: صفحه لیست محصولات

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { apiClient } from "@/lib/api-client";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;

      const loadData = async () => {
        setLoading(true);
        const data = await apiClient.get('/products');
        setProducts(data);
        setLoading(false);
      };

      loadData();
    }
  }, []);

  // بقیه کامپوننت...
}
```

### مثال 2: با استفاده از useOnce

```tsx
"use client";

import { useState } from "react";
import { useOnceAsync } from "@/hooks/use-once";
import { apiClient } from "@/lib/api-client";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useOnceAsync(async () => {
    setLoading(true);
    const data = await apiClient.get('/products');
    setProducts(data);
    setLoading(false);
  });

  // بقیه کامپوننت...
}
```

## نکات مهم

1. **همیشه از `useRef` یا `useOnce` استفاده کن** - این مطمئن میشه که API فقط یک بار کال بشه
2. **useEffect های Sequential رو ترکیب کن** - اگر چند useEffect داری که پشت سر هم اجرا میشن، ترکیبشون کن
3. **از Promise.all استفاده کن** - برای API callهای موازی که به هم وابسته نیستن
4. **dependencies رو دقیق تنظیم کن** - فقط چیزایی که واقعاً نیاز به re-run دارن رو بذار
5. **تست کن در development mode** - قبل از push، تست کن که API ها فقط یک بار کال میشن

## منابع

- [React StrictMode Documentation](https://react.dev/reference/react/StrictMode)
- [useEffect Hook Documentation](https://react.dev/reference/react/useEffect)
