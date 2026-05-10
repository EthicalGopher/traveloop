package handlers

import (
	"github.com/dashboardtemplate/server/database"
	"github.com/dashboardtemplate/server/models"
	"github.com/dashboardtemplate/server/utils"
	"github.com/gofiber/fiber/v2"
)

func GetPendingApplications(c *fiber.Ctx) error {
	var users []models.User
	if err := database.DB.Where("status = ?", "pending").Find(&users).Error; err != nil {
		return utils.RespondWithError(c, err, "Failed to retrieve pending applications", 500)
	}
	return c.JSON(users)
}

func GetPendingApplicationsCount(c *fiber.Ctx) error {
	var count int64
	if err := database.DB.Model(&models.User{}).Where("status = ?", "pending").Count(&count).Error; err != nil {
		return utils.RespondWithError(c, err, "Failed to count pending applications", 500)
	}
	return c.JSON(fiber.Map{"count": count})
}

func ApproveApplication(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Model(&models.User{}).Where("id = ?", id).Update("status", "active").Error; err != nil {
		return utils.RespondWithError(c, err, "Failed to approve the application", 500)
	}
	return c.JSON(fiber.Map{"message": "Application approved successfully"})
}

func RejectApplication(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Model(&models.User{}).Where("id = ?", id).Update("status", "rejected").Error; err != nil {
		return utils.RespondWithError(c, err, "Failed to reject the application", 500)
	}
	return c.JSON(fiber.Map{"message": "Application rejected successfully"})
}

func GetAllUsers(c *fiber.Ctx) error {
	var users []models.User
	if err := database.DB.Find(&users).Error; err != nil {
		return utils.RespondWithError(c, err, "Failed to retrieve users", 500)
	}
	return c.JSON(users)
}

func GetAllTrips(c *fiber.Ctx) error {
	var trips []models.Trip
	if err := database.DB.Preload("User").Find(&trips).Error; err != nil {
		return utils.RespondWithError(c, err, "Failed to retrieve all trips", 500)
	}
	return c.JSON(trips)
}

func GetAdminAnalytics(c *fiber.Ctx) error {
	// 1. Popular Cities (Destinations)
	type PopularCity struct {
		Destination string `json:"destination"`
		Count       int64  `json:"count"`
	}
	popularCities := []PopularCity{}
	database.DB.Model(&models.Trip{}).Select("destination, count(*) as count").Group("destination").Order("count desc").Limit(10).Scan(&popularCities)

	// 2. Popular Activities
	type PopularActivity struct {
		Activity string `json:"activity"`
		Count    int64  `json:"count"`
	}
	popularActivities := []PopularActivity{}
	database.DB.Model(&models.Itinerary{}).Select("activity, count(*) as count").Where("type = ?", "activity").Group("activity").Order("count desc").Limit(10).Scan(&popularActivities)

	// 3. User Trends (Signups over time - last 30 days)
	type SignupTrend struct {
		Date  string `json:"date"`
		Count int64  `json:"count"`
	}
	signupTrends := []SignupTrend{}
	database.DB.Raw("SELECT date(created_at) as date, count(*) as count FROM users WHERE created_at > date('now', '-30 days') GROUP BY date(created_at) ORDER BY date").Scan(&signupTrends)

	// 4. Trip Trends (Trips over time - last 30 days)
	type TripTrend struct {
		Date  string `json:"date"`
		Count int64  `json:"count"`
	}
	tripTrends := []TripTrend{}
	database.DB.Raw("SELECT date(created_at) as date, count(*) as count FROM trips WHERE created_at > date('now', '-30 days') GROUP BY date(created_at) ORDER BY date").Scan(&tripTrends)

	return c.JSON(fiber.Map{
		"popular_cities":     popularCities,
		"popular_activities": popularActivities,
		"signup_trends":      signupTrends,
		"trip_trends":        tripTrends,
	})
}

func GetAdminSummary(c *fiber.Ctx) error {
	var userCount int64
	var tripCount int64
	var pendingCount int64
	var publicTripCount int64

	database.DB.Model(&models.User{}).Count(&userCount)
	database.DB.Model(&models.Trip{}).Count(&tripCount)
	database.DB.Model(&models.User{}).Where("status = ?", "pending").Count(&pendingCount)
	database.DB.Model(&models.Trip{}).Where("is_public = ?", true).Count(&publicTripCount)

	var recentUsers []models.User
	database.DB.Order("created_at desc").Limit(5).Find(&recentUsers)

	var recentTrips []models.Trip
	database.DB.Preload("User").Order("created_at desc").Limit(5).Find(&recentTrips)

	return c.JSON(fiber.Map{
		"total_users":      userCount,
		"total_trips":      tripCount,
		"pending_requests": pendingCount,
		"shared_journeys":  publicTripCount,
		"recent_users":     recentUsers,
		"recent_trips":     recentTrips,
	})
}
