// Load discussions from the server on page load
document.addEventListener('DOMContentLoaded', function () {
  loadDiscussions();
});

const API_URL = 'https://mental-health-blog.vercel.app/'; 

function isAuthenticated() {
  const authenticatedUser = localStorage.getItem('authenticatedUser');
  return authenticatedUser === 'admin' || authenticatedUser === '2268';
}

function addDiscussion() {
  const discussionInput = document.getElementById('discussionInput');
  const discussionsContainer = document.getElementById('discussions');

  if (discussionInput.value.trim() !== '') {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();

    const discussionObject = {
      content: discussionInput.value,
      timestamp: formattedDate,
      comments: [],
      likes: 0,
      user: localStorage.getItem('authenticatedUser') || 'guest',
    };

    // Save the discussion to the server
    saveDiscussion(discussionObject);

    // Add the discussion to the UI
    addDiscussionToUI(discussionObject, discussionsContainer);

    // Clear the input field
    discussionInput.value = '';
  }
}

function addComment(button) {
  const commentInput = prompt('Add a comment:');
  if (commentInput !== null && commentInput.trim() !== '') {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();

    const commentObject = {
      content: commentInput,
      timestamp: formattedDate,
      user: localStorage.getItem('authenticatedUser') || 'guest',
    };

    addCommentToUI(commentObject, button.parentNode);

    // Update the discussion on the server
    updateDiscussion(button.parentNode, { comments: [commentObject] });
  }
}

function addLike(button) {
  const likesContainer = document.createElement('div');
  likesContainer.className = 'likes-container';
  likesContainer.innerHTML = '<p>1 like</p>';
  button.parentNode.insertBefore(likesContainer, button);

  // Update the discussion on the server
  updateDiscussion(button.parentNode, { likes: 1 });
}

function deleteDiscussion(button) {
  if (isAuthenticated()) {
    const discussionElement = button.parentNode;
    const timestamp = discussionElement.querySelector('.timestamp').innerText;

    // Remove the discussion from the server
    removeDiscussion(timestamp);

    // Remove the discussion from the UI
    discussionElement.remove();
  } else {
    alert('You need to be authenticated to perform this action.');
  }
}

function removeDiscussion(timestamp) {
  fetch(`${API_URL}/${timestamp}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));
}

function saveDiscussion(discussion) {
  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(discussion),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));
}

function loadDiscussions() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      const discussionsContainer = document.getElementById('discussions');
      Object.values(data).forEach((discussion) => {
        addDiscussionToUI(discussion, discussionsContainer);
      });
    })
    .catch((error) => console.error('Error:', error));
}

function updateDiscussion(discussionElement, updates) {
  const timestamp = discussionElement.querySelector('.timestamp').innerText;
  fetch(`${API_URL}/${timestamp}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));
}

function addDiscussionToUI(discussion, container) {
  const discussionElement = document.createElement('div');
  discussionElement.className = 'discussion';
  discussionElement.innerHTML = `<p>${discussion.content}</p><p class="timestamp">Posted on ${discussion.timestamp} by ${discussion.user}</p><button onclick="addComment(this)">Comment</button><button onclick="addLike(this)">Like</button>`;

  if (isAuthenticated()) {
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete';
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = function () {
      deleteDiscussion(this);
    };
    discussionElement.appendChild(deleteButton);
  }

  container.appendChild(discussionElement);

  discussion.comments.forEach((comment) => {
    addCommentToUI(comment, discussionElement);
  });

  for (let i = 0; i < discussion.likes; i++) {
    const likesContainer = document.createElement('div');
    likesContainer.className = 'likes-container';
    likesContainer.innerHTML = '<p>1 like</p>';
    discussionElement.insertBefore(likesContainer, discussionElement.lastChild);
  }
}

function addCommentToUI(comment, container) {
  const commentElement = document.createElement('div');
  commentElement.className = 'comment';
  commentElement.innerHTML = `<p>${comment.content}</p><p class="timestamp">Commented on ${comment.timestamp} by ${comment.user}</p>`;
  container.insertBefore(commentElement, container.lastChild);
}

function authenticateAdmin() {
  const passcode = prompt('Enter passcode to authenticate as admin:');
  if (passcode === '2268') {
    localStorage.setItem('authenticatedUser', 'admin');
    alert('Admin authenticated!');
  } else {
    alert('Authentication failed. Incorrect passcode.');
  }
}
