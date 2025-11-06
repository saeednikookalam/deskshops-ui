import * as Icons from "../icons";
import { type MenuPlugin } from "@/lib/plugin-menu-manager";
import { DynamicIcon } from "@/components/ui/dynamic-icon";

export interface NavItem {
  title: string;
  icon: React.ComponentType<{ className?: string }> | typeof DynamicIcon;
  url?: string;
  items: NavItem[];
  iconSrc?: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const STATIC_NAV_DATA: NavSection[] = [
  {
    label: "",
    items: [
      {
        title: "داشبورد",
        icon: Icons.HomeIcon,
        url: "/panel",
        items: [],
      },
      {
        title: "مدیریت محصولات",
        icon: Icons.FourCircle,
        url: "/panel/products",
        items: [],
      },
      {
        title: "مدیریت سفارشات",
        icon: Icons.Table,
        url: "/panel/orders",
        items: [],
      },
      {
        title: "بخش مالی",
        icon: Icons.Wallet,
        url: "/panel/financial",
        items: [],
      },
      {
        title: "برنامک ها",
        icon: Icons.PieChart,
        url: "/panel/plugins",
        items: [],
      },
    ],
  },
];

export function generateNavData(pluginMenus: MenuPlugin[]): NavSection[] {
  const staticData = [...STATIC_NAV_DATA];

  // If no plugin menus, return static data
  if (pluginMenus.length === 0) {
    return staticData;
  }

  // Find basalam plugin
  const basalamPlugin = pluginMenus.find((plugin) =>
    plugin.name === 'basalam' || plugin.path.includes('/basalam')
  );

  // Create plugin menu items (excluding basalam)
  const pluginMenuItems: NavItem[] = pluginMenus
    .filter((plugin) => plugin.name !== 'basalam' && !plugin.path.includes('/basalam'))
    .map((plugin) => ({
      title: plugin.title,
      icon: Icons.PieChart,
      url: plugin.path,
      items: [],
    }));

  // If basalam plugin exists, create collapsible menu with sub-items
  if (basalamPlugin) {
    const basalamMenuItem: NavItem = {
      title: basalamPlugin.title,
      icon: basalamPlugin.icon ? DynamicIcon : Icons.PieChart,
      iconSrc: basalamPlugin.icon || undefined,
      items: [
        {
          title: "فروشگاه‌ها",
          icon: Icons.HomeIcon,
          url: "/panel/basalam/shops",
          items: [],
        },
        {
          title: "محصولات",
          icon: Icons.FourCircle,
          url: "/panel/basalam/products",
          items: [],
        },
        {
          title: "سفارشات",
          icon: Icons.Table,
          url: "/panel/basalam/orders",
          items: [],
        },
        {
          title: "درخواست‌ها",
          icon: Icons.Calendar,
          url: "/panel/basalam/requests",
          items: [],
        },
        {
          title: "تنظیمات",
          icon: Icons.PieChart,
          url: "/panel/basalam/settings",
          items: [],
        },
      ],
    };

    pluginMenuItems.push(basalamMenuItem);
  }

  // Add plugin menus to the main section (same as static menus)
  const updatedStaticData = [...staticData];
  if (updatedStaticData[0]) {
    updatedStaticData[0] = {
      ...updatedStaticData[0],
      items: [...updatedStaticData[0].items, ...pluginMenuItems],
    };
  }

  return updatedStaticData;
}

// Legacy export for backward compatibility
export const NAV_DATA = STATIC_NAV_DATA;
