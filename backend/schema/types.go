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

type ProviderUser struct {
	Email    string `json:"user"`
	UserType string `json:"userType"`
	Provider string `json:"provider"`
}

type GoogleAccessToken struct {
	AccessToken string `json:"accessToken"`
}

type GoogleResponse struct {
	Email string `json:"email"`
	Scope string `json:"scope"`
}
