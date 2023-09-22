package frontend

import (
	"embed"
	"log"
	"net/url"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var (
	//go:embed dist/*
	dist embed.FS

	//go:embed dist/index.html
	indexHTML embed.FS

	distDirFS     = echo.MustSubFS(dist, "dist")
	distIndexHTML = echo.MustSubFS(indexHTML, "dist")
)

func RegisterFrontendHandlers(e *echo.Echo, devMode bool) {
	if devMode {
		setupDevProxy(e)
		return
	}

	e.FileFS("/", "index.html", distIndexHTML)
	e.StaticFS("/profile", distDirFS)
	e.StaticFS("/", distDirFS)
}

func setupDevProxy(e *echo.Echo) {
	url, err := url.Parse("http://localhost:4000")
	if err != nil {
		log.Fatal(err)
	}

	balancer := middleware.NewRoundRobinBalancer([]*middleware.ProxyTarget{
		{
			URL: url,
		},
	})
	e.Use(middleware.ProxyWithConfig(middleware.ProxyConfig{
		Balancer: balancer,
		Skipper: func(c echo.Context) bool {
			return len(c.Path()) >= 4 && c.Path()[:4] == "/api"
		},
	}))
}
