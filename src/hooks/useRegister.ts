import { AuthService } from "@/api/auth";
import { useState } from "react";
import type { RegisterDataPatient } from "@/types/domain";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterDataPatient) => {
    setIsLoading(true);
    try {
      const response = await AuthService.reigister(data);
      if (response.success) {
        alert("User registered successfully");
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (error) {
      const messge =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(messge);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, register };
};
