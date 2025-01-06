package main

import (
	"context"
	"log"
	"time"
	"welfareproject/internal/config"
	"welfareproject/internal/handlers"
	welfareapp "welfareproject/internal/welfare"

	"github.com/gin-gonic/gin"
)

func TimeoutMiddleware(timeout time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(c.Request.Context(), timeout)
		defer cancel()

		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}
	db, err := welfareapp.NewPostgresDatabase(cfg.GetConnectionString())
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
	}
	if db != nil {
		defer db.Close()
	}

	bs := welfareapp.NewBookStore(db)
	h := handlers.NewBookHandlers(bs)

	go func() {
		for {
			time.Sleep(10 * time.Second)
			if err := db.Ping(); err != nil {
				log.Printf("Database connection lost: %v", err)
				// พยายามเชื่อมต่อใหม่
				if reconnErr := db.Reconnect(cfg.GetConnectionString()); reconnErr != nil {
					log.Printf("Failed to reconnect: %v", reconnErr)
				} else {
					log.Printf("Successfully reconnected to the database")
				}
			}
		}
	}()

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	r.Use(TimeoutMiddleware(5 * time.Second))

	r.GET("/health", h.HealthCheck)

	// API v1
	v1 := r.Group("/api/v1")
	{

		v1.GET("/welfares", h.GetAllWelfares)
		v1.GET("/claim", h.GetAllClaim)
		v1.GET("/health-check", h.GetAllHealthCheack)
		v1.GET("/ooca-check", h.GetAllOoca)

		v1.POST("/login", h.LoginHandler)
		v1.POST("/welfares", h.AddWelfare)
		v1.POST("/claim", h.CreateHealthClaim)
		v1.POST("claim/:id/confirm", h.ConfirmClaim)
		v1.POST("claim/:id/reject", h.RejectClaim)
		v1.POST("/health-check", h.CreateHealthCheck)
		v1.POST("health-check/:id/confirm", h.ConfirmHealth)
		v1.POST("health-check/:id/reject", h.RejectHealth)
		v1.POST("/ooca-check", h.CreateOocaCheck)
		v1.POST("ooca-check/:id/confirm", h.ConfirmOoca)
		v1.POST("ooca-check/:id/reject", h.RejectOoca)

		v1.DELETE("/welfares/:id", h.DeleteWelfare)

	}

	if err := r.Run(":" + cfg.AppPort); err != nil {
		log.Printf("Failed to run server: %v", err)
	}
}
