import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/healthClaim.css';

const API_URL = '/api/v1/claim';

const HealthClaimTable = () => {
    const user = JSON.parse(localStorage.getItem('user')); // ดึงข้อมูลผู้ใช้จาก Context
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Failed to fetch claims, status code: ${response.status}`);
                }
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    // กรองข้อมูลเพื่อเก็บเฉพาะเคลมที่ตรงกับ user.id
                    const userClaims = data.filter(claim => claim.person_name === user.name);
                    console.log(userClaims);
                    setClaims(userClaims);
                } else {
                    throw new Error('Unexpected data format');
                }
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [user.name]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const handleCreateClaim = () => {
        navigate('/new-employee-claim');
    };

    // กรองเฉพาะเคลมที่มีสถานะ 'รอพิจารณา'
    const pendingClaims = claims.filter(claim => claim.status === 'รอการพิจารณา');

    // กรองเฉพาะเคลมที่มีสถานะ 'ถูกปฏิเสธ' หรือ 'เสร็จสิ้น'
    const filteredUserHistoryClaims = claims.filter(hisclaim => 
        hisclaim.status === 'ถูกปฏิเสธ' || hisclaim.status === 'เสร็จสิ้น'
    );

    return (
        <div className="claims-status-page">
            <div className="claims-tables-container">
                <button className="create-claim-button" onClick={handleCreateClaim}>
                    สร้างเคลมประกันสุขภาพ
                </button>

                <div className="tables-container">
                    {/* Table สถานะการเคลม */}
                    <div className="table-container">
                        <h1>สถานะคำขอ</h1>
                        <table className="claims-table">
                            <thead>
                                <tr>
                                    <th>หมายเลขการเคลม</th>
                                    <th>ค่าใช้จ่ายรวม</th>
                                    <th>สถานะ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingClaims.map(claim => (
                                    <tr key={claim.id}>
                                        <td>{claim.id}</td>
                                        <td>{(claim.total_expenses !== undefined && claim.total_expenses !== null) ? claim.total_expenses.toFixed(2) : '0.00'} บาท</td>
                                        <td>{claim.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Table ประวัติการเคลม */}
                    <div className="table-container">
                        <h1>ประวัติการเคลม</h1>
                        {filteredUserHistoryClaims.length === 0 ? (
                            <p>ไม่มีประวัติการเคลมที่ถูกปฏิเสธหรือเสร็จสิ้น</p>
                        ) : (
                            <table className="claims-table">
                                <thead>
                                    <tr>
                                        <th>หมายเลขคำขอ</th>
                                        <th>ค่าใช้จ่ายรวม</th>
                                        <th>สถานะ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUserHistoryClaims.map((hisclaim) => (
                                        <tr key={hisclaim.id}>
                                            <td>{hisclaim.id}</td>
                                            <td>{(hisclaim.total_expenses !== undefined && hisclaim.total_expenses !== null) ? hisclaim.total_expenses.toFixed(2) : '0.00'} บาท</td>
                                            <td>{hisclaim.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthClaimTable;
