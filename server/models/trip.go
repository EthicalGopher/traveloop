package models

import (
	"time"
	"gorm.io/gorm"
)

type Trip struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	UserID      uint           `gorm:"index;not null" json:"user_id"`
	User        User           `json:"user"`
	Title       string         `gorm:"not null" json:"title"`
	Destination string         `gorm:"not null" json:"destination"`
	StartDate   *time.Time     `json:"start_date"`
	EndDate     *time.Time     `json:"end_date"`
	Image       string         `json:"image"`
	Status      string         `gorm:"default:upcoming" json:"status"` // upcoming, ongoing, completed
	Category    string         `json:"category"`
	MapURL      string         `json:"map_url"`
	IsPublic    bool           `gorm:"default:false" json:"is_public"`
	Rating      float64        `gorm:"default:0" json:"rating"`
	Likes       int            `gorm:"default:0" json:"likes"`
	Bookmarks   int            `gorm:"default:0" json:"bookmarks"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	Itineraries []Itinerary    `json:"itineraries"`
	Budgets     []Budget       `json:"budgets"`
	Notes       []Note         `json:"notes"`
}

type Itinerary struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	TripID      uint           `gorm:"index;not null" json:"trip_id"`
	Day         int            `json:"day"`
	Time        string         `json:"time"`
	Activity    string         `json:"activity"`
	Location    string         `json:"location"`
	Type        string         `json:"type"` // transit, stay, activity
	Notes       string         `json:"notes"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
}

type Budget struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	TripID      uint           `gorm:"index;not null" json:"trip_id"`
	Category    string         `json:"category"` // Transport, Accommodation, Food, Activities, Misc
	Amount      float64        `json:"amount"`
	Currency    string         `gorm:"default:USD" json:"currency"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
}

type Note struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	TripID      uint           `gorm:"index;not null" json:"trip_id"`
	Title       string         `json:"title"`
	Content     string         `json:"content"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
}
