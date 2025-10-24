import { Card } from "../ui/Card";

const prescriptions = [
  { title: "Cardiolog y Prescription", date: "20 Apr 2025" },
  { title: "Dentist Prescription", date: "25 Mar 2025" },
  { title: "Dentist Prescription", date: "16 Mar 2025" },
  { title: "Dentist Prescription", date: "12 Feb 2025" },
  { title: "Cardiology Prescription", date: "04 Jan 2025" },
];

const RecentPrescriptions = () => (
  // Usamos tu componente Card
  <Card>
    <ul className="space-y-3">
      {prescriptions.map((item, i) => (
        <li key={i} className="flex items-center justify-between py-1">
          {/* Columna Izquierda: Ícono, Título y Fecha */}
          <div className="flex items-center space-x-3">
            {/* Ícono de Documento */}
            <div className="p-2 bg-gray-100 rounded-full text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>

            {/* Título y Fecha */}
            <div className="flex flex-col">
              <span className="text-base font-medium text-gray-800">
                {item.title}
              </span>
              <time className="text-sm text-gray-500">{item.date}</time>
            </div>
          </div>

          {/* Columna Derecha: Botones de Ver y Descargar */}
          <div className="flex items-center space-x-2">
            {/* Botón de Ver (Ícono de Ojo) */}
            <button
              title="Ver Prescripción"
              className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>

            {/* Botón de Descargar (Ícono de Flecha) */}
            <button
              title="Descargar Prescripción"
              className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  </Card>
);

export default RecentPrescriptions;
