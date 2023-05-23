package portal

type Title struct {
	Content string `json:"content"`
	Color string `json:"color"`
	Size string `json:"size"`
	Enabled bool `json:"enabled"`
}

type Description struct {
	Content string `json:"content"`
	Color string `json:"color"`
	Size string `json:"size"`
	Enabled bool `json:"enabled"`
}

type Content struct {
	Background string `json:"background"`
	ButtonColor string `json:"button_color"`
}

type Image struct {
	Id int `json:"id"`
	Height string `json:"height"`
	Width string `json:"width"`
	Url string `json:"url"`
	// BorderRadius string `json:"border_radius"`
	ObjectFit string `json:"object_fit"`
}

type ImageBackground struct {
	Url string `json:"url"`
}

type Logo struct {
	Id int `json:"id"`
	Height string `json:"height"`
	Width string `json:"width"`
	Url string `json:"url"`
	ObjectFit string `json:"object_fit"`
}