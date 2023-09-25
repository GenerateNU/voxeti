package controller

import (
	"net/http"
	"strconv"
	"voxeti/backend/src/model/profile"

	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
)

func RegisterProfileHandlers(e *echo.Group, logger *pterm.Logger) {
	api := e.Group("/profile")

	api.GET("/:id", func(c echo.Context) error {
		logger.Info("get profile endpoint hit!")
		id, err := strconv.ParseInt(c.Param("id"), 10, 64)
		if err != nil {
			return c.String(http.StatusBadRequest, "Invalid ID")
		}
		return c.JSON(http.StatusOK, profile.GetProfile(id))
	})

	// api.PUT("/profile", func(c echo.Context) error {
	// 	// TODO
	// })
}
