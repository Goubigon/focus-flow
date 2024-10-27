export function getCleanDateTime(pDate) {
    const year = pDate.getFullYear();
    const month = String(pDate.getMonth() + 1).padStart(2, '0');
    const day = String(pDate.getDate()).padStart(2, '0');
    const hours = String(pDate.getHours()).padStart(2, '0');
    const minutes = String(pDate.getMinutes()).padStart(2, '0');
    const seconds = String(pDate.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export function convertSecondsToMinutesAndSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
}

export function loadFromLocalStorage(itemName) {
    const paramString = localStorage.getItem(itemName);
    if (paramString) {
        console.log('Loaded From local storage [' + itemName + '] : ', paramString);
        return paramString;
    } else {
        console.log('No data found in localStorage.');
        return null;
    }
}