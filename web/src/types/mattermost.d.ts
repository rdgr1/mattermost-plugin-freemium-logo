import type React from "react";

// https://developers.mattermost.com/extend/plugins/webapp/reference
export interface PluginRegistry {
	registerGlobalComponent(component: React.ElementType): string;
	registerRootComponent(component: React.ElementType): string;
}
