// src/pages/auth/RegisterPage.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthService } from "@/api/auth";
import type { RegisterDataPatient } from "@/types/domain";
import { Link, useNavigate } from "react-router";
import { User, Mail, LockKeyhole, Phone, IdCard, Calendar } from "lucide-react";
import { Input } from "@/components/feature/auth/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/feature/auth/Chekbox";
import { registerPatientSchema } from "@/lib/validation/registerPatientFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorNote } from "@/components/feature/auth/errorNote";
export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors,isValid },
  } = useForm<RegisterDataPatient>({
    mode: "all",
    resolver: zodResolver(registerPatientSchema),
  });

  const [globalError, setGlobalError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterDataPatient) => {
    setGlobalError(null);
    try {
      const response = await AuthService.reigister(data);
      console.log(response);

      if (response.success) {
        navigate("/login", {
          state: {
            message: "Registro exitoso. Por favor, inicia sesión.",
            email: response.data?.email,
          },
        });
      } else {
        setGlobalError(response.message);
      }
    } catch (error) {
      console.error(error);
      setGlobalError("Error al registrar. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo: branding + logo (solo en pantllas grandes) */}
      <div className="hidden lg:flex w-1/2 bg-sky-600 items-center justify-center">
        <div className="text-white text-center max-w-md ">
          <h1 className="text-4xl font-bold">HealthFirst</h1>
          <p className="text-lg mt-2 font-medium">
            Secure and seamless access to your health journey. Welcome back
          </p>
        </div>
      </div>
      {/* Panel derecho: formulario de registro */}
      <div className="flex-1 p-10">
        <div className="">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Registrate para acceder a tu cuenta</p>
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type="text"
                id="firstName"
                placeholder="First Name"
                startContent={<User className="size-6 text-gray-400" />}
                size="lg"
                variant={errors.firstName ? "error" : "default"}
                {...register("firstName")}
              />
              {errors.firstName?.message && (
                <ErrorNote message={errors.firstName.message} />
              )}
            </div>
            <div>
              <Input
                type="text"
                id="lastName"
                placeholder="Last Name"
                startContent={<User className="size-6 text-gray-400" />}
                size="lg"
                variant={errors.lastName ? "error" : "default"}
                {...register("lastName")}
              />
              {errors.lastName?.message && (
                <ErrorNote message={errors.lastName.message} />
              )}
            </div>
          </div>
          <div>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              startContent={<Mail className="size-6 text-gray-400" />}
              size="lg"
              variant={errors.email ? "error" : "default"}
              {...register("email")}
            />
            {errors.email?.message && (
              <ErrorNote message={errors.email.message} />
            )}
          </div>
          <div>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              startContent={<LockKeyhole className="size-6 text-gray-400" />}
              size="lg"
              variant={errors.password ? "error" : "default"}
              {...register("password")}
            />
            {errors.password?.message && (
              <ErrorNote message={errors.password.message} />
            )}
          </div>

          <div>
            <Input
              type="password"
              id="passwordConfirmation"
              placeholder="Confirm Password"
              startContent={<LockKeyhole className="size-6 text-gray-400" />}
              size="lg"
              variant={errors.passwordConfirmation ? "error" : "default"}
              {...register("passwordConfirmation")}
            />
            {errors.passwordConfirmation?.message && (
              <ErrorNote message={errors.passwordConfirmation.message} />
            )}
          </div>
          <div>
            <Input
              type="text"
              id="document"
              placeholder="Documento de Identidad"
              startContent={<IdCard className="size-6 text-gray-400" />}
              size="lg"
              variant={errors.document ? "error" : "default"}
              {...register("document")}
            />
            {errors.document?.message && (
              <ErrorNote message={errors.document.message} />
            )}
          </div>
          <div>
            <Input
              type="text"
              id="phone"
              placeholder="Phone"
              startContent={<Phone className="size-6 text-gray-400" />}
              size="lg"
              variant={errors.phone ? "error" : "default"}
              {...register("phone")}
            />
            {errors.phone?.message && (
              <ErrorNote message={errors.phone.message} />
            )}
          </div>
          <div>
            <Input
              type="date"
              id="dateOfBirth"
              placeholder="Date of Birth"
              startContent={<Calendar className="size-6 text-gray-400" />}
              size="lg"
              variant={errors.dateOfBirth ? "error" : "default"}
              {...register("dateOfBirth")}
            />
            {errors.dateOfBirth?.message && (
              <ErrorNote message={errors.dateOfBirth.message} />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="terms" size="lg" {...register("terms")} />
            <label
              htmlFor="terms"
              className="text-sm text-gray-600 cursor-pointer leading-relaxed"
            >
              I agree to the{" "}
              <Link to="/terms" className="text-sky-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-sky-600 hover:underline">
                Privacy Policy
              </Link>
            </label>
            {errors.terms?.message && (
              <ErrorNote message={errors.terms.message} />
            )}
          </div>
          <Button
            type="submit"
            disabled={!isValid}
            className="w-full h-12 bg-sky-600 hover:bg-sky-700 cursor-pointer"
          >
            Register
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-sky-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
