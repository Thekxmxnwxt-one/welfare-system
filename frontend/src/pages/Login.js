import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//import { person } from '../data/PersonData';
import '../styles/Login.css';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // สำหรับแสดงข้อผิดพลาด
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // ส่งข้อมูล username และ password ไปยัง backend API
      const response = await fetch('/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // ส่งข้อมูล JSON
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      // รับผลลัพธ์จาก backend
      const userData = await response.json();

      // ถ้าล็อกอินสำเร็จ ให้ตั้งค่าผู้ใช้และย้ายไปยัง dashboard
      // ตั้งค่า user ลงใน state เพื่อใช้ในภายหลัง
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/profile');
    } catch (err) {
      // แสดงข้อความแจ้งเตือนเมื่อเกิดข้อผิดพลาด
      setError('Username หรือ Password ไม่ถูกต้อง');
    }
  };

  return (
  <section>
    <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> 
    <div class="signin"> 
      <div class="content"> 
        <h2>Sign In</h2> 
        <div class="form"> 
        <form onSubmit={handleLogin} className="form"> 
          <div class="inputBox"> 
            <input type="text" required value={username}
                onChange={(e) => setUsername(e.target.value)} /> 
            <i>Username</i> 
          </div> 
          <div class="inputBox"> 
            <input type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}/> 
            <i>Password</i> 
          </div> 
          
          <div class="inputBox"> 
            <input type="submit" value="Login" /> 
          </div>
          </form> 
          {error && <p className="error">{error}</p>} {/* แสดงข้อความแจ้งเตือน */}
        </div> 
      </div> 
    </div> 
  </section>
);
};

export default Login;
