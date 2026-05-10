package handlers

import (
	"github.com/dashboardtemplate/server/database"
	"github.com/dashboardtemplate/server/models"
	"github.com/dashboardtemplate/server/utils"
	"github.com/gofiber/fiber/v2"
)

func CreateTrip(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)
	trip := new(models.Trip)

	if err := c.BodyParser(trip); err != nil {
		return utils.RespondWithError(c, err, "Invalid request body", 400)
	}

	trip.UserID = userID
	if err := database.DB.Create(trip).Error; err != nil {
		return utils.RespondWithError(c, err, "Failed to create trip", 500)
	}

	return c.Status(201).JSON(trip)
}

func GetTrips(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)
	var trips []models.Trip

	if err := database.DB.Where("user_id = ?", userID).Find(&trips).Error; err != nil {
		return utils.RespondWithError(c, err, "Failed to retrieve trips", 500)
	}

	return c.JSON(trips)
}

func GetTrip(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)
	id := c.Params("id")
	var trip models.Trip

	if err := database.DB.Preload("Itineraries").Preload("Budgets").Preload("Notes").Where("id = ? AND user_id = ?", id, userID).First(&trip).Error; err != nil {
		return utils.RespondWithError(c, err, "Trip not found", 404)
	}

	return c.JSON(trip)
}

func UpdateTrip(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)
	id := c.Params("id")
	trip := new(models.Trip)

	if err := c.BodyParser(trip); err != nil {
		return utils.RespondWithError(c, err, "Invalid request body", 400)
	}

	if err := database.DB.Model(&models.Trip{}).Where("id = ? AND user_id = ?", id, userID).Updates(trip).Error; err != nil {
		return utils.RespondWithError(c, err, "Failed to update trip", 500)
	}

	return c.JSON(fiber.Map{"message": "Trip updated successfully"})
}

func DeleteTrip(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)
	id := c.Params("id")

	if err := database.DB.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Trip{}).Error; err != nil {
		return utils.RespondWithError(c, err, "Failed to delete trip", 500)
	}

	return c.JSON(fiber.Map{"message": "Trip deleted successfully"})
}

// Itinerary Handlers

func AddItinerary(c *fiber.Ctx) error {
	tripID := c.Params("id")
	itinerary := new(models.Itinerary)

	if err := c.BodyParser(itinerary); err != nil {
		return utils.RespondWithError(c, err, "Invalid request body", 400)
	}

	itinerary.TripID = utils.StringToUint(tripID)
	if err := database.DB.Create(itinerary).Error; err != nil {
		return utils.RespondWithError(c, err, "Failed to add itinerary item", 500)
	}

	return c.Status(201).JSON(itinerary)
}

// Budget Handlers

func AddBudget(c *fiber.Ctx) error {
	tripID := c.Params("id")
	budget := new(models.Budget)

	if err := c.BodyParser(budget); err != nil {
		return utils.RespondWithError(c, err, "Invalid request body", 400)
	}

	budget.TripID = utils.StringToUint(tripID)
	if err := database.DB.Create(budget).Error; err != nil {
		return utils.RespondWithError(c, err, "Failed to add budget item", 500)
	}

	return c.Status(201).JSON(budget)
}
