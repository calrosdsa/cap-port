package ws

import (
	"log"
	// database "room/database"
	// "encoding/json"
)

type message struct {
	data []byte
	room string
}

type subscription struct {
	conn *connection
	room string
}

// hub maintains the set of active connections and broadcasts messages to the
// connections.
type hub struct {
	// Registered connections.
	rooms map[string]map[*connection]bool

	// Inbound messages from the connections.
	broadcast chan message

	// Register requests from the connections.
	register chan subscription

	// Unregister requests from connections.
	unregister chan subscription
}

var H = hub{
	broadcast:  make(chan message),
	register:   make(chan subscription),
	unregister: make(chan subscription),
	rooms:      make(map[string]map[*connection]bool),
}

func (h *hub) Run() {
	for {
		select {
		case s := <-h.register:
			log.Println("registrando")
			log.Println(s.room)
			// log.Println(s.room)
			// query := `SELECT * FROM messages WHERE caso_id = ?`
			// value := database.ExecuteQuery3(query, s.room)
			// jsonStr, err := json.Marshal(value)
			// if err != nil {
			// 	log.Printf("Error: %s", err.Error())
			// } else {
			// 	s.conn.send <- jsonStr
			// }
			log.Println(h.rooms[s.room])
			connections := h.rooms[s.room]
			if connections == nil {
				log.Println("no room")
				connections = make(map[*connection]bool)
				h.rooms[s.room] = connections
			}
			log.Println("si room")
			h.rooms[s.room][s.conn] = true
		case s := <-h.unregister:
			connections := h.rooms[s.room]
			if connections != nil {
				if _, ok := connections[s.conn]; ok {
					delete(connections, s.conn)
					close(s.conn.send)
					if len(connections) == 0 {
						delete(h.rooms, s.room)
					}
				}
			}
		case m := <-h.broadcast:
			connections := h.rooms[m.room]
			for c := range connections {
				select {
				case c.send <- m.data:
				default:
					close(c.send)
					delete(connections, c)
					if len(connections) == 0 {
						delete(h.rooms, m.room)
					}
				}
			}
		}
	}
}

// create table messages(
// 	caso_id text,
// 	content text,
// 	created timestamp,
// 	from_user text,
// 	from_user_id text,
// 	to_user text,
// 	to_user_id text,
// 	read int,
// 	PRIMARY KEY (caso_id,content));
