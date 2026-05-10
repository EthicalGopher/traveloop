package main

import (
	"log"

	"github.com/dashboardtemplate/server/database"
	"github.com/dashboardtemplate/server/handlers"
	"github.com/dashboardtemplate/server/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	database.InitDB()

	app := fiber.New()

	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
	}))

	// Static files for avatars
	app.Static("/uploads", "./uploads")

	// Public Auth Routes
	auth := app.Group("/auth")
	auth.Post("/signup", handlers.Signup)
	auth.Post("/login", handlers.Login)
	auth.Post("/refresh", handlers.Refresh)
	auth.Get("/verify-email", handlers.VerifyEmail)
	auth.Post("/forgot-password", handlers.ForgotPassword)
	auth.Post("/reset-password", handlers.ResetPassword)

	// User Routes
	user := app.Group("/user", middleware.Auth)
	user.Get("/profile", handlers.GetProfile)
	user.Put("/profile", handlers.UpdateProfile)
	user.Post("/avatar", handlers.UploadAvatar)
	user.Get("/confirm-email-change", handlers.ConfirmEmailChange)

	// Admin Routes (Protected)
	admin := app.Group("/admin", middleware.Auth, middleware.AdminOnly)
	admin.Get("/applications", handlers.GetPendingApplications)
	admin.Get("/applications/count", handlers.GetPendingApplicationsCount)
	admin.Post("/applications/:id/approve", handlers.ApproveApplication)
	admin.Post("/applications/:id/reject", handlers.RejectApplication)
	admin.Get("/users", handlers.GetAllUsers)
	admin.Get("/trips", handlers.GetAllTrips)
	admin.Get("/analytics", handlers.GetAdminAnalytics)
	admin.Get("/summary", handlers.GetAdminSummary)

	// AI Routes
	ai := app.Group("/ai", middleware.Auth)
	ai.Post("/chat", handlers.AIChat)

	// Trip Routes
	trips := app.Group("/trips", middleware.Auth)
	trips.Post("/", handlers.CreateTrip)
	trips.Get("/", handlers.GetTrips)
	trips.Get("/:id", handlers.GetTrip)
	trips.Put("/:id", handlers.UpdateTrip)
	trips.Delete("/:id", handlers.DeleteTrip)
	trips.Post("/:id/itinerary", handlers.AddItinerary)
	trips.Put("/itinerary/:itemId", handlers.UpdateItinerary)
	trips.Delete("/itinerary/:itemId", handlers.DeleteItinerary)
	trips.Post("/:id/budget", handlers.AddBudget)
	trips.Put("/budget/:itemId", handlers.UpdateBudget)
	trips.Delete("/budget/:itemId", handlers.DeleteBudget)
	trips.Post("/:id/note", handlers.AddNote)
	trips.Put("/note/:itemId", handlers.UpdateNote)
	trips.Delete("/note/:itemId", handlers.DeleteNote)
	trips.Put("/:id/share", handlers.ToggleShareTrip)

	// Community Routes
	community := app.Group("/community")
	community.Get("/trips", handlers.GetPublicTrips)
	community.Post("/trips/:id/like", middleware.Auth, handlers.LikeTrip)
	community.Post("/trips/:id/bookmark", middleware.Auth, handlers.BookmarkTrip)

	log.Fatal(app.Listen(":8080"))
}
