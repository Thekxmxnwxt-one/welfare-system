import React from 'react';
import { Card, Col, Row, Progress } from 'antd';
import '../styles/BenefitBalance.css'; // ไฟล์ CSS สำหรับปรับแต่งเพิ่มเติม

const BenefitBalance = () => {
  // ข้อมูลสวัสดิการคงเหลือ
  const benefitData = [
    {
      title: "ประกันสุขภาพกลุ่ม (IPD, OPD, PA)",
      details: [
        { type: "IPD", remaining: 80000, total: 100000 },
        { type: "OPD", remaining: 15000, total: 20000 },
        { type: "PA", remaining: 10000, total: 15000 },
      ]
    },
    {
      title: "ปรึกษาด้านสุขภาพจิต",
      details: [
        { type: "จำนวนครั้งที่สามารถเข้ารับบริการได้", remaining: 2, total: 5 }
      ]
    },
    {
      title: "ประกันสังคมและกองทุนสำรองเลี้ยงชีพ",
      details: [
        { type: "จำนวนเงินกองทุนที่ยังคงเหลือ", remaining: 100000, total: 150000 },
        { type: "จำนวนสิทธิประโยชน์ที่ยังคงเหลือ", remaining: 3, total: 5 }
      ]
    },
    {
      title: "การตรวจสุขภาพประจำปี",
      details: [
        { type: "จำนวนครั้งที่เหลือต่อปี", remaining: 1, total: 2 }
      ]
    },
    {
      title: "ส่วนลดพิเศษดอกเบี้ยเงินกู้ซื้อบ้าน",
      details: [
        { type: "วงเงินที่สามารถกู้ได้", remaining: 5000000, total: 10000000 }
      ]
    }
  ];

  return (
    <div className="benefit-balance-container">
      <Row gutter={[16, 16]}>
        {benefitData.map((benefit, index) => (
          <Col span={8} key={index}>
            <Card title={benefit.title} bordered={false} className="benefit-card">
              {benefit.details.map((detail, idx) => (
                <div key={idx} className="benefit-detail">
                  <p>{detail.type}</p>
                  <Progress 
                    percent={(detail.remaining / detail.total) * 100} 
                    status="active" 
                    showInfo={true}
                    format={() => `${detail.remaining} / ${detail.total}`} // ใช้ backticks แทน
                  />
                </div>
              ))}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BenefitBalance;