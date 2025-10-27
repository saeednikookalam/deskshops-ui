/**
 * Format API message (string or array) into a single string
 */
export function formatMessage(message: string | string[]): string {
  if (Array.isArray(message)) {
    return message.join('\n');
  }
  return message;
}

/**
 * Format API message (string or array) into an array
 */
export function formatMessageArray(message: string | string[]): string[] {
  if (Array.isArray(message)) {
    return message;
  }
  return [message];
}
