import { Card } from "../ui/Card";

// Definición de los datos exactos que aparecen en la imagen
const notifications = [
  {
    title: (
      <>
        Cita confirmada con{" "}
        <strong className="font-semibold">Dr. Martínez</strong>
      </>
    ),
    date: "24 Mar 2025, 10:55 AM",
    color: "bg-green-500", // Punto verd
  },
  {
    title: (
      <>
        <strong className="font-semibold">Blood Pressure Check</strong> (Home
        Monitoring)
      </>
    ),
    date: "24 Apr 2025, 11:00 AM",
    color: "bg-orange-500", // Punto naranja
  },
  {
    title: (
      <>
        <strong className="font-semibold">Physical Therapy Session</strong> Knee
      </>
    ),
    subtitle: "strengthening exercises",
    date: "24 Apr 2025, 11:00 AM",
    color: "bg-purple-600", // Punto morado
  },
  {
    title: (
      <>
        <strong className="font-semibold">Discuss dietary changes</strong> to
        manage blood
      </>
    ),
    subtitle: "sugar levels and weight",
    date: "24 Apr 2025, 11:00 AM",
    color: "bg-blue-500", // Punto azul
  },
];

const NotificationsPanel = () => (
  <Card>
    {/* Contenedor de la línea de tiempo */}
    <ul className="space-y-4 pt-2 relative">
      {/* La línea punteada vertical. Se posiciona absolutamente */}
      <div className="absolute top-0 bottom-0 left-[6px] w-[1px] border-l border-dotted border-gray-300"></div>

      {notifications.map((item, i) => (
        <li key={i} className="flex relative">
          {/* Círculo de color (Timeline Dot) */}
          <div
            className={`w-3 h-3 rounded-full ${item.color} absolute left-0 top-0 transform -translate-x-[50%]`}
          ></div>

          {/* Contenido de la notificación */}
          <div className="ml-5 text-sm">
            {/* Título/Mensaje principal */}
            <p className="text-gray-800 leading-snug">{item.title}</p>

            {/* Subtítulo/Línea secundaria (si existe) */}
            {item.subtitle && (
              <p className="text-gray-600 leading-snug">{item.subtitle}</p>
            )}

            {/* Fecha y Hora */}
            <time className="block text-gray-500 mt-1">{item.date}</time>
          </div>
        </li>
      ))}
    </ul>
  </Card>
);

export default NotificationsPanel;
