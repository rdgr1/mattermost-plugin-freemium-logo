package main

import (
	"github.com/mattermost/mattermost/server/public/plugin"
)

// https://developers.mattermost.com/extend/plugins/server/reference
func main() {
	plugin.ClientMain(&Plugin{})
}
