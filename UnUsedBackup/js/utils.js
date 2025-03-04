export function setActiveMenuItem(menuItems, clickedItem) {
    menuItems.forEach(item => item.classList.remove("active"));
    clickedItem.classList.add("active");
}

export function setActiveTab(tabItems, activeTab) {
    tabItems.forEach(tab => tab.classList.remove("active"));
    activeTab.classList.add("active");
}
