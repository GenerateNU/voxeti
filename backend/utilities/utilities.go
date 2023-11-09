package utilities

import (
	"voxeti/backend/schema"

	"github.com/go-mail/mail"
)

func CreateErrorResponse(code int, message string) (int, map[string]schema.ErrorResponse) {
	errorResponse := map[string]schema.ErrorResponse{
		"error": {
			Code:    code,
			Message: message,
		},
	}
	return code, errorResponse
}

func sendEmail(email *schema.Email) *schema.ErrorResponse {

	m := mail.NewMessage()
	m.SetHeader("From", "teamvoxeti@gmail.com")
	m.SetHeader("To", email.Recipient)
	// m.SetAddressHeader("Cc", "oliver.doe@example.com", "Oliver")
	m.SetHeader("Subject", "Hello!")
	m.SetBody("text/html", email.Body)
	// m.Attach("lolcat.jpg")
	d := mail.NewDialer("smtp.gmail.com", 587, "teamvoxeti@gmail.com", "ioqa qosd vyiv tbbu")
	if err := d.DialAndSend(m); err != nil {
		return &schema.ErrorResponse{Code: 500, Message: "Email failed to send"}
	}
	return nil
}

type NotificationService interface {
	SendNotification(email *schema.Email) *schema.ErrorResponse
}

/**
* Service that handles sending mails through mailchimp
 */
type EmailService struct{}

func (emailService EmailService) SendNotification(email *schema.Email) *schema.ErrorResponse {
	return sendEmail(email)
}
