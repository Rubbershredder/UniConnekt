package main

import (
	"fmt"

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

	// Define API routes
	router.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": "pong"})
	})

	// Register the signup route with debugging
	router.POST("/signup", controllers.SignUp)
	router.POST("/login", controllers.Login)
	router.GET("/validate", middleware.RequireAuth, controllers.Validate)

	// Add a test route
	router.GET("/test", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": "test route works"})
	})

	fmt.Println("All routes registered!")

	// Start the server
	router.Run()
}
