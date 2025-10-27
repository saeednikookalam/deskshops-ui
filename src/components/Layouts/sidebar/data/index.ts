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

  // Create plugin menu items
  const pluginMenuItems: NavItem[] = pluginMenus.map((plugin) => ({
    title: plugin.title,
    icon: Icons.PieChart,
    url: plugin.path,
    items: [],
  }));

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
