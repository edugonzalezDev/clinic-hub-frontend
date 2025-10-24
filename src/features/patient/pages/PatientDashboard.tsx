import Header from "../dashboard/header/Header";
import ProfileActions from "../dashboard/ProfileActions";
import StatsCards from "../dashboard/StatsCards";
import HealthCharts from "../dashboard/HealthCards";
import HealthIndicators from "../dashboard/HealthIndicators";
import AppointmentsDashboard from "../dashboard/Appointment";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-indigo-100">
      <Header />
      <main className="max-w-520 mx-auto px-6 py-8 ">
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome back, John!
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Here's your healthcare overview
        </p>
        <ProfileActions />
        <StatsCards
          completed={12}
          upcoming={2}
          teleconsults={5}
          reminders={1}
        />
        <HealthCharts />
        <HealthIndicators />
        <AppointmentsDashboard />
      </main>
    </div>
  );
};

export default Dashboard;
