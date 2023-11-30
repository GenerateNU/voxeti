package controller

import (
	"net/http"
	"os"
	"voxeti/backend/schema/auth"
	"voxeti/backend/schema/slicer"
	"voxeti/backend/schema/user"
	"voxeti/backend/utilities"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/pterm/pterm"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

	// Used to wrap all endpoints in authentication middleware:
	authMiddleware := func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			nonAuthRoutes := map[string]string{
				"/api/users":                "POST",
				"/api/auth/login":           "POST",
				"/api/auth/google-provider": "POST",
				"/api/payment/create-checkout-session": "POST",
			}

			// Check if the current request is an auth route:
			nonAuthMethod, ok := nonAuthRoutes[c.Path()]
			if !ok || nonAuthMethod != c.Request().Method {
				// Authenticate session if it is an auth route:
				userId, errResponse := auth.AuthenticateSession(c, store)
				if errResponse != nil {
					auth.InvalidateUserSession(c, store)
					return c.JSON(utilities.CreateErrorResponse(errResponse.Code, errResponse.Message))
				}

				userIdObj, _ := primitive.ObjectIDFromHex(*userId)

				// Check if the user associated with the session exists:
				_, err := user.GetUserById(&userIdObj, dbClient)
				if err != nil {
					auth.InvalidateUserSession(c, store)
					return c.JSON(utilities.CreateErrorResponse(401, "Unauthorized Request, user does not exist!"))
				}

				// Add the requesting user to context:
				c.Set("user", userId)
			}

			err := next(c)
			return err
		}
	}

	// Initialize backend middleware:
	api.Use(session.Middleware(store))
	api.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowCredentials: true,
		AllowOrigins:     []string{"http://localhost:4000"},
		AllowMethods:     []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete, http.MethodOptions},
		AllowHeaders:     []string{"Content-Type", "Csrftoken"},
	}))
	api.Use(authMiddleware)

	// Load price estimation config:
	configuration := slicer.LoadEstimateConfig("../voxeti", "estimate_config")

	// Register extra route handlers
	RegisterAuthHandlers(api, store, dbClient, logger)
	RegisterDesignHandlers(api, dbClient, logger)
	RegisterUserHandlers(api, dbClient, logger)
	RegisterJobHandlers(api, dbClient, logger)
	RegisterPaymentHandlers(api, dbClient, logger)
	RegisterSlicerHandlers(api, configuration, logger)

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
