import { useEffect, useState } from "react";

interface AlertProps {
  type: "success" | "error" | "warning";
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function Alert({ type, message, onClose, autoClose = true, duration = 5000 }: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!isVisible) return null;

  const getStyles = () => {
    switch (type) {
      case "success":
        return "border-green bg-green/10 text-green dark:bg-green/20";
      case "error":
        return "border-red bg-red/10 text-red dark:bg-red/20";
      case "warning":
        return "border-yellow-500 bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20";
      default:
        return "";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "error":
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case "warning":
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
    }
  };

  return (
    <div className={`mb-4 flex items-center gap-3 rounded-lg border-l-4 p-4 ${getStyles()}`}>
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className="flex-shrink-0 opacity-70 hover:opacity-100"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}