package portal

import (
	"context"
	"html/template"
	"time"
)

type BasicPortal struct {
	IdPortal        int             `json:"id_portal"`
	BucketName      string          `json:"bucket_name"`
	PathName        string          `json:"path_name"`
	PortalName      string          `json:"portal_name"`
	Url             string          `json:"url"`
	Title           Title           `json:"title"`
	Description     Description     `json:"description"`
	Image           Image           `json:"image"`
	ImageBackground ImageBackground `json:"image_background"`
	Content         Content         `json:"content"`
	Logo            Logo            `json:"logo"`
	Style           template.CSS    `json:"style"`
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
	UpdateSplashPage(ctx context.Context,d BasicPortal) (err error)
}

type PortalUseCase interface {
	GetSplashPages(ctx context.Context, id int) (res []SplashPages, err error)
	GetSplashPage(ctx context.Context, code string) (res BasicPortal, err error)
	UpdateSplashPage(ctx context.Context,d BasicPortal) (err error)
}
