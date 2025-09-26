import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import { PluginMenuProvider } from "@/contexts/plugin-menu-context";
import type { PropsWithChildren } from "react";

export default function PanelLayout({ children }: PropsWithChildren) {
  return (
    <PluginMenuProvider>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
          <Header />

          <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
            {children}
          </main>
        </div>
      </div>
    </PluginMenuProvider>
  );
}