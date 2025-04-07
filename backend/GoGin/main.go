package main

import (
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"uniconnekt.com/m/v2/controllers"
	"uniconnekt.com/m/v2/initializers"
	"uniconnekt.com/m/v2/middleware"
)

func init() {
	initializers.LoadEnvVar()
	initializers.ConnectToDb()
	initializers.SyncDb()
}

// In main.go
func main() {
	router := gin.Default()

	fmt.Println("Starting route registration...")

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true, // This is important for cookies
	}))

	// Define API routes
	router.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": "pong"})
	})

	// Register the signup route with debugging
	router.POST("/signup", controllers.SignUp)
	router.POST("/login", controllers.Login)
	router.GET("/validate", middleware.RequireAuth, controllers.Validate)
	router.POST("/logout", controllers.Logout)

	// Add a test route
	router.GET("/test", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": "test route works"})
	})

	fmt.Println("All routes registered!")

	// Start the server
	router.Run()
}
