package controller

import (
	"net/http"
	"os"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/pterm/pterm"
	"go.mongodb.org/mongo-driver/mongo"
)

func RegisterHandlers(e *echo.Echo, dbClient *mongo.Client, logger *pterm.Logger) {
	api := e.Group("/api")

	// Initialize session store:
	var store = sessions.NewCookieStore([]byte(os.Getenv("SESSION_KEY")))
	store.Options = &sessions.Options{
		MaxAge:   int(60 * 60 * 24),
		Path:     "/",
		HttpOnly: true,
	}

	// Initialize backend middleware:
	api.Use(session.Middleware(store))
	api.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowCredentials: true,
		AllowOrigins:     []string{"http://localhost:4000"},
		AllowMethods:     []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete, http.MethodOptions},
		AllowHeaders:     []string{"Content-Type"},
	}))

	// Register extra route handlers
	RegisterAuthHandlers(api, store, dbClient, logger)
	RegisterDesignHandlers(api, dbClient, logger)
	RegisterUserHandlers(api, dbClient, logger)
	RegisterJobHandlers(api, dbClient, logger)
	RegisterPaymentHandlers(api, dbClient, logger)

	// catch any invalid endpoints with a 404 error
	api.GET("*", func(c echo.Context) error {
		return c.String(http.StatusNotFound, "Not Found")
	})

	// useful endpoint for ensuring server is running
	api.GET("/healthcheck", func(c echo.Context) error {
		logger.Info("healthcheck endpoint hit!")
		return c.NoContent(http.StatusOK)
	})

	// EXAMPLE ENDPOINT
	api.GET("/helloworld", func(c echo.Context) error {
		logger.Info("helloworld endpoint hit!")
		return c.String(http.StatusOK, "Hello, World!")
	})
}
