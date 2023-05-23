package mysql

import (
	"context"
	"database/sql"
	"log"
	portal "portal/data/model/portal"
)

type portalRepo struct {
	Conn *sql.DB
}

func NewPortalRepo (conn *sql.DB) portal.PortalRepository {
	return &portalRepo{
		Conn: conn,
	}
}
func (m *portalRepo) UpdateSplashPage(ctx context.Context,d portal.BasicPortal)(err error){
	var query string
	query = `update portal_img set height = ?,width = ?,url = ?,object_fit = ? where id = ?`
	_,err = m.Conn.ExecContext(ctx,query,d.Logo.Height,d.Logo.Width,d.Logo.Url,d.Logo.ObjectFit,d.Logo.Id)
	if err != nil {
		log.Println(err)
	}
	query = `update portal_img set height = ?,width = ?,url = ?,object_fit = ? where id = ?`
	_,err = m.Conn.ExecContext(ctx,query,d.Logo.Height,d.Logo.Width,d.Logo.Url,d.Logo.ObjectFit,d.Logo.Id)
	if err != nil {
		log.Println(err)
	}
	return
}

func(m *portalRepo) GetSplashPage(ctx context.Context,code string)(res portal.BasicPortal,err error){
	query := `select p.id,p.name,p.urlSplash,p.urlPath,bucket_name,
	logo.id,logo.height,logo.width,logo.url,logo.object_fit,
	portada.id,portada.height,portada.width,portada.url,portada.object_fit
	from splashpage as p
	inner join portal_img as logo on logo.id = p.id_img_logo
	inner join portal_img as portada on portada.id = p.id_img_portada
	where p.code = ?
	`
	err = m.Conn.QueryRowContext(ctx,query,code).Scan(
		&res.IdPortal,&res.PortalName,&res.Url,&res.PathName,&res.BucketName,
		&res.Logo.Id,&res.Logo.Height,&res.Logo.Width,&res.Logo.Url,&res.Logo.ObjectFit,
		&res.Image.Id,&res.Image.Height,&res.Image.Width,&res.Image.Url,&res.Image.ObjectFit,
	)
	if err != nil{
		log.Println(err)
	}
	return
}

func(m *portalRepo) GetSplashPages(ctx context.Context,id int)(res []portal.SplashPages,err error){
	query := `select id,name,code,updated_at,created_at,urlSplash from splashpage`
	res,err = m.fetch(ctx,query)
	if err != nil{
		log.Println(err)
	}
	return
}


func (m *portalRepo) fetch(ctx context.Context, query string, args ...interface{}) (result []portal.SplashPages, err error) {
	rows, err := m.Conn.QueryContext(ctx, query, args...)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	defer func() {
		errRow := rows.Close()
		if errRow != nil {
			log.Println(err)
		}
	}()

	result = make([]portal.SplashPages, 0)
	for rows.Next() {
		t := portal.SplashPages{}
		err = rows.Scan(
			&t.Id,
			&t.Name,
			&t.Code,
			&t.UpdatedAt,
			&t.CreatedAt,
			&t.UrlSplash,
		)
		if err != nil {
			log.Println(err)
			return nil, err
		}
		result = append(result, t)
	}

	return result, nil
}