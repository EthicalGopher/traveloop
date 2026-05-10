package middleware

import (
	"github.com/dashboardtemplate/server/utils"
	"github.com/gofiber/fiber/v2"
)

func Auth(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
	}

	// Token is usually "Bearer <token>"
	tokenString := authHeader
	if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
		tokenString = authHeader[7:]
	}

	userId, role, err := utils.ValidateToken(tokenString, false)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid token"})
	}

	c.Locals("user_id", userId)
	c.Locals("role", role)

	return c.Next()
}

func AdminOnly(c *fiber.Ctx) error {
	role := c.Locals("role").(string)
	if role != "admin" {
		return c.Status(403).JSON(fiber.Map{"error": "Forbidden: Admin access only"})
	}
	return c.Next()
}
