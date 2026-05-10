package handlers

import (
	"time"

	"github.com/dashboardtemplate/server/database"
	"github.com/dashboardtemplate/server/models"
	"github.com/dashboardtemplate/server/utils"
	"github.com/gofiber/fiber/v2"
)

func calculateTripStatus(trip *models.Trip) {
	if trip.StartDate == nil {
		return
	}
	now := time.Now()
	if now.Before(*trip.StartDate) {
		trip.Status = "upcoming"
	} else if trip.EndDate != nil && now.After(*trip.EndDate) {
		trip.Status = "completed"
	} else {
		trip.Status = "ongoing"
	}
}

func CreateTrip(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)
	trip := new(models.Trip)

	if err := c.BodyParser(trip); err != nil {
		return utils.RespondWithError(c, err, "Invalid request body", 400)
	}

	trip.UserID = userID
	calculateTripStatus(trip)

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

	for i := range trips {
		calculateTripStatus(&trips[i])
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

	calculateTripStatus(&trip)

	return c.JSON(trip)
}

func UpdateTrip(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)
	id := c.Params("id")
	trip := new(models.Trip)

	if err := c.BodyParser(trip); err != nil {
		return utils.RespondWithError(c, err, "Invalid request body", 400)
	}

	// Recalculate status if dates changed
	calculateTripStatus(trip)

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

func UpdateItinerary(c *fiber.Ctx) error {
	id := c.Params("itemId")
	itinerary := new(models.Itinerary)

	if err := c.BodyParser(itinerary); err != nil {
		return utils.RespondWithError(c, err, "Invalid request body", 400)
	}

	if err := database.DB.Model(&models.Itinerary{}).Where("id = ?", id).Updates(itinerary).Error; err != nil {
		return utils.RespondWithError(c, err, "Failed to update itinerary item", 500)
	}

	return c.JSON(fiber.Map{"message": "Itinerary item updated successfully"})
}

func DeleteItinerary(c *fiber.Ctx) error {
	id := c.Params("itemId")

	if err := database.DB.Where("id = ?", id).Delete(&models.Itinerary{}).Error; err != nil {
		return utils.RespondWithError(c, err, "Failed to delete itinerary item", 500)
	}

	return c.JSON(fiber.Map{"message": "Itinerary item deleted successfully"})
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

func UpdateBudget(c *fiber.Ctx) error {
	id := c.Params("itemId")
	budget := new(models.Budget)

	if err := c.BodyParser(budget); err != nil {
		return utils.RespondWithError(c, err, "Invalid request body", 400)
	}

	if err := database.DB.Model(&models.Budget{}).Where("id = ?", id).Updates(budget).Error; err != nil {
		return utils.RespondWithError(c, err, "Failed to update budget item", 500)
	}

	return c.JSON(fiber.Map{"message": "Budget item updated successfully"})
}

func DeleteBudget(c *fiber.Ctx) error {
	id := c.Params("itemId")

	if err := database.DB.Where("id = ?", id).Delete(&models.Budget{}).Error; err != nil {
		return utils.RespondWithError(c, err, "Failed to delete budget item", 500)
	}

	return c.JSON(fiber.Map{"message": "Budget item deleted successfully"})
}

// Note Handlers

func AddNote(c *fiber.Ctx) error {
	tripID := c.Params("id")
	note := new(models.Note)

	if err := c.BodyParser(note); err != nil {
		return utils.RespondWithError(c, err, "Invalid request body", 400)
	}

	note.TripID = utils.StringToUint(tripID)
	if err := database.DB.Create(note).Error; err != nil {
		return utils.RespondWithError(c, err, "Failed to add note", 500)
	}

	return c.Status(201).JSON(note)
}

func UpdateNote(c *fiber.Ctx) error {
	id := c.Params("itemId")
	note := new(models.Note)

	if err := c.BodyParser(note); err != nil {
		return utils.RespondWithError(c, err, "Invalid request body", 400)
	}

	if err := database.DB.Model(&models.Note{}).Where("id = ?", id).Updates(note).Error; err != nil {
		return utils.RespondWithError(c, err, "Failed to update note", 500)
	}

	return c.JSON(fiber.Map{"message": "Note updated successfully"})
}

func DeleteNote(c *fiber.Ctx) error {
	id := c.Params("itemId")

	if err := database.DB.Where("id = ?", id).Delete(&models.Note{}).Error; err != nil {
		return utils.RespondWithError(c, err, "Failed to delete note", 500)
	}

	return c.JSON(fiber.Map{"message": "Note deleted successfully"})
}

func ToggleShareTrip(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)
	id := c.Params("id")

	var trip models.Trip
	if err := database.DB.Where("id = ? AND user_id = ?", id, userID).First(&trip).Error; err != nil {
		return utils.RespondWithError(c, err, "Trip not found", 404)
	}

	trip.IsPublic = !trip.IsPublic
	if err := database.DB.Save(&trip).Error; err != nil {
		return utils.RespondWithError(c, err, "Failed to toggle share status", 500)
	}

	return c.JSON(fiber.Map{
		"message":   "Trip share status updated",
		"is_public": trip.IsPublic,
	})
}

func GetPublicTrips(c *fiber.Ctx) error {
	var trips []models.Trip
	if err := database.DB.Preload("User").Preload("Itineraries").Where("is_public = ?", true).Order("created_at desc").Find(&trips).Error; err != nil {
		return utils.RespondWithError(c, err, "Failed to fetch public trips", 500)
	}

	return c.JSON(trips)
}

func LikeTrip(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)
	id := c.Params("id")

	var trip models.Trip
	if err := database.DB.Preload("LikedBy").Where("id = ?", id).First(&trip).Error; err != nil {
		return utils.RespondWithError(c, err, "Trip not found", 404)
	}

	alreadyLiked := false
	for _, user := range trip.LikedBy {
		if user.ID == userID {
			alreadyLiked = true
			break
		}
	}

	if alreadyLiked {
		// Unlike
		database.DB.Model(&trip).Association("LikedBy").Delete(&models.User{ID: userID})
		trip.LikesCount--
	} else {
		// Like
		database.DB.Model(&trip).Association("LikedBy").Append(&models.User{ID: userID})
		trip.LikesCount++
	}

	database.DB.Save(&trip)

	return c.JSON(fiber.Map{
		"message":     "Action successful",
		"likes_count": trip.LikesCount,
		"is_liked":    !alreadyLiked,
	})
}

func BookmarkTrip(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)
	id := c.Params("id")

	var trip models.Trip
	if err := database.DB.Preload("BookmarkedBy").Where("id = ?", id).First(&trip).Error; err != nil {
		return utils.RespondWithError(c, err, "Trip not found", 404)
	}

	alreadyBookmarked := false
	for _, user := range trip.BookmarkedBy {
		if user.ID == userID {
			alreadyBookmarked = true
			break
		}
	}

	if alreadyBookmarked {
		// Unbookmark
		database.DB.Model(&trip).Association("BookmarkedBy").Delete(&models.User{ID: userID})
		trip.BookmarksCount--
	} else {
		// Bookmark
		database.DB.Model(&trip).Association("BookmarkedBy").Append(&models.User{ID: userID})
		trip.BookmarksCount++
	}

	database.DB.Save(&trip)

	return c.JSON(fiber.Map{
		"message":         "Action successful",
		"bookmarks_count": trip.BookmarksCount,
		"is_bookmarked":   !alreadyBookmarked,
	})
}
