export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'PASSENGER' | 'BUS_OPERATOR' | 'ADMIN' | 'SUPPORT_AGENT';
}