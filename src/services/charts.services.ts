// Mock data for charts - این فایل قبلا وجود نداشت و برای build موقتا ساختم

export interface CampaignVisitorsData {
  total_visitors: number;
  performance: number;
  chart: {
    x: string;
    y: number;
  }[];
}

export interface PaymentsOverviewData {
  total: number;
  change: number;
  received: { x: unknown; y: number }[];
  due: { x: unknown; y: number }[];
}

export interface DevicesUsedData {
  devices: { name: string; amount: number }[];
}

export interface WeeksProfitData {
  sales: { x: string; y: number }[];
  revenue: { x: string; y: number }[];
}

export async function getCampaignVisitorsData(): Promise<CampaignVisitorsData> {
  // Mock data
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = [1200, 1500, 1300, 1800, 1600, 2000, 1900];

  return {
    total_visitors: 10432,
    performance: 2.5,
    chart: days.map((day, index) => ({
      x: day,
      y: data[index],
    })),
  };
}

export async function getPaymentsOverviewData(): Promise<PaymentsOverviewData> {
  // Mock data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const receivedData = [45000, 52000, 48000, 61000, 55000, 67000];
  const dueData = [28000, 31000, 29000, 35000, 32000, 38000];

  return {
    total: 67000,
    change: 12.5,
    received: months.map((month, index) => ({
      x: month,
      y: receivedData[index],
    })),
    due: months.map((month, index) => ({
      x: month,
      y: dueData[index],
    })),
  };
}

export async function getDevicesUsedData(): Promise<{ name: string; amount: number }[]> {
  // Mock data
  return [
    { name: 'Desktop', amount: 45 },
    { name: 'Mobile', amount: 32 },
    { name: 'Tablet', amount: 18 },
    { name: 'Other', amount: 5 },
  ];
}

export async function getWeeksProfitData(): Promise<WeeksProfitData> {
  // Mock data
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const salesData = [12000, 15000, 13000, 18000];
  const revenueData = [8000, 10000, 9000, 12000];

  return {
    sales: weeks.map((week, index) => ({
      x: week,
      y: salesData[index],
    })),
    revenue: weeks.map((week, index) => ({
      x: week,
      y: revenueData[index],
    })),
  };
}

