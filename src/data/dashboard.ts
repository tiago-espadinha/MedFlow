// Static chart data for the Overview and Reports pages — not tied to a CRUD resource, so it
// lives separately from the seed database.
export const wards = [
  ["ICU", 9, 10],
  ["Emergency", 14, 20],
  ["Ward A", 42, 50],
  ["Ward B", 48, 50],
  ["Ward C", 38, 60],
  ["Surgery", 22, 30],
] as const;
export const admissions7 = {
  labels: ["Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu"],
  data: [31, 28, 35, 40, 33, 29, 37],
};
export const monthly = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  data: [842, 791, 868, 905, 880, 921, 948, 902, 478],
};
