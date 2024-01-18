const toolbarElement = document.getElementById("toolbar");

/**
 * Adds a toolbar item, returns a function that can be used to remove the item
 * 
 * @param {string} label 
 * @param {Function} action 
 * @returns {Function} removeItem
 */
export const addToolbarItem = (label, action) => {
    const button = document.createElement("button");
    button.innerText = label;
    button.addEventListener("click", action);
    toolbarElement.appendChild(button);
    return () => {
        toolbarElement.removeChild(button);
    }
}