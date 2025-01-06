import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";  // Assuming you use the same CSS structure

const SidebarAdmin = ({ user }) => {

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/images/ooca-logo-color.svg" alt="logo" />
        <h1>TELEMEDICA</h1>
      </div>
      <ul className="sidebar-links">
        <h4>
          <span>การจัดการสวัสดิการ</span>
          <div className="menu-separator"></div>
        </h4>
        <li>
          <Link to="/welfareadmin">
            <span className="material-symbols-outlined"></span>
            สวัสดิการทั้งหมด
          </Link>
        </li>
        
        <h4>
          <span>คำร้องขอใช้สวัสดิการ</span>
          <div className="menu-separator"></div>
        </h4>
        <li>
          <Link to="/admin-claims-management">
            <span className="material-symbols-outlined"></span>
            ประกันสุขภาพ
          </Link>
        </li>
        <li>
          <Link to="/admin-health-check">
            <span className="material-symbols-outlined"></span>
            การตรวจสุขภาพประจำปี
          </Link>
        </li>
        <li>
          <Link to="/admin-ooca-check">
            <span className="material-symbols-outlined"></span>
            การพบจิตแพทย์
          </Link>
        </li>
        
        
        <h4>
          <span>บัญชี</span>
          <div className="menu-separator"></div>
        </h4>
        <li>
          <Link to="/profile">
            <span className="material-symbols-outlined"></span>
            โปรไฟล์
          </Link>
        </li>
        <li>
          <Link to="/">
            <span className="material-symbols-outlined"></span>
            ออกจากระบบ
          </Link>
        </li>
      </ul>
      
      <div className="user-account">
        <div className="user-profile">
          <img src={user.image} alt="Profile" />
          <div className="user-detail">
            <h3>{user.name}</h3>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
