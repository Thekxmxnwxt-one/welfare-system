import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/newHealthClaim.css';

const API_URL = '/api/v1/claim';

const NewEmployeeClaim = () => {
    const user = JSON.parse(localStorage.getItem('user')); // ดึงข้อมูลผู้ใช้จาก Context
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        treatment_type: '',
        treatment_date: '',
        hospital_name: '',
        doctor_name: '',
        reason_for_claim: '',
        total_expenses: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const requestBody = {
            person_id: user.id,
            treatment_type: formData.treatment_type,
            // เปลี่ยน treatment_date ให้เป็นแค่วันที่
            treatment_date: formData.treatment_date + 'T00:00:00Z', // คุณอาจจะต้องแปลงให้เป็น 'YYYY-MM-DD' หรืออาจจะใช้การแปลงแบบอื่น
            hospital_name: formData.hospital_name,
            doctor_name: formData.doctor_name,
            reason_for_claim: formData.reason_for_claim,
            total_expenses: parseFloat(formData.total_expenses), // แปลงเป็น float
            status: 'รอการพิจารณา'
        };
    
        console.log("Sending request body:", requestBody);
        
        try {
            const response = await fetch('/api/v1/claim', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
    
            const responseData = await response.json(); // ดึงข้อมูลการตอบกลับทันที
    
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${JSON.stringify(responseData)}`);
            }
    
            console.log("Response from API:", responseData);
            alert('การเคลมถูกสร้างเรียบร้อยแล้ว: ' + responseData.id);
            navigate('/claim');
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการสร้างการเคลม: ' + error.message);
        }
    };
    


    return (
        <div className="new-employee-claim">
            <h1>สร้างการเคลมพนักงาน</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="treatment_type"
                    placeholder="ประเภทการรักษา"
                    value={formData.treatment_type} // เพิ่มการแสดงค่า
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="treatment_date"
                    placeholder="วันที่รักษา"
                    value={formData.treatment_date} // เพิ่มการแสดงค่า
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="hospital_name"
                    placeholder="ชื่อโรงพยาบาล"
                    value={formData.hospital_name} // เพิ่มการแสดงค่า
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="doctor_name"
                    placeholder="ชื่อแพทย์"
                    value={formData.doctor_name} // เพิ่มการแสดงค่า
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="reason_for_claim"
                    placeholder="เหตุผลในการเคลม"
                    value={formData.reason_for_claim} // เพิ่มการแสดงค่า
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="total_expenses"
                    placeholder="ค่าใช้จ่ายรวม"
                    value={formData.total_expenses} // เพิ่มการแสดงค่า
                    onChange={handleChange}
                    required
                />
                <button type="submit">ส่งการเคลม</button>
            </form>
        </div>
    );
};

export default NewEmployeeClaim;
