import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/requestHealthCheck.css'; // สไตล์ที่คุณกำหนดเอง

const RequestHealthCheck = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        request_date: ''
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
            request_date: formData.request_date + 'T00:00:00Z', // กำหนดเวลา
            status: 'รอการพิจารณา'
        };

        console.log("Sending request body:", requestBody);

        try {
            const response = await fetch('/api/v1/health-check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${JSON.stringify(responseData)}`);
            }
            alert('คำร้องขอตรวจสุขภาพถูกสร้างเรียบร้อยแล้ว: ' + responseData.id);
            navigate('/healthcheck');
            // คุณอาจจะนำทางไปยังหน้าตารางสถานะคำร้องขอหลังจากส่งแบบฟอร์มเรียบร้อย
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการสร้างคำร้อง: ' + error.message);
        }
    };

    return (
        <div className="request-health-check">
            <h1>ขอตรวจสุขภาพประจำปี</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="date"
                    name="request_date"
                    placeholder="วันที่ขอ"
                    value={formData.request_date}
                    onChange={handleChange}
                    required
                />
                <button type="submit">ส่งคำร้อง</button>
            </form>
        </div>
    );
};

export default RequestHealthCheck;
