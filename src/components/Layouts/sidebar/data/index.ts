import * as Icons from "../icons";
import { type MenuPlugin } from "@/lib/plugin-menu-manager";
import { DynamicIcon } from "@/components/ui/dynamic-icon";

export interface NavItem {
  title: string;
  icon: React.ComponentType<{ className?: string }> | typeof DynamicIcon;
  url?: string;
  items: NavItem[];
  iconSrc?: string;
  disabled?: boolean;
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
        title: "درخواست‌ها",
        icon: Icons.Calendar,
        url: "/panel/requests",
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

export function generateNavData(
  pluginMenus: MenuPlugin[]
): NavSection[] {
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
    .map((plugin) => {
      let icon;

      // Custom icons for specific plugins
      switch (plugin.name) {
        case 'file_importer':
          icon = Icons.FileImporterIcon;
          break;
        case 'webhook':
          icon = Icons.WebhookIcon;
          break;
        default:
          icon = Icons.PieChart;
      }

      return {
        title: plugin.title,
        icon: icon,
        url: plugin.path,
        items: [],
      };
    });

  // If basalam plugin exists, create simple menu item without sub-items
  if (basalamPlugin) {
    const basalamMenuItem: NavItem = {
      title: basalamPlugin.title,
      icon: basalamPlugin.icon ? DynamicIcon : Icons.PieChart,
      iconSrc: basalamPlugin.icon || undefined,
      url: "/panel/basalam",
      items: [], // No sub-menu items
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
