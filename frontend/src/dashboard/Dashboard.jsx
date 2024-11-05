import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";


const Dashboard = () => {

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Sales chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h1>Dashboard</h1>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;