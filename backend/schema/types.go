package schema

type ErrorResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	CSRFToken string `json:"csrfToken"`
	User      User   `json:"user"`
}
