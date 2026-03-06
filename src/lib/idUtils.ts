export function generateId(): string {
  // 1. Modern Secure API (Chrome 92+, Safari 15.4+, iOS 15.4+)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  
  // 2. Older Secure API (Supported since IE11, iOS 6+)
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    return (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );
  }
  
  // 3. Last Resort (Non-secure context / Extremely old browsers)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
