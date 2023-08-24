package portal

type Title struct {
	Content string `json:"content"`
	Color   string `json:"color"`
	Size    string `json:"size"`
	Enabled bool   `json:"enabled"`
}

type Description struct {
	Content string `json:"content"`
	Color   string `json:"color"`
	Size    string `json:"size"`
	Enabled bool   `json:"enabled"`
}

type Content struct {
	Background  string `json:"background"`
	ButtonColor string `json:"button_color"`
}

type Image struct {
	Id     int    `json:"id"`
	Height string `json:"height"`
	Width  string `json:"width"`
	Url    string `json:"url"`
	// BorderRadius string `json:"border_radius"`
	ObjectFit string `json:"object_fit"`
}

type ImageBackground struct {
	Url string `json:"url"`
}

type Properties struct {
	Id              int    `json:"id"`
	Color           string `json:"color"`
	TextColor       string `json:"text_color"`
	BackgroundColor string `json:"background"`
	ImageBackground string `json:"image_background"`
}

type Logo struct {
	Id        int    `json:"id"`
	Height    string `json:"height"`
	Width     string `json:"width"`
	Url       string `json:"url"`
	ObjectFit string `json:"object_fit"`
}

type PortalBase struct {
	IdPortal   int    `json:"id_portal"`
	BucketName string `json:"bucket_name"`
	PathName   string `json:"path_name"`
	PortalName string `json:"portal_name"`
	Url        string `json:"url"`
}
type PortalSettings struct {
	Id             int        `json:"id"`
	UrlRedirect    string     `json:"url_redirect"`
	ProviderUrl    string     `json:"provider_url"`
	Provider       Provider   `json:"provider"`
	PortalType     PortalType `json:"portal_type"`
	PortalTypeName string     `json:"portal_type_name"`
}

type PortalConnectionMethod struct {
	IdPortal int `json:"id_portal"`
	Method PortalTypeConnection `json:"method"`
	Label string `json:"label"`
}

type Provider int8

const (
	CiscoMeraki Provider = 1
	Cisco       Provider = 2
	Aruba       Provider = 3
)

type PortalType int8

const (
	BasicType        PortalType = 0
	ValidateLikeType PortalType = 1
)


type PortalTypeConnection  int8

const (
	BasicForm PortalTypeConnection = 0
	FacebookValidateLike PortalTypeConnection = 1
	EmailSolicitud PortalTypeConnection = 2
)