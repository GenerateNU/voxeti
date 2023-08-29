package main

import (
  "context"
  "fmt"
  "flag"
	"github.com/labstack/echo/v4"
  "github.com/pterm/pterm"
  "github.com/pterm/pterm/putils"
  "net/http"
  "os"
  "os/signal"
  "syscall"
  "time"
  "voxeti/backend"
  //"voxeti/backend/database"
  "voxeti/frontend"
)

var (
  devMode = false // enable at build time with: "go build -tags dev". Running the dev script will set this automatically
  logLevel = pterm.LogLevelInfo
  frontendDevPort = "4000" // vite server uses this port in dev mode, allowing for Hot Module Replacement
  backendPort string // echo server uses this port, configurable with CLI flag
  dbUri string // the mongodb database uri
)

func main() {
  // parse command line flags
  flag.StringVar(&backendPort, "port", "3000", "the port the server should listen to")
  flag.StringVar(&dbUri, "db", "", "the MongoDB database URI to connect to")
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
  }

  // configure server
  e := configureServer()
  // TODO: defer database.Disconnect()
  
  // ensure no port conflicts between frontend and backend
  if devMode && backendPort == frontendDevPort {
    backendPort = "3000"
    pterm.Warning.Println(fmt.Sprintf("port %s reserved for frontend dev server, using %s instead", frontendDevPort, backendPort))
  }

  // start echo server
  go func() {
    if err := e.Start(fmt.Sprintf(":%s", backendPort)); err != nil && err != http.ErrServerClosed {
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
}

func configureServer() (e *echo.Echo) {
  // display startup progress
  pterm.Info.Println("Starting Voxeti server...")
  pb, _ := pterm.DefaultProgressbar.WithTotal(5).WithRemoveWhenDone(true).Start()
  
  // configure logger
  pb.UpdateTitle("Configuring logger")
  if devMode {logLevel = pterm.LogLevelTrace} // increase log level to support easier debugging
  logger := pterm.DefaultLogger.WithLevel(logLevel)
  pterm.Success.Println("Configured logger with log level", logLevel)
  pb.Increment()

  // configure echo
  pb.UpdateTitle("Configuring echo")
  e = echo.New()
  e.HideBanner = true
  pterm.Success.Println("Configured echo")
  pb.Increment()

  // connect to database
  pb.UpdateTitle("Connecting to database")

  /* TODO
  if err := database.Connect(dbUri); err != nil {
    pterm.Fatal.WithFatal(false).Println("Failed to connect to database")
    pb.Stop()
    os.Exit(1)
  }
  */
  pterm.Success.Println("Connected to database")
  pb.Increment()

  // register frontend handlers
  pb.UpdateTitle("Registering frontend handlers")
  frontend.RegisterHandlers(e, devMode)
  pterm.Success.Println("Registered frontend handlers")
  pb.Increment()

  // register backend handlers
  pb.UpdateTitle("Registering backend handlers")
  backend.RegisterHandlers(e, logger)
  pterm.Success.Println("Registered backend handlers")
  pb.Increment()
  
  pb.Stop()
  return
}
