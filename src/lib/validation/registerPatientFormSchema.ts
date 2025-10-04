import { z } from "zod";

export const registerPatientSchema = z
  .object({
    firstName: z.string().min(1, "El nombre es obligatorio"),
    lastName: z.string().min(1, "El apellido es obligatorio"),
    email: z.email("Correo inválido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[0-9]/, "Debe contener al menos un número")
      .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial"),
    passwordConfirmation: z.string(),
    document: z.string().min(1, "El documento es obligatorio"),
    phone: z.string().min(6, "El telefono es obligatorio"),
    dateOfBirth: z
      .string()
      .min(1, "La fecha de nacimiento es obligatoria")
      .refine((dateStr) => {
        const date = new Date(dateStr);
        const age = new Date().getFullYear() - date.getFullYear();
        return age >= 18;
      }, "Debes ser mayor de 18 años"),
    terms: z
      .boolean()
      .refine((val) => val === true, "Debes aceptar los términos"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmation"],
  });
