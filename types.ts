export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Manager';
  lastLogin: string;
  department: string;
  // Campos sensíveis para a demonstração da API3:BOPLA
  salary?: number;
  personalNotes?: string;
}