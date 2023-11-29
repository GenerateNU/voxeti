package main

import (
	"context"
	"flag"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
	"voxeti/backend/controller"
	"voxeti/backend/database"
	"voxeti/backend/schema/job"
	"voxeti/frontend"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/pterm/pterm"
	"github.com/pterm/pterm/putils"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var (
	devMode = false // enable at build time with: "go build -tags dev".
)

// var DATABASE_NAME string = "data"

func main() {
	// parse command line flags
	backendPort := flag.Int("p", 3000, "the port to host the backend on")
	dbUri := flag.String("db", "", "the MongoDB database URI to connect to")
	flag.Parse()

	// display splash screen
	logo, _ := pterm.DefaultBigText.WithLetters(
		putils.LettersFromStringWithStyle("voxeti", pterm.FgMagenta.ToStyle())).Srender()
	pterm.DefaultCenter.Println(logo)
	generate := pterm.DefaultBox.Sprint("Prototype created by " + pterm.Cyan("Generate"))
	pterm.DefaultCenter.Println(generate)

	// notify dev mode
	if devMode {
		pterm.Info.Println("Running in dev mode")

		// load environment variables
		err := godotenv.Load(".env")
		if err != nil || os.Getenv("SESSION_KEY") == "" || os.Getenv("G_MAPS_API_KEY") == "" {
			pterm.Info.Println("Failed to load environment variables, shutting down...")
			pterm.Fatal.WithFatal(false).Println(err)
			os.Exit(1)
		}
	}

	// configure server
	e, dbDisconnect := configureServer(*dbUri)
	defer dbDisconnect()

	// start echo server
	go func() {
		if err := e.Start(fmt.Sprintf(":%d", *backendPort)); err != nil && err != http.ErrServerClosed {
			pterm.Fatal.WithFatal(false).Println(err)
			os.Exit(1)
		}
	}()

	// graceful shutdown on server closed
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	pterm.Println()
	pterm.Info.Println("Shutting down...")
	if err := e.Shutdown(ctx); err != nil {
		pterm.Fatal.WithFatal(false).Println(err)
		os.Exit(1)
	}

	// display active servers
	pterm.Info.Printfln("Backend server: http://localhost:%d/api/ ...", *backendPort)
	pterm.Info.Printfln("Frontend server: http://localhost:%d/ ...", *backendPort)
}

func configureServer(dbUri string) (e *echo.Echo, dbDisconnect func()) {
	// configure logger
	spinnerSuccess, _ := pterm.DefaultSpinner.Start("Configuring logger...")
	logLevel := pterm.LogLevelInfo
	if devMode {
		logLevel = pterm.LogLevelTrace
	} // increase log level to support easier debugging
	logger := pterm.DefaultLogger.WithLevel(logLevel)
	spinnerSuccess.Success("Configured logger with log level ", logLevel)

	// configure echo
	spinnerSuccess, _ = pterm.DefaultSpinner.Start("Configuring echo...")
	e = echo.New()
	e.HideBanner = true
	spinnerSuccess.Success("Configured echo")

	// connect to database
	spinnerSuccess, _ = pterm.DefaultSpinner.Start("Connecting to database...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	dbClient, err := mongo.Connect(ctx, options.Client().ApplyURI(dbUri))
	if err != nil || dbClient.Ping(ctx, readpref.Primary()) != nil {
		spinnerSuccess.Fail("Failed to connect to database")
		os.Exit(1)
	}
	dbDisconnect = func() {
		if err = dbClient.Disconnect(ctx); err != nil {
			panic(err)
		}
	}
	spinnerSuccess.Success("Connected to database")

	// create needed collections
	spinnerSuccess, _ = pterm.DefaultSpinner.Start("Creating MongoDB collections...")
	database.Setup(dbClient, logger)
	spinnerSuccess.Success("Created MongoDB collections")

	// register frontend handlers
	spinnerSuccess, _ = pterm.DefaultSpinner.Start("Registering frontend handlers...")
	frontend.RegisterFrontendHandlers(e)
	spinnerSuccess.Success("Registered frontend handlers")

	// register backend handlers
	spinnerSuccess, _ = pterm.DefaultSpinner.Start("Registering backend handlers...")
	controller.RegisterHandlers(e, dbClient, logger)
	spinnerSuccess.Success("Registered backend handlers")

	go job.TransferPotentialToDeclined(dbClient, logger)
	go job.DeleteMaxDeclinedJobs(dbClient, logger)

	return
}
