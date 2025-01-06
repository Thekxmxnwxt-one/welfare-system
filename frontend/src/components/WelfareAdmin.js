import React, { useState, useEffect } from 'react';
import '../styles/welfareadmin.css';

const API_URL = '/api/v1/welfares';

const WelfareAdmin = () => {
    const [welfares, setAllWelfares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newBenefit, setNewBenefit] = useState({
        name: '',
        image: '',
        note: '',
        number: ''
      });
      
      const handleChange = (e) => {
        const { name, value } = e.target;
        setNewBenefit({
          ...newBenefit,
          [name]: value
        });
      };
      
      const addBenefit = async () => {
        // ตรวจสอบข้อมูลที่กรอก
        if (newBenefit.name && newBenefit.note) {
          // แปลงค่า number จาก string เป็น int ก่อนส่งไปยัง backend
          const payload = {
            ...newBenefit,
            number: parseInt(newBenefit.number, 10) || null // หากไม่สามารถแปลงเป็น int ได้ ให้ส่ง null
          };
      
          console.log('Payload before sending:', JSON.stringify(payload)); // ดูข้อมูลที่ส่งไป
      
          try {
            const response = await fetch(API_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload), // ส่ง payload ที่แปลงแล้ว
            });
      
            // ตรวจสอบสถานะการตอบกลับ
            if (!response.ok) {
              const errorDetails = await response.text(); // รับข้อความข้อผิดพลาดจากเซิร์ฟเวอร์
              throw new Error(`Network response was not ok: ${errorDetails}`);
            }
      
            const addedBenefit = await response.json();
            setAllWelfares((prevWelfares) => [...prevWelfares, addedBenefit]); // เพิ่มสวัสดิการใหม่ใน state
            setNewBenefit({ name: '', image: '', note: '', number: '' }); // เคลียร์ฟอร์มหลังเพิ่ม
          } catch (error) {
            alert('เกิดข้อผิดพลาดในการเพิ่มสวัสดิการ: ' + error.message);
          }
        } else {
          alert('กรุณากรอกข้อมูลให้ครบก่อนนะ! 😅');
        }
      };
      

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          console.error('Response status:', response.status);
          throw new Error(`Failed to fetch welfares, status code: ${response.status}`);
        }

        const data = await response.json();
        console.log(data); // ตรวจสอบข้อมูลที่ได้รับจาก API

        // ตรวจสอบว่าข้อมูลที่ได้รับเป็นอาเรย์
        if (Array.isArray(data)) {
          setAllWelfares(data); // ตั้งค่า welfare เมื่อข้อมูลถูกต้อง
        } else {
          throw new Error('Unexpected data format'); // แจ้งเมื่อข้อมูลไม่ถูกต้อง
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching welfare:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  const deleteBenefit = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        const errorDetails = await response.text(); // รับข้อความข้อผิดพลาดจากเซิร์ฟเวอร์
        throw new Error(`Network response was not ok: ${errorDetails}`);
      }
  
      setAllWelfares((prevWelfares) => prevWelfares.filter((benefit) => benefit.id !== id));
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบสวัสดิการ: ' + error.message);
    }
  };
  
  

  return (
    <div className="welfare-admin">
      <h1>จัดการสวัสดิการ 💼</h1>

      <div className="form">
        <input
          type="text"
          name="name"
          placeholder="ชื่อสวัสดิการ"
          //value={newBenefit.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image"
          placeholder="รูปภาพ"
          //value={newBenefit.image}
          onChange={handleChange}
        />
        <input
          type="text"
          name="note"
          placeholder="รายละเอียด"
          //value={newBenefit.note}
          onChange={handleChange}
        />
        <input
          type="text"
          name="number"
          placeholder="จำนวน"
          //value={newBenefit.number}
          onChange={handleChange}
        />
        <button onClick={addBenefit}>เพิ่มสวัสดิการ ✨</button>
        
      </div>

      <h2>รายการสวัสดิการ 📝</h2>
      <table>
        <thead>
          <tr>
            <th>ชื่อสวัสดิการ</th>
            <th>รูปภาพ</th>
            <th>รายละเอียด</th>
            <th>จำนวน</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {welfares.map((benefit) => (
            <tr key={benefit.id}>
              <td>{benefit.name}</td>
              <td>{benefit.image}</td>
              <td>{benefit.note}</td>
              <td>{benefit.number}</td>
              <td>
              <button onClick={() => deleteBenefit(benefit.id)}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WelfareAdmin;
