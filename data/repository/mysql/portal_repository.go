package mysql

import (
	"context"
	"database/sql"
	"log"
	r "portal/data/model/portal"
)

type portalRepo struct {
	Conn *sql.DB
}

func NewPortalRepo (conn *sql.DB) r.PortalRepository {
	return &portalRepo{
		Conn: conn,
	}
}

func (m *portalRepo)CreatePortal(ctx context.Context,d r.PortalRequest)(err error){
	var query string
	conn,err := m.Conn.BeginTx(ctx,&sql.TxOptions{})
	if err != nil {
		return
	}
	defer func() {
		if err != nil {
			conn.Rollback()
		} else {
			conn.Commit()
		}
	}()
	query= `insert into splashpage (name,code,urlPath,urlSplash,idClient,bucket_name) values(?,?,?,?,?,?) `
	res,err := conn.ExecContext(ctx,query,d.Name,d.Code,d.UrlPath,d.UrlSplash,d.IdClient,d.BucketName)
	if err != nil{
		return
	}
	lastID, err := res.LastInsertId()
	if err != nil {
		return
	}
	query = `insert into portal_img(id_portal) values(?)`
	_,err = conn.ExecContext(ctx,query,lastID)
	if err != nil {
		return
	}
	query = `insert into portal_logo(id_portal) values(?)`
	_,err = conn.ExecContext(ctx,query,lastID)
	if err != nil {
		return
	}
	query = `insert into portal_properties(id_portal) values(?)`
	_,err = conn.ExecContext(ctx,query,lastID)
	if err != nil {
		return
	}
	query = `insert into portal_settings(id_portal,url_redirect,provider)values(?,?,?)`
	_,err = conn.ExecContext(ctx,query,lastID,d.UrlRedirect,d.Provider)
	if err != nil {
		return
	}
	return
}


func (m *portalRepo) UpdateSplashPage(ctx context.Context,d r.BasicPortal)(err error){
	var query string
	query = `update portal_logo set height = ?,width = ?,url = ?,object_fit = ? where id = ?`
	_,err = m.Conn.ExecContext(ctx,query,d.Logo.Height,d.Logo.Width,d.Logo.Url,d.Logo.ObjectFit,d.Logo.Id)
	if err != nil {
		log.Println(err)
	}
	query = `update portal_img set height = ?,width = ?,url = ?,object_fit = ? where id = ?`
	_,err = m.Conn.ExecContext(ctx,query,d.Image.Height,d.Image.Width,d.Image.Url,d.Image.ObjectFit,d.Image.Id)
	if err != nil {
		log.Println(err)
	}
	query = `update portal_properties set color = ?,background = ?,image_background = ? where id = ?`
	_,err = m.Conn.ExecContext(ctx,query,d.Properties.Color,d.Properties.BackgroundColor,d.Properties.ImageBackground,d.Properties.Id)
	if err != err {
		log.Println(err)
	}
	return
}

func (m *portalRepo)UpdateSplashPageSettings(ctx context.Context,d r.PortalSettings)(err error){
	query := `update portal_settings set url_redirect = ?,provider = ? where id = ?`
	_,err = m.Conn.ExecContext(ctx,query,d.UrlRedirect,d.Provider,d.Id)
	return
}

func(m *portalRepo) GetSplashPage(ctx context.Context,code string)(res r.BasicPortal,err error){
	query := `select p.id,p.name,p.urlSplash,p.urlPath,bucket_name,
	logo.id,logo.height,logo.width,logo.url,logo.object_fit,
	portada.id,portada.height,portada.width,portada.url,portada.object_fit,
	properties.id,properties.color,properties.background,properties.image_background,
	setting.id,setting.provider,setting.url_redirect
	from splashpage as p
	inner join portal_logo as logo on logo.id_portal = p.id
	inner join portal_img as portada on portada.id_portal = p.id
	inner join portal_properties as properties on properties.id_portal = p.id
	inner join portal_settings as setting on setting.id_portal = p.id
	where p.code = ?
	`
	err = m.Conn.QueryRowContext(ctx,query,code).Scan(
		&res.Base.IdPortal,&res.Base.PortalName,&res.Base.Url,&res.Base.PathName,&res.Base.BucketName,
		&res.Logo.Id,&res.Logo.Height,&res.Logo.Width,&res.Logo.Url,&res.Logo.ObjectFit,
		&res.Image.Id,&res.Image.Height,&res.Image.Width,&res.Image.Url,&res.Image.ObjectFit,
		&res.Properties.Id,&res.Properties.Color,&res.Properties.BackgroundColor,&res.Properties.ImageBackground,
		&res.Settings.Id,&res.Settings.Provider,&res.Settings.UrlRedirect,
	)
	if err != nil{
		log.Println(err)
	}
	return
}

func(m *portalRepo) GetSplashPages(ctx context.Context,id int)(res []r.SplashPages,err error){
	query := `select id,name,code,updated_at,created_at,urlSplash from splashpage`
	res,err = m.fetch(ctx,query)
	if err != nil{
		log.Println(err)
	}
	return
}


func (m *portalRepo) fetch(ctx context.Context, query string, args ...interface{}) (result []r.SplashPages, err error) {
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

	result = make([]r.SplashPages, 0)
	for rows.Next() {
		t := r.SplashPages{}
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