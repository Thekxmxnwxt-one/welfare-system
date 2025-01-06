import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";  // Assuming you use the same CSS structure

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem('user')); 

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/images/ooca-logo-color.svg" alt="logo" />
        <h1>TELEMEDICA</h1>
      </div>
      <ul className="sidebar-links">
        <h4>
          <span>สรุปการใช้สวัสดิการ</span>
          <div className="menu-separator"></div>
        </h4>
        <li>
          <Link to="/dashboard">
            <span className="material-symbols-outlined"></span>
            สวัสดิการทั้งหมด
          </Link>
        </li>
        <li>
          <Link to="/analytic">
            <span className="material-symbols-outlined"></span>
            สวัสดิการคงเหลือ
          </Link>
        </li>
        <h4>
          <span>ทั่วไป</span>
          <div className="menu-separator"></div>
        </h4>
        <li>
          <Link to="/claim">
            <span className="material-symbols-outlined"></span>
            ประกันสุขภาพกลุ่ม
          </Link>
        </li>
        <li>
          <Link to="/healthcheck">
            <span className="material-symbols-outlined"></span>
            การตรวจสุขภาพประจำปี
          </Link>
        </li>
        <li>
          <Link to="/oocacheck">
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
        <img src={user.image} alt="Profile" /> {/* ใช้รูปจาก PersonData */}
          <div className="user-detail">
            <h3>{user.name}</h3> {/* ใช้ชื่อจาก PersonData */}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;