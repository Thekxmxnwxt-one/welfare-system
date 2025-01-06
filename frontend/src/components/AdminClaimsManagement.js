import React, { useState, useEffect } from 'react';
import '../styles/adminClaimsManagement.css'; // สไตล์ที่คุณกำหนดเอง

const API_URL = '/api/v1/claim'; // URL สำหรับดึงข้อมูลการเคลม

const AdminClaimsManagement = () => {
    const [claims, setClaims] = useState([]); // สถานะการเคลม
    const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล
    const [error, setError] = useState(null); // ข้อผิดพลาดที่เกิดขึ้น
    const [selectedClaim, setSelectedClaim] = useState(null); // การเคลมที่เลือกเพื่อแสดงรายละเอียด

    useEffect(() => {
        const fetchClaims = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Failed to fetch claims, status code: ${response.status}`);
                }
                const data = await response.json();
                // กรองเฉพาะการเคลมที่อยู่ในสถานะ "รอการพิจารณา"
                const pendingClaims = data.filter(claim => claim.status === 'รอการพิจารณา');
                setClaims(pendingClaims);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchClaims();
    }, []);

    const handleDetailClick = (claim) => {
        setSelectedClaim(claim); // ตั้งค่าการเคลมที่เลือกเพื่อแสดงรายละเอียด
    };

    const handleConfirm = async (id) => {
        if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการยืนยันการเคลมนี้?')) return; // ยืนยันการยืนยันการเคลม
        // เรียก API เพื่อยืนยันการเคลม
        try {
            const response = await fetch(`${API_URL}/${id}/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to confirm claim, status code: ${response.status}`);
            }
            alert('ยืนยันการเคลมเรียบร้อยแล้ว');
            // ทำการรีเฟรชรายการเคลมใหม่
            setClaims(claims.filter(claim => claim.id !== id));
            setSelectedClaim(null); // รีเซ็ตการเลือก
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการยืนยันการเคลม: ' + error.message);
        }
    };
    
    const handleReject = async (id) => {
        if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการปฏิเสธการเคลมนี้?')) return; // ยืนยันการปฏิเสธการเคลม
        // เรียก API เพื่อปฏิเสธการเคลม
        try {
            const response = await fetch(`${API_URL}/${id}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to reject claim, status code: ${response.status}`);
            }
            alert('ปฏิเสธการเคลมเรียบร้อยแล้ว');
            // ทำการรีเฟรชรายการเคลมใหม่
            setClaims(claims.filter(claim => claim.id !== id));
            setSelectedClaim(null); // รีเซ็ตการเลือก
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการปฏิเสธการเคลม: ' + error.message);
        }
    };
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="admin-claims-management">
            <h1>การจัดการคำขอการเคลม</h1>
            {claims.length === 0 ? (
                <p>ไม่มีคำขอการเคลมที่รอการพิจารณา</p>
            ) : (
                <table className="claims-table">
                    <thead>
                        <tr>
                            <th>หมายเลขการเคลม</th>
                            <th>ชื่อผู้ขอเคลม</th> {/* คอลัมน์ชื่อผู้ขอเคลม */}
                            <th>ประเภทการรักษา</th>
                            <th>ค่าใช้จ่ายรวม</th>
                            <th>สถานะ</th>
                            <th>รายละเอียด</th>
                        </tr>
                    </thead>
                    <tbody>
                        {claims.map(claim => (
                            <tr key={claim.id}>
                                <td>{claim.id}</td>
                                <td>{claim.person_name}</td> {/* แสดงชื่อผู้ขอเคลม */}
                                <td>{claim.treatment_type}</td>
                                <td>{claim.total_expenses} บาท</td>
                                <td>{claim.status}</td>
                                <td>
                                    <button onClick={() => handleDetailClick(claim)}>รายละเอียด</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedClaim && (
                <div className="claim-detail">
                    <h2>รายละเอียดการเคลม</h2>
                    <p><strong>ชื่อผู้ขอเคลม:</strong> {selectedClaim.person_name}</p> {/* แสดงชื่อของคนขอเคลม */}
                    <p><strong>หมายเลขการเคลม:</strong> {selectedClaim.id}</p>
                    <p><strong>ประเภทการรักษา:</strong> {selectedClaim.treatment_type}</p>
                    <p><strong>วันที่รักษา:</strong> {selectedClaim.treatment_date.split('T')[0]}</p>
                    <p><strong>ชื่อโรงพยาบาล:</strong> {selectedClaim.hospital_name}</p>
                    <p><strong>ชื่อแพทย์:</strong> {selectedClaim.doctor_name}</p>
                    <p><strong>เหตุผลในการเคลม:</strong> {selectedClaim.reason_for_claim}</p>
                    <p><strong>ค่าใช้จ่ายรวม:</strong> {selectedClaim.total_expenses} บาท</p>
                    <p><strong>สถานะ:</strong> {selectedClaim.status}</p>
                    <div className="button-container">
                    <div className='button-submit'>
                        <button onClick={() => handleConfirm(selectedClaim.id)}>ยืนยัน</button>
                    </div>
                    <div className='button-reject'>
                        <button onClick={() => handleReject(selectedClaim.id)}>ปฏิเสธ</button>
                    </div>
                    <div className='button-close'>
                        <button onClick={() => setSelectedClaim(null)}>ปิด</button> {/* ปิดรายละเอียด */}
                    </div>
                    </div>
                    </div>
            )}
        </div>
    );
};

export default AdminClaimsManagement;
