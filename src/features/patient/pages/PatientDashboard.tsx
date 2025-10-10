import Header from "../dashboard/Header";
import DashboardActions from "../dashboard/DashboardActions";
import AppointmentsList from "../dashboard/AppointmentsList";
import NotificationsPanel from "../dashboard/NotificationsPanel";
import ScheduleAppointment from "../dashboard/ScheduleAppointment";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome back, John!
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Here's your healthcare overview
        </p>
        <DashboardActions />
        <ScheduleAppointment />

        <div className="mt-8 flex flex-col md:flex-row gap-6">
          <AppointmentsList />
          <NotificationsPanel />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
