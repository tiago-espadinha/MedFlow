// A stored date/time is always full ISO (so native <input type="date|time|datetime-local">
// works); these just make it read nicely in tables and charts without changing the stored value.
export const shortDate = (d: string): string => (d.length > 5 ? d.slice(5) : d);
export const formatDateTime = (s: string): string => s.replace("T", " ");
export const calcAge = (dob: string): number =>
  new Date().getFullYear() - Number(dob.slice(0, 4));
