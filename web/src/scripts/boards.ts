// Adds a button to return to the channels page from the mobile boards page
function handleButton() {
	const sidebar = document.querySelector(".Sidebar.octo-sidebar");
	if (!sidebar || sidebar.closest("#focalboard-app") === null) {
		return;
	}
	if (window.innerWidth < 770) {
		// Look for the expected HTML structure
		const workspaceTitle = document.querySelector(".WorkspaceTitle");
		if (workspaceTitle && !sidebar.classList.contains("hidden")) {
			const sidebarSwitcher = workspaceTitle.querySelector(".sidebarSwitcher");
			if (sidebarSwitcher) {
				// Check if the button is already appended
				if (!workspaceTitle.querySelector(".back-button-freemium")) {
					const backButton = document.createElement("button");
					backButton.textContent = "🏠";
					backButton.className = "back-button-freemium";
					backButton.style.backgroundColor = "transparent";
					backButton.style.border = "none";
					backButton.style.marginLeft = "10px";

					backButton.addEventListener("click", () => {
						window.location.href = window.location.origin;
					});

					// Append the button as a sibling of the sidebarSwitcher
					const last = sidebarSwitcher.parentNode.lastChild;
					if (last) {
						sidebarSwitcher.parentNode.insertBefore(backButton, last);
					}
				}
			}
		}
	}
	if (window.innerWidth >= 770 || sidebar.classList.contains("hidden")) {
		const backButton = document.querySelector(".back-button-freemium");
		if (backButton) {
			backButton.remove();
		}
	}
}

export default function main() {
	// Use mutation observer to detect sidebar opening
	const target = document.body;
	const callback = (mutations: MutationRecord[]) => {
		for (const mutation of mutations) {
			if (mutation.type === "childList" || mutation.type === "attributes") {
				handleButton();
			}
		}
	};
	const observer = new MutationObserver(callback);
	const config = {
		childList: true,
		attributes: true,
		subtree: true,
	};
	observer.observe(target, config);
}
