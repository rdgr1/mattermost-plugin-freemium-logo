import type { GlobalState } from "@mattermost/types/store";
import type { PluginRegistry } from "~/types/mattermost";
import type { Action, Store } from "redux";
import manifest from "~/../../plugin.json";
import boardsTS from "~/scripts/boards";
import premiumCSS from "~/styles/premium.css?raw";
import boardsCSS from "~/styles/boards.css?raw";

// https://developers.mattermost.com/integrate/plugins/components/webapp
declare global {
	interface Window {
		registerPlugin(pluginId: string, plugin: Plugin): void;
	}
}

// https://developers.mattermost.com/integrate/reference/webapp/webapp-reference
class Plugin {
	public initialize(registry: PluginRegistry, _store: Store<GlobalState, Action<string>>) {
		// CSS INJECTION
		const style = document.createElement("style");
		style.textContent = [
			premiumCSS,
			boardsCSS,
		].join("\n");
		document.head.appendChild(style);
	
		// 🔹 Substituir a logo do Mattermost por uma imagem PNG
		const replaceLogo = () => {
			const brandingElement = document.querySelector('[class^="ProductBrandingTeamEditionContainer"]');
	
			if (brandingElement) {
				// Remover elementos internos (como o SVG antigo)
				brandingElement.innerHTML = '';
	
				// Criar uma nova imagem
				const newLogo = document.createElement("img");
				newLogo.src = "/static/plugins/mattermost-plugin-freemium/assets/logo.png"; // Caminho para sua imagem
				newLogo.alt = "Nova Logo";
				newLogo.style.width = "200px"; // Ajuste conforme necessário
				newLogo.style.height = "auto"; // Mantém a proporção
	
				// Adiciona a imagem ao c2ontainer da logo
				brandingElement.appendChild(newLogo);
			}
		};
	
		// 🔹 Espera a página carregar e troca a logo
		document.addEventListener("DOMContentLoaded", replaceLogo);
	
		// TS INJECTION
		registry.registerGlobalComponent(() => {
			boardsTS();
			return null;
		});
	}

	public uninitialize() {
		// No cleanup needed with current implementation
	}
}

window.registerPlugin(manifest.id, new Plugin());
