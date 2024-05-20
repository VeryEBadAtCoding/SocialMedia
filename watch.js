const videoContainer = document.getElementById('videoContainer');

function displayVideos() {
    fetch('/videos')
        .then(response => response.json())
        .then(videos => {
            videoContainer.innerHTML = '';
            videos.forEach((video, index) => {
                const videoWrapper = document.createElement('div');
                videoWrapper.classList.add('videoWrapper');

                const videoElement = document.createElement('video');
                videoElement.src = video.url;
                videoElement.controls = true;

                const description = document.createElement('p');
                description.textContent = video.description;

                const controls = document.createElement('div');
                controls.classList.add('controls');

                const likeButton = document.createElement('span');
                likeButton.classList.add('likeButton');
                likeButton.textContent = 'Like (0)';
                let liked = false;
                videoElement.addEventListener('dblclick', function() {
                    if (!liked) {
                        liked = true;
                        let likes = parseInt(likeButton.textContent.match(/\d+/)[0], 10);
                        likes++;
                        likeButton.textContent = `Like (${likes})`;
                    }
                });

                const viewCounter = document.createElement('span');
                viewCounter.textContent = 'Views: 0';
                let views = 0;
                videoElement.addEventListener('play', function() {
                    views++;
                    viewCounter.textContent = `Views: ${views}`;
                });

                controls.appendChild(likeButton);
                controls.appendChild(viewCounter);

                const commentSection = document.createElement('div');
                commentSection.classList.add('commentSection');

                const commentInput = document.createElement('input');
                commentInput.classList.add('commentInput');
                commentInput.type = 'text';
                commentInput.placeholder = 'Add a comment...';

                const commentButton = document.createElement('button');
                commentButton.classList.add('commentButton');
                commentButton.textContent = 'Comment';

                const commentList = document.createElement('ul');
                commentList.classList.add('commentList');

                commentButton.addEventListener('click', function() {
                    const commentText = commentInput.value.trim();
                    if (commentText) {
                        const commentItem = document.createElement('li');
                        commentItem.classList.add('commentItem');
                        commentItem.textContent = commentText;
                        commentList.appendChild(commentItem);
                        commentInput.value = '';
                    }
                });

                commentSection.appendChild(commentInput);
                commentSection.appendChild(commentButton);
                commentSection.appendChild(commentList);

                videoWrapper.appendChild(videoElement);
                videoWrapper.appendChild(description);
                videoWrapper.appendChild(controls);
                videoWrapper.appendChild(commentSection);

                videoContainer.appendChild(videoWrapper);
            });
        });
}

document.addEventListener('DOMContentLoaded', displayVideos);
