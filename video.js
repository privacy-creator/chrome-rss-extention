let videoList = [];

function saveVideo(title, link, date, name, refresh, i) {
    if (refresh){
        // Initialize videoList if it's undefined or empty
        if (!videoList || videoList.length === 0) {
            videoList = [];
        }

        // Check if the videoList is not empty and if the date of the new video is not newer than the latest video
        if (videoList.length > 0 && Date.parse(date) < Date.parse(videoList[videoList.length - 1].date)) {
            console.log("The video is not newer than the latest video");
            return;
        }

        if (title == videoList[i].title){
            return;
        }
    }

    // Add the new video to the videoList
    videoList.push({
        title: title,
        link: link,
        date: date,
        isFavorite: false
    });
}

function cookieSave(name){
    // Sort videoList by date in descending order (newest first)
    videoList.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

    // Convert videoList to JSON and save it to localStorage
    const jsonString = JSON.stringify(videoList);
    localStorage.setItem(name, jsonString);

    loadVideo(name)
}

function loadVideo(name) {
    const videosList = document.getElementById('videos');
    // Retrieve the JSON string from localStorage
    const retrievedJsonString = localStorage.getItem(name);

    // Convert the JSON string back to an object
    videoList = JSON.parse(retrievedJsonString) || [];

    videoList.forEach((item, i) => {
        otherVideo(videosList, item.title, item.link, item.date, item.isFavorite, i, name); // Pass the name parameter to otherVideo
    });
}

function loadVideoById(id, name) {
    const videosList = document.getElementById('videos');

    // Replace item id in the videosList
    const itemToReplace = videosList.children[id];
    if (itemToReplace) {
        videosList.replaceChild(createVideoElement(videoList[id], name, id), itemToReplace);
    }
}

function otherVideo(videosList, title, link, date, isFavorite, i, name) {
    // Create list item
    const listItem = createVideoElement({title, link, date, isFavorite}, name, i);

    // Append the list item to the ordered list
    videosList.appendChild(listItem);
}

function createVideoElement(video, name, id) {
    const listItem = document.createElement('li');

    if (video.link.includes("youtube.com")) {
        video.link = video.link.replace("www.youtube.com", bestYoutubeSite)
    }

    // Append the video details to the list item
    const paragraphElement = document.createElement('p');
    paragraphElement.innerHTML = `<a href="${video.link}" target="_blank">${video.title}</a> - (Published on ${video.date})`;
    listItem.appendChild(paragraphElement);

    // Create a favorite button
    const favoriteButton = document.createElement('button');
    favoriteButton.textContent = video.isFavorite ? 'Remove Favorite' : 'Add to Favorites';
    favoriteButton.addEventListener('click', function () {
        toggleFavorite(id, name);
    });
    // Append the button to the list item
    listItem.appendChild(favoriteButton);

    return listItem;
}

function toggleFavorite(i, name) {
    videoList[i].isFavorite = !videoList[i].isFavorite;

    // Update the localStorage
    const jsonString = JSON.stringify(videoList);
    localStorage.setItem(name, jsonString);

    // Reload the videos to reflect the changes
    loadVideoById(i, name);
}