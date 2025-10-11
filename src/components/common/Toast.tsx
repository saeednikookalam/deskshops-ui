import { useEffect } from "react";

interface ToastProps {
  id: string;
  message: string;
  type: "success" | "error";
  onClose: (id: string) => void;
  duration?: number;
  index?: number;
}

export function Toast({ id, message, type, onClose, duration = 3000, index = 0 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose, id]);

  return (
    <div
      className="animate-slide-in-right"
      style={{ marginBottom: index > 0 ? '12px' : '0' }}
    >
      <div
        className={`flex min-w-[300px] items-center gap-3 rounded-lg p-4 shadow-lg ${
          type === "success"
            ? "bg-green text-white"
            : "bg-red text-white"
        }`}
      >
        {type === "success" ? (
          <svg
            className="h-5 w-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 opacity-70 transition-opacity hover:opacity-100"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
