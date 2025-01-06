import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import '../styles/WelfareCard.css';

const API_URL = '/api/v1/welfares';

const WelfareCard = () => {
  const [welfares, setAllWelfares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="welfare-card-container">
      {welfares.map((welfare) => (
        <Card key={welfare.id} className="welfare-card">
          <Card.Img variant="top" src={welfare.image} alt={welfare.name} />
          <Card.Body className="welfare-card-body">
            <Card.Title className="welfare-card-title">{welfare.name}</Card.Title>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default WelfareCard;
