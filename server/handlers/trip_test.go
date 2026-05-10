package handlers

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/dashboardtemplate/server/database"
	"github.com/dashboardtemplate/server/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB() {
	var err error
	database.DB, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	database.DB.AutoMigrate(&models.User{}, &models.Trip{}, &models.Itinerary{}, &models.Budget{}, &models.Note{})
}

func TestCreateTrip(t *testing.T) {
	setupTestDB()
	app := fiber.New()
	
	// Mock middleware to set user_id
	app.Use(func(c *fiber.Ctx) error {
		c.Locals("user_id", uint(1))
		return c.Next()
	})
	
	app.Post("/trips", CreateTrip)

	trip := models.Trip{
		Title:       "Test Trip",
		Destination: "Test Destination",
	}
	body, _ := json.Marshal(trip)

	req := httptest.NewRequest("POST", "/trips", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := app.Test(req)

	if resp.StatusCode != 201 {
		t.Errorf("Expected status code 201, got %d", resp.StatusCode)
	}

	var createdTrip models.Trip
	json.NewDecoder(resp.Body).Decode(&createdTrip)

	if createdTrip.Title != "Test Trip" {
		t.Errorf("Expected title 'Test Trip', got '%s'", createdTrip.Title)
	}
	
	if createdTrip.UserID != 1 {
		t.Errorf("Expected UserID 1, got %d", createdTrip.UserID)
	}
}

func TestGetTrips(t *testing.T) {
	setupTestDB()
	
	// Seed data
	database.DB.Create(&models.Trip{Title: "Trip 1", UserID: 1, Destination: "Dest 1"})
	database.DB.Create(&models.Trip{Title: "Trip 2", UserID: 1, Destination: "Dest 2"})
	database.DB.Create(&models.Trip{Title: "Trip 3", UserID: 2, Destination: "Dest 3"})

	app := fiber.New()
	app.Use(func(c *fiber.Ctx) error {
		c.Locals("user_id", uint(1))
		return c.Next()
	})
	app.Get("/trips", GetTrips)

	req := httptest.NewRequest("GET", "/trips", nil)
	resp, _ := app.Test(req)

	if resp.StatusCode != 200 {
		t.Errorf("Expected status code 200, got %d", resp.StatusCode)
	}

	var trips []models.Trip
	json.NewDecoder(resp.Body).Decode(&trips)

	if len(trips) != 2 {
		t.Errorf("Expected 2 trips, got %d", len(trips))
	}
}
