package mysql

import (
	"context"
	"database/sql"
	"log"
	r "portal/data/model/portal"
	"portal/util"
)

type portalRepo struct {
	Conn *sql.DB
}

func NewPortalRepo(conn *sql.DB) r.PortalRepository {
	return &portalRepo{
		Conn: conn,
	}
}

func (m *portalRepo) CreatePortal(ctx context.Context, d r.PortalRequest) (err error) {
	var query string
	conn, err := m.Conn.BeginTx(ctx, &sql.TxOptions{})
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
	query = `insert into splashpage (name,code,urlPath,urlSplash,idClient,bucket_name) values(?,?,?,?,?,?) `
	res, err := conn.ExecContext(ctx, query, d.Name, d.Code, d.UrlPath, d.UrlSplash, d.IdClient, d.BucketName)
	if err != nil {
		return
	}
	lastID, err := res.LastInsertId()
	if err != nil {
		return
	}
	query = `insert into portal_img(id_portal) values(?)`
	_, err = conn.ExecContext(ctx, query, lastID)
	if err != nil {
		return
	}
	query = `insert into portal_logo(id_portal) values(?)`
	_, err = conn.ExecContext(ctx, query, lastID)
	if err != nil {
		return
	}
	query = `insert into portal_properties(id_portal) values(?)`
	_, err = conn.ExecContext(ctx, query, lastID)
	if err != nil {
		return
	}
	query = `insert into portal_settings(id_portal,url_redirect,provider,portal_type)values(?,?,?,?)`
	_, err = conn.ExecContext(ctx, query, lastID, d.UrlRedirect, d.Provider, d.PortalType)
	if err != nil {
		return
	}
	return
}

func (m *portalRepo) UpdateSplashPage(ctx context.Context, d r.BasicPortal) (err error) {
	var query string
	query = `update portal_logo set height = ?,width = ?,url = ?,object_fit = ? where id = ?`
	_, err = m.Conn.ExecContext(ctx, query, d.Logo.Height, d.Logo.Width, d.Logo.Url, d.Logo.ObjectFit, d.Logo.Id)
	if err != nil {
		log.Println(err)
	}
	query = `update portal_img set height = ?,width = ?,url = ?,object_fit = ?,video_url = ? where id = ?`
	_, err = m.Conn.ExecContext(ctx, query, d.Portada.Height, d.Portada.Width, d.Portada.Url,d.Portada.ObjectFit,
		 d.Portada.VideoUrl, d.Portada.Id)
	if err != nil {
		log.Println(err)
	}
	query = `update portal_properties set color = ?,background = ?,image_background = ?,text_color = ?,
	show_video = ? where id = ?`
	_, err = m.Conn.ExecContext(ctx, query, d.Properties.Color, d.Properties.BackgroundColor, d.Properties.ImageBackground,
		d.Properties.TextColor,d.Properties.ShowVideo, d.Properties.Id)
	if err != err {
		log.Println(err)
	}
	return
}

func (m *portalRepo) UpdateSplashPageSettings(ctx context.Context, d r.PortalSettings) (err error) {
	query := `update portal_settings set url_redirect = ?,provider = ?,policy_url = ? where id = ?`
	_, err = m.Conn.ExecContext(ctx, query, d.UrlRedirect, d.Provider,d.PolicyUrl, d.Id)
	return
}
func (m *portalRepo) UpdateConnectionMethod(ctx context.Context, d []r.PortalConnectionMethod, portalId int) (err error) {
	var query string
	conn, err := m.Conn.BeginTx(ctx, &sql.TxOptions{})
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
	query = `update portal_type_connection set enabled = ? where id_portal = ? and type_connection = ?`
	stmt, err := conn.PrepareContext(ctx, query)
	if err != nil {
		return
	}
	for _, method := range d {
		_, err = stmt.ExecContext(ctx, method.Enabled, portalId, method.Method)
		if err != nil {
			log.Println(err)
			return
		}
	}

	query = `insert into portal_type_connection (type_connection,id_portal) values(?,?)`
	stmt, err = conn.PrepareContext(ctx, query)
	if err != nil {
		return
	}
	for _, method := range d {
		if method.IdPortal == 0 {
			_, err = stmt.ExecContext(ctx, method.Method, portalId)
			if err != nil {
				return
			}
		}
	}
	return
}

func (m *portalRepo) GetSplashPage(ctx context.Context, code string) (res r.BasicPortal, err error) {
	query := `select p.id,p.name,p.urlSplash,p.urlPath,bucket_name,
	logo.id,logo.height,logo.width,logo.url,logo.object_fit,
	portada.id,portada.height,portada.width,portada.url,portada.object_fit,portada.video_url,
	properties.id,properties.color,properties.background,properties.image_background,properties.text_color,
	properties.show_video,
	setting.id,setting.provider,setting.url_redirect,setting.portal_type,setting.policy_url
	from splashpage as p
	inner join portal_logo as logo on logo.id_portal = p.id
	inner join portal_img as portada on portada.id_portal = p.id
	inner join portal_properties as properties on properties.id_portal = p.id
	inner join portal_settings as setting on setting.id_portal = p.id
	where p.code = ?
	`
	err = m.Conn.QueryRowContext(ctx, query, code).Scan(
		&res.Base.IdPortal, &res.Base.PortalName, &res.Base.Url, &res.Base.PathName, &res.Base.BucketName,
		&res.Logo.Id, &res.Logo.Height, &res.Logo.Width, &res.Logo.Url, &res.Logo.ObjectFit,
		&res.Portada.Id, &res.Portada.Height, &res.Portada.Width, &res.Portada.Url, &res.Portada.ObjectFit,&res.Portada.VideoUrl,
		&res.Properties.Id, &res.Properties.Color, &res.Properties.BackgroundColor, &res.Properties.ImageBackground,
		&res.Properties.TextColor,&res.Properties.ShowVideo,
		&res.Settings.Id, &res.Settings.Provider, &res.Settings.UrlRedirect, &res.Settings.PortalType,
		&res.Settings.PolicyUrl,
	)
	if err != nil {
		log.Println(err)
	}
	res.ConnectionMethods, err = m.getPortalConnectionMethod(ctx, res.Base.IdPortal)
	return
}

func (m *portalRepo) getPortalConnectionMethod(ctx context.Context, idPortal int) (
	res []r.PortalConnectionMethod, err error) {
	query := `select id_portal,type_connection,enabled from portal_type_connection where id_portal = ?`
	res, err = m.fetchTypeConnection(ctx, query, idPortal)
	return
}
func (m *portalRepo) GetConnectionMethods(ctx context.Context, portalType r.PortalType) (
	res []r.PortalConnectionMethod, err error) {
	query := `select (0),type_connection,(false) from connection_method where portal_type = ?`
	res, err = m.fetchTypeConnection(ctx, query, portalType)
	return
}

func (m *portalRepo) GetSplashPages(ctx context.Context, id int) (res []r.SplashPages, err error) {
	query := `select id,name,code,updated_at,created_at,urlSplash from splashpage`
	res, err = m.fetch(ctx, query)
	if err != nil {
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

func (m *portalRepo) fetchTypeConnection(ctx context.Context, query string, args ...interface{}) (
	result []r.PortalConnectionMethod, err error) {
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

	result = make([]r.PortalConnectionMethod, 0)
	for rows.Next() {
		t := r.PortalConnectionMethod{}
		err = rows.Scan(
			&t.IdPortal,
			&t.Method,
			&t.Enabled,
		)
		t.Label = util.GetMethodConnectionLabel(t.Method)
		if err != nil {
			log.Println(err)
			return nil, err
		}
		result = append(result, t)
	}

	return result, nil
}
