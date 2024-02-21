let videoList = []
let tempVideoList = []
let favoriteList = []

function saveVideo(title, link, date) {
    tempVideoList.push({
        title: title,
        link: link,
        date: date,
        isFavorite: false
    });
}

function saveVideoList(name, refresh) {
    if (refresh) {
        updateVideoList(name);
    } else {
        videoList = tempVideoList.slice();
        cookieSave(name);
    }
}

function updateVideoList(name) {
    tempVideoList.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    tempVideoList.forEach((item) => {
        if (videoList.length > 0 && Date.parse(item.date) > Date.parse(videoList[0].date)) {
            videoList.push(item);
        }
    });
    cookieSave(name);
}

function cookieSave(name) {
    videoList.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    localStorage.setItem(name, JSON.stringify(videoList));
    tempVideoList = [];
    loadVideo(name);
}

function loadVideo(name) {
    const videosList = document.getElementById('videos');
    videoList = JSON.parse(localStorage.getItem(name)) || [];
    videoList.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    videoList.forEach((item, i) => {
        appendVideo(videosList, item, name, i);
    });
}

function appendVideo(videosList, video, name, id) {
    const listItem = createVideoElement(video, name, id);
    videosList.appendChild(listItem);
}

function createVideoElement(video, name, id) {
    const listItem = document.createElement('li');
    const paragraphElement = document.createElement('p');
    paragraphElement.innerHTML = `<a href="${video.link}" target="_blank">${video.title}</a> - (Published on ${video.date})`;
    listItem.appendChild(paragraphElement);
    const favoriteButton = document.createElement('button');
    favoriteButton.textContent = video.isFavorite ? 'Remove Favorite' : 'Add to Favorites';
    favoriteButton.addEventListener('click', function () {
        toggleFavorite(id, name);
    });
    listItem.appendChild(favoriteButton);
    return listItem;
}

function toggleFavorite(id, name) {
    videoList[id].isFavorite = !videoList[id].isFavorite;
    localStorage.setItem(name, JSON.stringify(videoList));
    loadVideoById(id, name);
}

function loadVideoById(id, name) {
    const videosList = document.getElementById('videos');
    const itemToReplace = videosList.children[id];
    if (itemToReplace) {
        videosList.replaceChild(createVideoElement(videoList[id], name, id), itemToReplace);
    }
}