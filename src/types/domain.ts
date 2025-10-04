export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "doctor" | "patient";
  document: string; // documento de  identidad
  isFirstLogin?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type RegisterDataPatient = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  document: string;
  phone: string;
  terms: boolean;
  dateOfBirth: string; // HTML date input returns string
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type CodeMfa = {
  code: string;
};
