package routes

import (
	controllers "StorageService/controller"

	"github.com/gofiber/fiber/v2"
)

func Routes(app *fiber.App) {
	api := app.Group("/api")

	api.Post("/upload", controllers.UploadFile)
	api.Delete("/delete/:filename", controllers.DeleteFile)
}
