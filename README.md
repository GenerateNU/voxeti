# voxeti
A service-based platform for outsourcing and monetizing 3D printing

## Quick Start
Run `./scripts/build.sh`, then execute the compiled `voxeti` binary.
You can specify a port to host the server on, as well as the database to connect to with CLI flags.
> [!NOTE]
> This won't work until you have the necessary languages and tools installed on your system.

## Set Up Your Development Environment
First, understand the tech stack:
  - The backend is written in [Go](https://go.dev/) and utilizes the [Echo](https://echo.labstack.com/) web framework for API routes
  - The frontend is [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) and uses [Vite](https://vitejs.dev/) as a build tool and [TanStack Router](https://tanstack.com/router/v1) for defining UI routes
  - The database is [MongoDB](https://www.mongodb.com/), a document/NoSQL database that can be deployed locally (useful for testing!) or in the cloud with [MongoDB Atlas](https://www.mongodb.com/docs/atlas/) (a better choice for production)

Before we can compile and run our application, we need to install several languages, package managers, and various tools.
The installation process can vary, so follow the provided installation instructions for each item below
  - [Go](https://go.dev/doc/install), our primary backend language
    - Afterwards, install all Go dependecies with the command `go get .` in the root directory. This needs to be re-run if dependencies change
  - [wgo](https://github.com/bokwoon95/wgo), a live reload tool for Go (which does not support live reloading by default)
  - [golangci-lint](https://golangci-lint.run/usage/install/#local-installation), a powerful Go linter (required for development)
  - [pnpm](https://pnpm.io/installation), our frontend package manager
    - Afterwards, install all pnpm dependencies with the command `pnpm --dir frontend install` in the root directory. This needs to be re-run if dependencies change
  - [pre-commit](https://pre-commit.com/), a tool for running shared Git hooks on pre-commit (required for development)
    - Afterwards, install all Git hooks with the command `pre-commit install` in the root directory. This needs to be re-run if hooks change

If everything was successful, you can now compile and run the project!

## Running the Project
The project can be run in either development mode or production mode. The key difference is that development mode reloads on changes to source code, while production mode is compiled as a static binary.
In development mode, Vite is in charge of running the frontend on its own server and Echo redirects to it.
In production mode, Vite generates a static frontend that Echo embeds and serves in its file structure.

As a developer, you will primarily run the server in development mode while you work. To start the server in development mode, run `./scripts/dev.sh`.
To compile the binary in production mode, run `./scripts/build.sh`. This will generate an executable `voxeti` binary.
Consider investigating these scripts if you want to know how they work in greater detail.
