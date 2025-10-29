interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="mb-6 border-b border-stroke dark:border-dark-3">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative px-6 py-3 text-base font-medium transition-all
              ${
                activeTab === tab.id
                  ? "text-primary dark:text-primary"
                  : "text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white"
              }
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
