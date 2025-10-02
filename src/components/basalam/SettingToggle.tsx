interface SettingToggleProps {
  id: string;
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  lastUpdated?: string;
}

export function SettingToggle({ id, label, description, enabled, onChange, lastUpdated }: SettingToggleProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return 'همین الان';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} دقیقه پیش`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ساعت پیش`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} روز پیش`;

      return date.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return null;
    }
  };

  return (
    <div className="flex items-center justify-between gap-6 border-b border-stroke py-5 last:border-b-0 dark:border-dark-3">
      <div className="flex-shrink-0">
        <label
          htmlFor={id}
          className="flex cursor-pointer select-none items-center"
        >
          <div className="relative">
            <input
              type="checkbox"
              id={id}
              className="sr-only"
              checked={enabled}
              onChange={(e) => onChange(e.target.checked)}
            />
            <div className="block h-8 w-14 rounded-full bg-gray-3 dark:bg-[#5A616B]"></div>
            <div
              className={`dot absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-switch-1 transition ${
                enabled && "!left-1 !-translate-x-full !bg-primary dark:!bg-white"
              }`}
            >
              <span className={`hidden ${enabled && "!block"}`}>
                <svg
                  className="fill-white dark:fill-dark"
                  width="11"
                  height="8"
                  viewBox="0 0 11 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.2355 0.812752L10.2452 0.824547C10.4585 1.08224 10.4617 1.48728 10.1855 1.74621L4.85633 7.09869C4.66442 7.29617 4.41535 7.4001 4.14693 7.4001C3.89823 7.4001 3.63296 7.29979 3.43735 7.09851L0.788615 4.43129C0.536589 4.1703 0.536617 3.758 0.788643 3.49701C1.04747 3.22897 1.4675 3.22816 1.72731 3.49457L4.16182 5.94608L9.28643 0.799032C9.54626 0.532887 9.96609 0.533789 10.2248 0.801737L10.2355 0.812752Z"
                    fill=""
                  />
                </svg>
              </span>
              <span className={`${enabled && "hidden"}`}>
                <svg
                  className="fill-current"
                  width="11"
                  height="11"
                  viewBox="0 0 11 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_803_2686)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.23529 2.29669C0.942402 2.00379 0.942402 1.52892 1.23529 1.23603C1.52819 0.943134 2.00306 0.943134 2.29596 1.23603L5.37433 4.3144L8.45261 1.23612C8.7455 0.943225 9.22038 0.943225 9.51327 1.23612C9.80616 1.52901 9.80616 2.00389 9.51327 2.29678L6.43499 5.37506L9.51327 8.45334C9.80616 8.74624 9.80616 9.22111 9.51327 9.514C9.22038 9.8069 8.7455 9.8069 8.45261 9.514L5.37433 6.43572L2.29596 9.51409C2.00306 9.80699 1.52819 9.80699 1.23529 9.51409C0.942402 9.2212 0.942402 8.74633 1.23529 8.45343L4.31367 5.37506L1.23529 2.29669Z"
                      fill=""
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_803_2686">
                      <rect width="10.75" height="10.75" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </div>
          </div>
        </label>
      </div>

      <div className="flex-1 text-right">
        <label
          htmlFor={id}
          className="mb-1 block cursor-pointer text-base font-medium text-dark dark:text-white"
        >
          {label}
        </label>
        {description && (
          <p className="mb-2 text-sm leading-relaxed text-body-color dark:text-dark-6">
            {description}
          </p>
        )}
        {lastUpdated && formatDate(lastUpdated) && (
          <div className="inline-flex items-center gap-1.5 rounded border-r-2 border-primary bg-primary/5 px-2.5 py-1.5 text-xs text-primary dark:border-primary dark:bg-primary/10">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>آخرین به‌روزرسانی: {formatDate(lastUpdated)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
