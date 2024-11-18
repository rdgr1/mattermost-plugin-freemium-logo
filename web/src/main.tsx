import type { GlobalState } from "@mattermost/types/store";
import type { Action, Store } from "redux";
import manifest from "~/../../plugin.json";
import css from "~/styles/override.module.css?raw";
import type { PluginRegistry } from "~/types/mattermost";

// https://developers.mattermost.com/integrate/reference/webapp/webapp-reference
export default class Plugin {
	public initialize(_registry: PluginRegistry, _store: Store<GlobalState, Action<string>>) {
		const style = document.createElement("style");
		style.textContent = css;
		document.head.appendChild(style);
	}
}

declare global {
	interface Window {
		registerPlugin(pluginId: string, plugin: Plugin): void;
	}
}

window.registerPlugin(manifest.id, new Plugin());
