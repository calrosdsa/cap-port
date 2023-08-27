package portal

import (
	"context"
	"html/template"
	"time"
)

type BasicPortal struct {
	Base     PortalBase     `json:"portal"`
	Settings PortalSettings `json:"settings"`
	// Title           Title           `json:"title"`
	// Description     Description     `json:"description"`
	Portada Portada `json:"portada"`
	// Content         Content         `json:"content"`
	Logo              Logo                     `json:"logo"`
	StyleCss          template.CSS             `json:"style,omitempty"`
	JsCode            template.JS              `json:"js_code,omitempty"`
	Properties        Properties               `json:"properties"`
	ConnectionMethods []PortalConnectionMethod `json:"connection_methods"`
}

type SplashPages struct {
	Id        int       `json:"id"`
	Code      string    `json:"code"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	UrlSplash string    `json:"url_splash"`
}

type PortalRepository interface {
	GetSplashPages(ctx context.Context, id int) (res []SplashPages, err error)
	GetSplashPage(ctx context.Context, code string) (res BasicPortal, err error)
	UpdateSplashPage(ctx context.Context, d BasicPortal) (err error)
	UpdateSplashPageSettings(ctx context.Context, d PortalSettings) (err error)
	CreatePortal(ctx context.Context, d PortalRequest) (err error)
	GetConnectionMethods(ctx context.Context, portalType PortalType) ([]PortalConnectionMethod, error)
	UpdateConnectionMethod(ctx context.Context, d []PortalConnectionMethod, portalId int) (err error)
}

type PortalUseCase interface {
	GetSplashPages(ctx context.Context, id int) (res []SplashPages, err error)
	GetSplashPage(ctx context.Context, code string) (res BasicPortal, err error)
	UpdateSplashPage(ctx context.Context, d BasicPortal) (err error)
	UpdateSplashPageSettings(ctx context.Context, d BasicPortal) (err error)
	CreatePortal(ctx context.Context, d PortalRequest) (err error)

	BasicPortal(ctx context.Context, d BasicPortal) (res []byte, err error)
	GetConnectionMethods(ctx context.Context, portalType PortalType) ([]PortalConnectionMethod, error)
	UpdateConnectionMethod(ctx context.Context, d []PortalConnectionMethod, portalId int) (err error)
}

type PortalRequest struct {
	Code        string     `json:"code"`
	Name        string     `json:"name"`
	IdClient    int        `json:"id_client"`
	UrlPath     string     `json:"url_path"`
	UrlSplash   string     `json:"url_splash,omitempty"`
	BucketName  string     `json:"bucket_name,omitempty"`
	Provider    Provider   `json:"provider"`
	UrlRedirect string     `json:"url_redirect"`
	PortalType  PortalType `json:"portal_type"`
}
