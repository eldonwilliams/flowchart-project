const serverItemElement = document.querySelector("#server-items");
const panel = serverItemElement.parentElement;
const loader = panel.querySelector(".loader");
const hider = document.querySelector("#hider");

/**
 * Shows the server discovery menu.
 * @param loading - Indicates whether to show the loading spinner.
 */
export function showServerDiscoveryMenu(loading: boolean = true) {
    hider.classList.remove("hidden");
    panel.classList.remove("hidden");
    if (loading) loader.classList.remove("hidden");
}

/**
 * Stops the loading spinner in the server discovery menu.
 */
export function stopLoadingServerDiscoveryMenu() {
    loader.classList.add("hidden");
}

/**
 * Hides the server discovery menu.
 */
export function hideServerDiscoveryMenu() {
    hider.classList.add("hidden");
    panel.classList.add("hidden");
    loader.classList.add("hidden");
}

/**
 * Adds a server item to the server discovery menu.
 * @param itemName - The name of the item.
 * @param clickHandler - The event handler for the click event.
 * @param dismisses - Indicates whether clicking the item dismisses the menu.
 */
export function addServerItem(itemName: string, clickHandler: (event: MouseEvent) => void, dismisses: boolean = true){
    const item = document.createElement("button");
    serverItemElement.appendChild(item);
    item.innerText = itemName;
    item.addEventListener("click", clickHandler);
    if (dismisses) item.addEventListener("click", hideServerDiscoveryMenu);
}

/**
 * Clears the server items from the server discovery menu.
 */
export function clearServerItems() {
    serverItemElement.innerHTML = "";
}