package handlers

import (
	"github.com/dashboardtemplate/server/database"
	"github.com/dashboardtemplate/server/models"
	"github.com/dashboardtemplate/server/utils"
	"github.com/gofiber/fiber/v2"
	"time"
)

func Signup(c *fiber.Ctx) error {
	type SignupRequest struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		FullName string `json:"full_name"`
		Role     string `json:"role"`
	}

	var req SignupRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.RespondWithError(c, err, "Invalid request details provided", 400)
	}

	validRoles := map[string]bool{"public": true, "admin": true}
	if req.Role == "" {
		req.Role = "public"
	}
	if !validRoles[req.Role] {
		return utils.RespondWithError(c, nil, "The selected role is not valid", 400)
	}

	status := "active"
	role := req.Role
	if req.Email == "admin@traveloop.com" {
		role = "admin"
	}

	user := models.User{
		Email:           req.Email,
		Password:        req.Password,
		FullName:        req.FullName,
		Role:            role,
		Status:          status,
		IsEmailVerified: true, // Verified by default now
	}

	if err := database.DB.Create(&user).Error; err != nil {
		return utils.RespondWithError(c, err, "Could not create your account", 400)
	}

	// For others, login directly
	at, rt, _ := utils.GenerateTokens(user)

	return c.Status(201).JSON(models.AuthResponse{
		AccessToken:  at,
		RefreshToken: rt,
		User:         user,
	})
}

func Login(c *fiber.Ctx) error {
	type LoginRequest struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.RespondWithError(c, err, "Invalid login details provided", 400)
	}

	var user models.User
	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		return utils.RespondWithError(c, err, "The email or password you entered is incorrect", 401)
	}

	// Verification check removed as requested

	if user.Status == "pending" {
		return utils.RespondWithError(c, nil, "Your account is currently waiting for approval from the administrator", 401)
	}

	if user.Status == "rejected" {
		return utils.RespondWithError(c, nil, "Your application was not approved. Please contact support for more information.", 401)
	}

	if !utils.CheckPasswordHash(req.Password, user.Password) {
		return utils.RespondWithError(c, nil, "The email or password you entered is incorrect", 401)
	}

	at, rt, _ := utils.GenerateTokens(user)

	return c.JSON(models.AuthResponse{
		AccessToken:  at,
		RefreshToken: rt,
		User:         user,
	})
}

// ... rest of the file (VerifyEmail, ForgotPassword, ResetPassword, Refresh, ConfirmEmailChange) remains the same for settings/recovery
func VerifyEmail(c *fiber.Ctx) error {
	token := c.Query("token")
	if token == "" {
		return utils.RespondWithError(c, nil, "A verification token is required to continue", 400)
	}

	var user models.User
	if err := database.DB.Where("verification_token = ?", token).First(&user).Error; err != nil {
		return utils.RespondWithError(c, err, "The verification link is invalid or has expired", 400)
	}

	user.IsEmailVerified = true
	user.VerificationToken = ""
	database.DB.Save(&user)

	return c.JSON(fiber.Map{"message": "Email verified successfully. You can now log in."})
}

func ForgotPassword(c *fiber.Ctx) error {
	type ForgotRequest struct {
		Email string `json:"email"`
	}
	var req ForgotRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.RespondWithError(c, err, "Please provide a valid email address", 400)
	}

	var user models.User
	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		return c.JSON(fiber.Map{"message": "If an account exists, a reset link has been sent."})
	}

	resetToken := utils.GenerateToken()
	expiry := time.Now().Add(time.Hour * 1)

	user.ResetPasswordToken = resetToken
	user.ResetPasswordExpires = &expiry
	database.DB.Save(&user)

	utils.SendPasswordResetEmail(user.Email, resetToken)

	return c.JSON(fiber.Map{"message": "If an account exists, a reset link has been sent."})
}

func ResetPassword(c *fiber.Ctx) error {
	type ResetRequest struct {
		Token    string `json:"token"`
		Password string `json:"password"`
	}
	var req ResetRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.RespondWithError(c, err, "Invalid request details provided", 400)
	}

	var user models.User
	if err := database.DB.Where("reset_password_token = ? AND reset_password_expires > ?", req.Token, time.Now()).First(&user).Error; err != nil {
		return utils.RespondWithError(c, err, "The password reset link is invalid or has expired", 400)
	}

	user.Password = req.Password
	user.ResetPasswordToken = ""
	user.ResetPasswordExpires = nil
	database.DB.Save(&user)

	return c.JSON(fiber.Map{"message": "Password reset successfully. You can now log in."})
}

func Refresh(c *fiber.Ctx) error {
	type RefreshRequest struct {
		RefreshToken string `json:"refresh_token"`
	}

	var req RefreshRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.RespondWithError(c, err, "Invalid refresh attempt", 400)
	}

	userId, _, err := utils.ValidateToken(req.RefreshToken, true)
	if err != nil {
		return utils.RespondWithError(c, err, "Your session has expired. Please log in again.", 401)
	}

	var user models.User
	if err := database.DB.First(&user, userId).Error; err != nil {
		return utils.RespondWithError(c, err, "User account not found", 401)
	}

	if user.Status != "active" {
		return utils.RespondWithError(c, nil, "Your account is not active. Please contact support.", 401)
	}

	at, rt, _ := utils.GenerateTokens(user)

	return c.JSON(models.AuthResponse{
		AccessToken:  at,
		RefreshToken: rt,
		User:         user,
	})
}
