// bookstore.go
package welfareapp

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	_ "github.com/lib/pq"
)

type Person struct {
	ID           int    `json:"id"`
	Username     string `json:"username"`
	Password     string `json:"password"`
	Name         string `json:"name"`
	ProfileImage string `json:"image"`
	Birthdate    string `json:"birthdate"`
	JobTitle     string `json:"job_title"`
	Email        string `json:"email"`
	Phone        string `json:"phone"`
	Address      string `json:"address"`
}

// Welfare โครงสร้างข้อมูลสวัสดิการ
type Welfare struct {
	ID     int     `json:"id"`
	Name   string  `json:"name"`
	Image  string  `json:"image"`
	Note   *string `json:"note"`
	Number *int64  `json:"number"` // เปลี่ยนให้เป็น *int64
}

type Claim struct {
	ID             int       `json:"id"`
	PersonID       int       `json:"person_id"`
	PersonName     string    `json:"person_name"` // Foreign key referencing Person
	TreatmentType  string    `json:"treatment_type"`
	TreatmentDate  time.Time `json:"treatment_date"`
	HospitalName   string    `json:"hospital_name"`
	DoctorName     string    `json:"doctor_name"`
	ReasonForClaim string    `json:"reason_for_claim"`
	TotalExpenses  float64   `json:"total_expenses"`
	Status         string    `json:"status"`
}

type HealthCheckRequest struct {
	ID          int       `json:"id"`
	PersonID    int       `json:"person_id"`
	PersonName  string    `json:"person_name"`
	RequestDate time.Time `json:"request_date"` // วันที่ขอเข้าตรวจ
	Status      string    `json:"status"`       // สถานะการขอ (เช่น รอการตรวจสอบ, ยืนยัน)
}

type OocaCheckRequest struct {
	ID          int       `json:"id"`
	PersonID    int       `json:"person_id"`
	PersonName  string    `json:"person_name"`
	RequestDate time.Time `json:"request_date"` // วันที่ขอเข้าตรวจ
	Reason      string    `json:"reason"`
	Status      string    `json:"status"` // สถานะการขอ (เช่น รอการตรวจสอบ, ยืนยัน)
}

// BookDatabase เป็น Interface ที่กำหนดว่า Book Database ต้องทำอะไรได้บ้าง
type welfareDatabase interface {
	GetAllWelfare(ctx context.Context) ([]Welfare, error)
	GetLogin(ctx context.Context, username, password string) (*Person, error)
	AddWelfare(ctx context.Context, welfare Welfare) error
	DeleteWelfare(ctx context.Context, id int) error
	CreateClaim(ctx context.Context, claim Claim) error
	CheckPersonExists(ctx context.Context, personID int) error
	GetAllClaim(ctx context.Context) ([]Claim, error)
	UpdateClaimStatus(ctx context.Context, id int, status string) error
	CreateHealthClaim(ctx context.Context, health HealthCheckRequest) error
	GetAllHealthCheack(ctx context.Context) ([]HealthCheckRequest, error)
	UpdateHealthStatus(ctx context.Context, id int, status string) error
	CreateOoca(ctx context.Context, health OocaCheckRequest) error
	GetAllOocaCheack(ctx context.Context) ([]OocaCheckRequest, error)
	UpdateOocaStatus(ctx context.Context, id int, status string) error
	Close() error
	Ping() error
	Reconnect(connStr string) error
}

// PostgresDatabase เป็น struct ที่เชื่อมต่อกับ PostgreSQL Database จริง
type PostgresDatabase struct {
	db *sql.DB
}

// NewPostgresDatabase สร้าง PostgresDatabase ใหม่และเชื่อมต่อกับฐานข้อมูล
func NewPostgresDatabase(connStr string) (*PostgresDatabase, error) {
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %v", err)
	}

	// ตั้งค่า connection pool
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(10)
	db.SetConnMaxLifetime(5 * time.Minute)

	// ทดสอบการเชื่อมต่อด้วย context
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("failed to ping database: %v", err)
	}

	return &PostgresDatabase{db: db}, nil
}

// จัดการการ login
func (pdb *PostgresDatabase) GetLogin(ctx context.Context, username, password string) (*Person, error) {
	var user Person

	query := "SELECT id, username, password, name, image, birthdate, job_title, email, phone, address FROM persons WHERE username = $1"

	// ค้นหาผู้ใช้
	err := pdb.db.QueryRowContext(ctx, query, username).Scan(
		&user.ID, &user.Username, &user.Password, &user.Name,
		&user.ProfileImage, &user.Birthdate, &user.JobTitle,
		&user.Email, &user.Phone, &user.Address,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to fetch user: %v", err)
	}

	// ตรวจสอบรหัสผ่าน (สมมุติว่ารหัสผ่านถูกเข้ารหัส)
	if user.Password != password { // ควรใช้การเข้ารหัสจริงในรหัสจริง
		return nil, fmt.Errorf("invalid password")
	}

	return &user, nil
}

// ส่วนที่ admin เพิ่มสวัสดิการ
func (pdb *PostgresDatabase) AddWelfare(ctx context.Context, welfare Welfare) error {
	query := "INSERT INTO welfare (name, image,note, number) VALUES ($1, $2, $3, $4) RETURNING id"
	err := pdb.db.QueryRowContext(ctx, query, welfare.Name, welfare.Image, welfare.Note, welfare.Number).Scan(&welfare.ID)
	if err != nil {
		return fmt.Errorf("failed to add welfare: %v", err)
	}
	return nil
}

// ส่วนที่ admin ลบสวัสดิการ
func (pdb *PostgresDatabase) DeleteWelfare(ctx context.Context, id int) error {
	query := "DELETE FROM welfare WHERE id = $1"
	result, err := pdb.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete welfare: %v", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %v", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("no welfare found with id: %d", id)
	}

	return nil
}

// ส่วนสวัสดิการทั้งหมด
func (pdb *PostgresDatabase) GetAllWelfare(ctx context.Context) ([]Welfare, error) {
	// สั่งให้ฐานข้อมูลดึงข้อมูลสวัสดิการทั้งหมด
	rows, err := pdb.db.QueryContext(ctx, "SELECT id, name, image, note, number FROM welfare")
	if err != nil {
		return nil, fmt.Errorf("failed to fetch welfares: %v", err)
	}
	defer rows.Close() // ทำความสะอาดหลังการใช้งาน

	var welfares []Welfare
	for rows.Next() {
		var welfare Welfare
		var note sql.NullString  // ตัวแปรสำหรับ note
		var number sql.NullInt64 // ใช้ NullInt64 สำหรับ number

		// สแกนข้อมูลจากแถวที่อ่าน
		if err := rows.Scan(&welfare.ID, &welfare.Name, &welfare.Image, &note, &number); err != nil {
			return nil, fmt.Errorf("failed to scan welfare: %v", err)
		}

		// ตรวจสอบค่า note
		if note.Valid {
			welfare.Note = &note.String // ถ้า note มีค่า ให้ชี้ไปยัง string ที่มีอยู่
		} else {
			welfare.Note = nil // ถ้า note เป็น NULL ให้ตั้งค่าเป็น nil
		}

		// ตรวจสอบค่า number
		if number.Valid {
			welfare.Number = &number.Int64 // กำหนดค่า number หากมีค่า
		} else {
			welfare.Number = nil // ตั้งค่าเป็น nil หากไม่มีค่า
		}

		welfares = append(welfares, welfare) // เพิ่ม welfare ในรายการ
	}

	// ตรวจสอบความผิดพลาดหลังจาก loop
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("failed during row iteration: %v", err)
	}

	return welfares, nil
}

// เพิ่มการสร้างเคลมที่กรอกในฟอร์มลง database
func (pdb *PostgresDatabase) CreateClaim(ctx context.Context, claim Claim) error {
	_, err := pdb.db.ExecContext(ctx, `INSERT INTO claims (person_id, treatment_type, treatment_date, hospital_name, doctor_name, reason_for_claim, total_expenses, status) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		claim.PersonID, claim.TreatmentType, claim.TreatmentDate, claim.HospitalName, claim.DoctorName, claim.ReasonForClaim, claim.TotalExpenses, claim.Status)
	return err
}

// แสดงการเคลมทั้งหมดที่ถูกบันทึกลงใน database
func (pdb *PostgresDatabase) GetAllClaim(ctx context.Context) ([]Claim, error) {
	rows, err := pdb.db.QueryContext(ctx, `
    SELECT claims.id, persons.name, claims.treatment_type, claims.treatment_date, claims.hospital_name, 
           claims.doctor_name, claims.reason_for_claim, claims.total_expenses, claims.status
    FROM claims
    JOIN persons ON claims.person_id = persons.id`)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch books: %v", err)
	}
	defer rows.Close()

	var claims []Claim
	for rows.Next() {
		var claim Claim
		var personName string
		if err := rows.Scan(&claim.ID, &personName, &claim.TreatmentType, &claim.TreatmentDate, &claim.HospitalName, &claim.DoctorName, &claim.ReasonForClaim, &claim.TotalExpenses, &claim.Status); err != nil {
			return nil, fmt.Errorf("failed to scan claims title: %v", err)
		}
		claim.PersonName = personName // Set person_name to the claim struct
		claims = append(claims, claim)
	}

	return claims, nil
}

// update status เมื่อ admin กด
func (pdb *PostgresDatabase) UpdateClaimStatus(ctx context.Context, id int, status string) error {
	query := "UPDATE claims SET status = $1 WHERE id = $2"
	_, err := pdb.db.ExecContext(ctx, query, status, id)
	if err != nil {
		return fmt.Errorf("failed to update claim status: %v", err)
	}
	return nil
}

// เพิ่มคำขอตรวจสุขภาพที่กรอกในฟอร์มลง database
func (pdb *PostgresDatabase) CreateHealthClaim(ctx context.Context, health HealthCheckRequest) error {
	_, err := pdb.db.ExecContext(ctx, `INSERT INTO healthcheck (person_id, request_date, status) 
    VALUES ($1, $2, $3)`,
		health.PersonID, health.RequestDate, health.Status)
	return err
}

// แสดงคำขอตรวจสุขภาพประจำปีทั้งหมดที่ถูกบันทึกลงใน database
func (pdb *PostgresDatabase) GetAllHealthCheack(ctx context.Context) ([]HealthCheckRequest, error) {
	rows, err := pdb.db.QueryContext(ctx, `
    SELECT healthcheck.id, persons.name, healthcheck.request_date, healthcheck.status
    FROM healthcheck
    JOIN persons ON healthcheck.person_id = persons.id`)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch books: %v", err)
	}
	defer rows.Close()

	var claims []HealthCheckRequest
	for rows.Next() {
		var claim HealthCheckRequest
		var personName string
		if err := rows.Scan(&claim.ID, &personName, &claim.RequestDate, &claim.Status); err != nil {
			return nil, fmt.Errorf("failed to scan claims title: %v", err)
		}
		claim.PersonName = personName // Set person_name to the claim struct
		claims = append(claims, claim)
	}

	return claims, nil
}

// update status เมื่อ admin กด
func (pdb *PostgresDatabase) UpdateHealthStatus(ctx context.Context, id int, status string) error {
	query := "UPDATE healthcheck SET status = $1 WHERE id = $2"
	_, err := pdb.db.ExecContext(ctx, query, status, id)
	if err != nil {
		return fmt.Errorf("failed to update claim status: %v", err)
	}
	return nil
}

// เพิ่มคำขอตรวจสุขภาพจิตที่กรอกในฟอร์มลง database
func (pdb *PostgresDatabase) CreateOoca(ctx context.Context, health OocaCheckRequest) error {
	_, err := pdb.db.ExecContext(ctx, `INSERT INTO oocacheck (person_id, request_date, reason, status) 
    VALUES ($1, $2, $3, $4)`,
		health.PersonID, health.RequestDate, health.Reason, health.Status)
	return err
}

// แสดงคำขอตรวจสุขภาพจิตทั้งหมดที่ถูกบันทึกลงใน database
func (pdb *PostgresDatabase) GetAllOocaCheack(ctx context.Context) ([]OocaCheckRequest, error) {
	rows, err := pdb.db.QueryContext(ctx, `
    SELECT oocacheck.id, persons.name, oocacheck.request_date, oocacheck.reason, oocacheck.status
    FROM oocacheck
    JOIN persons ON oocacheck.person_id = persons.id`)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch books: %v", err)
	}
	defer rows.Close()

	var claims []OocaCheckRequest
	for rows.Next() {
		var claim OocaCheckRequest
		var personName string
		if err := rows.Scan(&claim.ID, &personName, &claim.RequestDate, &claim.Reason, &claim.Status); err != nil {
			return nil, fmt.Errorf("failed to scan claims title: %v", err)
		}
		claim.PersonName = personName // Set person_name to the claim struct
		claims = append(claims, claim)
	}

	return claims, nil
}

// update status เมื่อ admin กด
func (pdb *PostgresDatabase) UpdateOocaStatus(ctx context.Context, id int, status string) error {
	query := "UPDATE oocacheck SET status = $1 WHERE id = $2"
	_, err := pdb.db.ExecContext(ctx, query, status, id)
	if err != nil {
		return fmt.Errorf("failed to update claim status: %v", err)
	}
	return nil
}

// ตัวเช็คว่ามีพนักงานคนนี้ใน database
func (pdb *PostgresDatabase) CheckPersonExists(ctx context.Context, personID int) error {
	var exists bool
	err := pdb.db.QueryRowContext(ctx, "SELECT EXISTS(SELECT 1 FROM persons WHERE id=$1)", personID).Scan(&exists)
	if err != nil {
		return fmt.Errorf("error checking if person exists: %v", err)
	}
	if !exists {
		return fmt.Errorf("person does not exist")
	}
	return nil
}

func (pdb *PostgresDatabase) Close() error {
	return pdb.db.Close()
}

func (pdb *PostgresDatabase) Ping() error {
	if pdb == nil {
		return errors.New("database connection is not initialized")
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	return pdb.db.PingContext(ctx)
}

func (pdb *PostgresDatabase) Reconnect(connStr string) error {
	if pdb.db != nil {
		pdb.db.Close()
	}

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return fmt.Errorf("failed to connect to database: %v", err)
	}

	// ตั้งค่า connection pool
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(10)
	db.SetConnMaxLifetime(5 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		return fmt.Errorf("failed to ping database: %v", err)
	}

	pdb.db = db
	return nil
}

// BookStore เป็นโครงสร้างหลักของ Application
type WelfareApp struct {
	db welfareDatabase
}

// NewBookStore สร้าง BookStore ใหม่โดยรับ Database ที่จะใช้
func NewBookStore(db welfareDatabase) *WelfareApp {
	return &WelfareApp{db: db}
}

func (bs *WelfareApp) GetLogin(ctx context.Context, username, password string) (*Person, error) {
	return bs.db.GetLogin(ctx, username, password)
}

func (bs *WelfareApp) AddWelfare(ctx context.Context, welfare Welfare) error {
	return bs.db.AddWelfare(ctx, welfare)
}

func (bs *WelfareApp) DeleteWelfare(ctx context.Context, id int) error {
	return bs.db.DeleteWelfare(ctx, id)
}

func (bs *WelfareApp) GetAllWelfare(ctx context.Context) ([]Welfare, error) {
	return bs.db.GetAllWelfare(ctx)
}

func (bs *WelfareApp) CreateClaim(ctx context.Context, claim Claim) error {
	return bs.db.CreateClaim(ctx, claim)
}

func (bs *WelfareApp) GetAllClaim(ctx context.Context) ([]Claim, error) {
	return bs.db.GetAllClaim(ctx)
}

func (bs *WelfareApp) UpdateClaimStatus(ctx context.Context, id int, status string) error {
	return bs.db.UpdateClaimStatus(ctx, id, status)
}

func (bs *WelfareApp) CreateHealthClaim(ctx context.Context, health HealthCheckRequest) error {
	return bs.db.CreateHealthClaim(ctx, health)
}

func (bs *WelfareApp) GetAllHealthCheack(ctx context.Context) ([]HealthCheckRequest, error) {
	return bs.db.GetAllHealthCheack(ctx)
}

func (bs *WelfareApp) UpdateHealthStatus(ctx context.Context, id int, status string) error {
	return bs.db.UpdateHealthStatus(ctx, id, status)
}

func (bs *WelfareApp) CreateOoca(ctx context.Context, health OocaCheckRequest) error {
	return bs.db.CreateOoca(ctx, health)
}

func (bs *WelfareApp) GetAllOocaCheack(ctx context.Context) ([]OocaCheckRequest, error) {
	return bs.db.GetAllOocaCheack(ctx)
}

func (bs *WelfareApp) UpdateOocaStatus(ctx context.Context, id int, status string) error {
	return bs.db.UpdateOocaStatus(ctx, id, status)
}

func (bs *WelfareApp) CheckPersonExists(ctx context.Context, personID int) error {
	return bs.db.CheckPersonExists(ctx, personID)
}

// Close เป็น Method ของ BookStore ที่ใช้ปิดการเชื่อมต่อกับฐานข้อมูล
func (bs *WelfareApp) Close() error {
	return bs.db.Close()
}

func (bs *WelfareApp) Ping() error {
	if bs.db == nil {
		return fmt.Errorf("database connection is not initialized")
	}
	return bs.db.Ping()
}
