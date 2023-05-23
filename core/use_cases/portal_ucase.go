package use_cases

import (
	"context"
	"portal/data/model/portal"
	"time"
)

type portalUcase struct {
	timeout time.Duration
	portalRepo   portal.PortalRepository
}

func NewPortalUcase(timeout time.Duration,repo portal.PortalRepository) portal.PortalUseCase{
	return &portalUcase{
		timeout: timeout,
		portalRepo: repo,
	}
}

func (u *portalUcase)GetSplashPages(ctx context.Context,id int)(res []portal.SplashPages,err error){
	ctx,cancel := context.WithTimeout(ctx,u.timeout)
	defer cancel()
	res,err = u.portalRepo.GetSplashPages(ctx,id)
	return
}
func (u *portalUcase)GetSplashPage(ctx context.Context,code string)(res portal.BasicPortal,err error){
	ctx ,cancel := context.WithTimeout(ctx ,u.timeout)
	defer cancel()
	res,err = u.portalRepo.GetSplashPage(ctx,code)
	return
}

func (u *portalUcase) UpdateSplashPage(ctx context.Context,d portal.BasicPortal)(err error){
	ctx,cancel := context.WithTimeout(ctx,u.timeout)
	defer cancel()
	err = u.portalRepo.UpdateSplashPage(ctx,d)
	return
}