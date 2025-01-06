package handlers

import (
	"net/http"
	"strconv"
	welfareapp "welfareproject/internal/welfare"

	"github.com/gin-gonic/gin"
)

type BookHandlers struct {
	bs *welfareapp.WelfareApp
}

func NewBookHandlers(bs *welfareapp.WelfareApp) *BookHandlers {
	return &BookHandlers{bs: bs}
}

func (h *BookHandlers) LoginHandler(c *gin.Context) {
	var loginData struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.bs.GetLogin(c.Request.Context(), loginData.Username, loginData.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *BookHandlers) AddWelfare(c *gin.Context) {
	var welfare welfareapp.Welfare
	if err := c.ShouldBindJSON(&welfare); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	if err := h.bs.AddWelfare(c.Request.Context(), welfare); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, welfare)
}

func (h *BookHandlers) DeleteWelfare(c *gin.Context) {
	idStr := c.Param("id") // ดึง id จาก URL

	// แปลง id จาก string เป็น int
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	// เรียกใช้ฟังก์ชันใน service เพื่อทำการลบ
	if err := h.bs.DeleteWelfare(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil) // ส่งสถานะ 204 No Content
}

// GetAllBook
func (h *BookHandlers) GetAllWelfares(c *gin.Context) {
	welfares, err := h.bs.GetAllWelfare(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, welfares)
}

// GetAllBook
func (h *BookHandlers) GetAllClaim(c *gin.Context) {
	books, err := h.bs.GetAllClaim(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, books)
}

func (h *BookHandlers) ConfirmClaim(c *gin.Context) {
	claimID, err := strconv.Atoi(c.Param("id")) // แปลง ID เป็น int
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid claim ID"})
		return
	}

	// เรียกใช้ฟังก์ชันเพื่ออัปเดตสถานะเป็น "เสร็จสิ้น"
	err = h.bs.UpdateClaimStatus(c.Request.Context(), claimID, "เสร็จสิ้น")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Claim confirmed successfully"})
}

func (h *BookHandlers) RejectClaim(c *gin.Context) {
	claimID, err := strconv.Atoi(c.Param("id")) // แปลง ID เป็น int
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid claim ID"})
		return
	}

	// เรียกใช้ฟังก์ชันเพื่ออัปเดตสถานะเป็น "ถูกปฏิเสธ"
	err = h.bs.UpdateClaimStatus(c.Request.Context(), claimID, "ถูกปฏิเสธ")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Claim rejected successfully"})
}

func (h *BookHandlers) GetAllHealthCheack(c *gin.Context) {
	books, err := h.bs.GetAllHealthCheack(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, books)
}

func (h *BookHandlers) ConfirmHealth(c *gin.Context) {
	claimID, err := strconv.Atoi(c.Param("id")) // แปลง ID เป็น int
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid claim ID"})
		return
	}

	// เรียกใช้ฟังก์ชันเพื่ออัปเดตสถานะเป็น "เสร็จสิ้น"
	err = h.bs.UpdateHealthStatus(c.Request.Context(), claimID, "เสร็จสิ้น")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Claim confirmed successfully"})
}

func (h *BookHandlers) RejectHealth(c *gin.Context) {
	claimID, err := strconv.Atoi(c.Param("id")) // แปลง ID เป็น int
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid claim ID"})
		return
	}

	// เรียกใช้ฟังก์ชันเพื่ออัปเดตสถานะเป็น "ถูกปฏิเสธ"
	err = h.bs.UpdateHealthStatus(c.Request.Context(), claimID, "ถูกปฏิเสธ")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Claim rejected successfully"})
}

func (h *BookHandlers) GetAllOoca(c *gin.Context) {
	books, err := h.bs.GetAllOocaCheack(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, books)
}

func (h *BookHandlers) ConfirmOoca(c *gin.Context) {
	claimID, err := strconv.Atoi(c.Param("id")) // แปลง ID เป็น int
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid claim ID"})
		return
	}

	// เรียกใช้ฟังก์ชันเพื่ออัปเดตสถานะเป็น "เสร็จสิ้น"
	err = h.bs.UpdateOocaStatus(c.Request.Context(), claimID, "เสร็จสิ้น")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Claim confirmed successfully"})
}

func (h *BookHandlers) RejectOoca(c *gin.Context) {
	claimID, err := strconv.Atoi(c.Param("id")) // แปลง ID เป็น int
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid claim ID"})
		return
	}

	// เรียกใช้ฟังก์ชันเพื่ออัปเดตสถานะเป็น "ถูกปฏิเสธ"
	err = h.bs.UpdateOocaStatus(c.Request.Context(), claimID, "ถูกปฏิเสธ")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Claim rejected successfully"})
}

// AddClaim handles the POST request to add a new claim.
func (h *BookHandlers) CreateHealthCheck(c *gin.Context) {
	var claim welfareapp.HealthCheckRequest
	if err := c.ShouldBindJSON(&claim); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	// ตรวจสอบว่า person_id มีอยู่ในฐานข้อมูล
	if err := h.bs.CheckPersonExists(c.Request.Context(), claim.PersonID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "person does not exist"})
		return
	}

	// บันทึกการเคลม
	if err := h.bs.CreateHealthClaim(c.Request.Context(), claim); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, claim) // ส่งกลับข้อมูลที่บันทึก
}

func (h *BookHandlers) CreateOocaCheck(c *gin.Context) {
	var claim welfareapp.OocaCheckRequest
	if err := c.ShouldBindJSON(&claim); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	// ตรวจสอบว่า person_id มีอยู่ในฐานข้อมูล
	if err := h.bs.CheckPersonExists(c.Request.Context(), claim.PersonID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "person does not exist"})
		return
	}

	// บันทึกการเคลม
	if err := h.bs.CreateOoca(c.Request.Context(), claim); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, claim) // ส่งกลับข้อมูลที่บันทึก
}

// AddClaim handles the POST request to add a new claim.
func (h *BookHandlers) CreateHealthClaim(c *gin.Context) {
	var claim welfareapp.Claim
	if err := c.ShouldBindJSON(&claim); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	// ตรวจสอบว่า person_id มีอยู่ในฐานข้อมูล
	if err := h.bs.CheckPersonExists(c.Request.Context(), claim.PersonID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "person does not exist"})
		return
	}

	// บันทึกการเคลม
	if err := h.bs.CreateClaim(c.Request.Context(), claim); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, claim) // ส่งกลับข้อมูลที่บันทึก
}

func (h *BookHandlers) HealthCheck(c *gin.Context) {
	err := h.bs.Ping()
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status": "unhealthy",
			"reason": "Database connection failed",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "healthy"})
}
