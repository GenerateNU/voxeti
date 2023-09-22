package profile

type Model interface {
	Profile(string) Profile
}

func GetProfile(id int64) Profile {
	profile, err := GetProfileFromDB(id)

	if err != nil {
		panic(err)
	}

	return profile
}
