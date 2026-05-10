package models

import (
	"errors"
	"regexp"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	ID                   uint           `gorm:"primaryKey" json:"id"`
	Email                string         `gorm:"uniqueIndex;not null" json:"email"`
	Password             string         `gorm:"not null" json:"-"`
	FullName             string         `json:"full_name"`
	Role                 string         `gorm:"default:public" json:"role"`
	Status               string         `gorm:"default:active" json:"status"` // pending, active, rejected
	Avatar               string         `json:"avatar"`
	IsEmailVerified      bool           `gorm:"default:false" json:"is_email_verified"`
	VerificationToken    string         `json:"-"`
	ResetPasswordToken   string         `json:"-"`
	ResetPasswordExpires *time.Time     `json:"-"`
	
	// Fields for updating email from settings
	PendingEmail         string         `json:"pending_email"`
	EmailChangeToken     string         `json:"-"`

	CreatedAt            time.Time      `json:"created_at"`
	UpdatedAt            time.Time      `json:"updated_at"`
	DeletedAt            gorm.DeletedAt `gorm:"index" json:"-"`
}

type AuthResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	User         User   `json:"user"`
}

// GORM Hooks

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	if !isValidEmail(u.Email) {
		return errors.New("invalid email format")
	}

	if len(u.Password) < 6 {
		return errors.New("password must be at least 6 characters")
	}

	hashedPassword, err := hashPassword(u.Password)
	if err != nil {
		return err
	}
	u.Password = hashedPassword

	return nil
}

func (u *User) BeforeUpdate(tx *gorm.DB) (err error) {
	if len(u.Password) > 0 && !isHashed(u.Password) {
		if len(u.Password) < 6 {
			return errors.New("password must be at least 6 characters")
		}
		hashedPassword, err := hashPassword(u.Password)
		if err != nil {
			return err
		}
		u.Password = hashedPassword
	}
	return nil
}

// Helpers

func isValidEmail(email string) bool {
	res, _ := regexp.MatchString(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`, email)
	return res
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func isHashed(password string) bool {
	return len(password) >= 60 && password[0] == '$'
}
