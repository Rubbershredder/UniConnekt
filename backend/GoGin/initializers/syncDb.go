package initializers

import "uniconnekt.com/m/v2/models"

func SyncDb() {
	DB.AutoMigrate(&models.User{})
}
