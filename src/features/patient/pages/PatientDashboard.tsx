import { useEffect, useState } from "react";
import { usePatientStore } from "../store/usePatientStore";

import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import LatestCheckup from "../dashboard/LatestCheckup.tsx";
import AppointmentForm from "../dashboard/AppointmentForm";
import RecentPrescriptions from "../dashboard/RecentPrescriptions";
import NotificationsPanel from "../dashboard/NotificationsPanel";
import AppointmentsCalendar from "../dashboard/AppointmentsCalendar";
import VisitHistoryChart from "../dashboard/VisitHistoryChart";
import VisitedDoctors from "../dashboard/VisitedDoctors";
import MedicalHistory from "./MedicalHistory.tsx";

const PatientDashboard = () => {
  const {
    patient,
    fetchPatientData,
    fetchVitalsData,
    fetchAppointmentHistory,
  } = usePatientStore();
  const [activeRoute, setActiveRoute] = useState<string>("/"); // Ruta activa

  // Función para cambiar la ruta activa
  const handleRouteChange = (route: string) => {
    setActiveRoute(route);
  };

  // Fetch de datos cuando el componente se monta
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchPatientData();
        await fetchVitalsData();
        await fetchAppointmentHistory?.();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [fetchPatientData, fetchVitalsData, fetchAppointmentHistory]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onRouteChange={handleRouteChange} />
      <main className="flex-1 flex flex-col pl-64">
        <Header />

        <div className="p-8 space-y-6">
          {/* RENDERIZA EL COMPONENTE SEGÚN LA RUTA ACTIVA */}
          {activeRoute === "/" && (
            <>
              <LatestCheckup date="05/06/2025" />

              {/* === CONTENIDO PRINCIPAL + ASIDE DERECHO === */}
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-6">
                <section className="space-y-6">
                  {/* === FORMULARIO AGENDAR CITA === */}
                  <AppointmentForm />
                  <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <article className="bg-white p-6 rounded-2xl shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Recetas recientes
                      </h3>
                      <RecentPrescriptions />
                    </article>

                    <article className="bg-white p-6 rounded-2xl shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Notificaciones recientes
                      </h3>
                      <NotificationsPanel />
                    </article>
                  </section>

                  <section className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Historial de Atenciones
                      </h3>
                      <select className="border rounded-md text-sm p-1 text-gray-600">
                        <option>Último Mes</option>
                        <option>Último Trimestre</option>
                        <option>Último Año</option>
                      </select>
                    </div>
                    <VisitHistoryChart />
                  </section>
                </section>

                <aside className="space-y-6 w-full mx-auto xl:mx-0">
                  <AppointmentsCalendar />
                  <VisitedDoctors />
                </aside>
              </div>
            </>
          )}

          {activeRoute === "/citas" && (
            <>
              <MedicalHistory />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
