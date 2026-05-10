package database

import (
	"log"

	"github.com/dashboardtemplate/server/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	var err error
	DB, err = gorm.Open(sqlite.Open("gopherbase.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	DB.AutoMigrate(
		&models.User{},
		&models.Trip{},
		&models.Itinerary{},
		&models.Budget{},
		&models.Note{},
	)
}
