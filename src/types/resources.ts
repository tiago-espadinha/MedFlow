// Record shapes for the six operational resources tracked in the app.
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  status: string;
  patients: number;
  nextShift: string;
}
export interface Admission {
  id: string;
  patient: string;
  bed: string;
  admitted: string;
  attending: string;
  status: string;
  dob: string;
  sex: string;
}
export interface LabOrder {
  id: string;
  patient: string;
  test: string;
  priority: string;
  ordered: string;
  status: string;
}
export interface Invoice {
  id: string;
  patient: string;
  amount: number;
  insurer: string;
  due: string;
  status: string;
}
export interface Drug {
  id: string;
  item: string;
  category: string;
  stock: number;
  reorderAt: number;
  expiry: string;
  status: string;
}
export interface Appointment {
  id: string;
  time: string;
  patient: string;
  doctor: string;
  type: string;
  room: string;
  status: string;
}
