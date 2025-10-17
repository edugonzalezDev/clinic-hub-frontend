import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { User, Settings, History, LogOut } from "lucide-react";

const UserSidebar = () => {
  const [hospital, setHospital] = useState<string>("");

  return (
    <Sheet>
      {/* Botón de apertura*/}
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 rounded-full hover:bg-gray-100"
        >
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
            J
          </div>
          <span className="hidden md:inline font-medium text-gray-700">
            John
          </span>
        </Button>
      </SheetTrigger>

      {/* Sidebar */}
      <SheetContent side="left" className="w-[340px] sm:w-[400px] px-6">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">
            Información del Usuario
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          {/* Datos del usuario */}
          <div className="space-y-3">
            <div>
              <Label>Nombre</Label>
              <Input value="John Doe" readOnly />
            </div>
            <div>
              <Label>Correo</Label>
              <Input value="john.doe@healthconnect.com" readOnly />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input value="+56 9 8765 4321" readOnly />
            </div>
            <div>
              <Label>Rol</Label>
              <Input value="Paciente" readOnly />
            </div>
          </div>

          {/* Selección de hospital */}
          <div className="space-y-2">
            <Label>Hospital asignado</Label>
            <Select value={hospital} onValueChange={setHospital}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar hospital" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hospital-norte">
                  Hospital del Norte
                </SelectItem>
                <SelectItem value="hospital-sur">Hospital del Sur</SelectItem>
                <SelectItem value="hospital-central">
                  Hospital Central
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Acciones */}
          <div className="pt-4 border-t space-y-3">
            <Button
              variant="outline"
              className="w-full flex justify-start gap-2"
            >
              <History className="w-4 h-4" /> Historial Médico
            </Button>
            <Button
              variant="outline"
              className="w-full flex justify-start gap-2"
            >
              <Settings className="w-4 h-4" /> Configuración
            </Button>
            <Button
              variant="destructive"
              className="w-full flex justify-start gap-2"
            >
              <LogOut className="w-4 h-4" /> Cerrar sesión
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserSidebar;
