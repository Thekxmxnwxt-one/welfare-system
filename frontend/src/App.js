import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import SidebarAdmin from "./components/Sidebar_admin";
import ProfilePage from './pages/ProfilePage';
import { person } from "./data/PersonData";
import WelfareCard from './components/WelfareCard';
import WelfareAdmin from './components/WelfareAdmin';
import HealthClaimTable from './pages/EmployeeHealthClaim';
import NewEmployeeClaim from './components/NewEmployeeClaimForm';
import AdminClaimsManagement from './components/AdminClaimsManagement';
import HealthCheckTable from './pages/EmployeeHealthCheck';
import RequestHealthCheck from './components/NewhealthCheck'
import AdminHealthCheck from './components/AdminHealthCheck';
import OocaCheckTable from './pages/EmployeeOoca';
import RequestOocaCheck from './components/NewOoca';
import AdminOocaCheck from './components/AdminOoca';
import BenefitBalance from './pages/BalanceBenefit';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (username, password) => {
    const foundUser = person.find(
      (p) => p.username === username && p.password === password
    );
    if (foundUser) {
      setUser(foundUser);
    } else {
      alert("Invalid login credentials");
    }
  };

  return (
    <Router>
      {user && (
        user.username === "admin" ? (
          <SidebarAdmin user={user} />
        ) : (
          <Sidebar user={user} />
        )
      )}


      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/dashboard" element={<WelfareCard />} />
        <Route path="/welfareadmin" element={<WelfareAdmin />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/analytic" element={<BenefitBalance />} />

        <Route path="/claim" element={<HealthClaimTable />} />
        <Route path="/new-employee-claim" element={<NewEmployeeClaim />} />
        <Route path="/admin-claims-management" element={<AdminClaimsManagement />} />

        <Route path="/healthcheck" element={<HealthCheckTable />} />
        <Route path="/new-health-check" element={<RequestHealthCheck />} />
        <Route path="/admin-health-check" element={<AdminHealthCheck />} />

        <Route path="/oocacheck" element={<OocaCheckTable />} />
        <Route path="/new-ooca-check" element={<RequestOocaCheck />} />
        <Route path="/admin-ooca-check" element={<AdminOocaCheck />} />
      </Routes>
    </Router>
  );
};

export default App;
