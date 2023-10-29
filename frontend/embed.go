//go:build embed

package frontend

import (
	"embed"

	"github.com/labstack/echo/v4"
)

var (
	//go:embed dist/*
	dist embed.FS

	//go:embed src/*
	src embed.FS

	//go:embed dist/index.html
	indexHTML embed.FS
)

func init() {
	embedFrontend = true
	distDirFS = echo.MustSubFS(dist, "dist")
	srcDirFS = echo.MustSubFS(src, "src")
	distIndexHTML = echo.MustSubFS(indexHTML, "dist")
}
