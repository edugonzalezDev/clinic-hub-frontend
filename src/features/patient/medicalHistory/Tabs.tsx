interface TabsProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

const tabs = ["Consultations", "Medications", "Lab Results", "Vitals"];

const Tabs: React.FC<TabsProps> = ({ activeTab, onChange }) => {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1 mb-6 max-w-full">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === tab
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-blue-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
