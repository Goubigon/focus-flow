
function openTab(event, tabName) {
    // Get all elements with class="tab" and hide them
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Get all elements with class="tab-button" and remove the class "active"
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Show the current tab and add an "active" class to the button that opened the tab
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Open the first tab by default
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.tab-button.active').click();
});