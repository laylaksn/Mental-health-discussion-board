// Load discussions from local storage on page load
document.addEventListener('DOMContentLoaded', function () {
    loadDiscussions();
  });
  
  function addDiscussion() {
    const discussionInput = document.getElementById('discussionInput');
    const discussionsContainer = document.getElementById('discussions');
  
    if (discussionInput.value.trim() !== '') {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString();
  
      // Create a discussion object
      const discussionObject = {
        content: discussionInput.value,
        timestamp: formattedDate,
        comments: [],
        likes: 0,
      };
  
      // Save the discussion to local storage
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
  
      // Create a comment object
      const commentObject = {
        content: commentInput,
        timestamp: formattedDate,
      };
  
      // Add the comment to the UI
      addCommentToUI(commentObject, button.parentNode);
  
      // Update the discussion in local storage
      updateDiscussion(button.parentNode, { comments: [commentObject] });
    }
  }
  
  function addLike(button) {
    const likesContainer = document.createElement('div');
    likesContainer.className = 'likes-container';
    likesContainer.innerHTML = '<p>1 like</p>';
    button.parentNode.insertBefore(likesContainer, button);
  
    // Update the discussion in local storage
    updateDiscussion(button.parentNode, { likes: 1 });
  }
  
  // Function to save a discussion to local storage
  function saveDiscussion(discussion) {
    let discussions = JSON.parse(localStorage.getItem('discussions')) || [];
    discussions.push(discussion);
    localStorage.setItem('discussions', JSON.stringify(discussions));
  }
  
  // Function to load discussions from local storage and display them on the UI
  function loadDiscussions() {
    const discussionsContainer = document.getElementById('discussions');
    let discussions = JSON.parse(localStorage.getItem('discussions')) || [];
    discussions.forEach((discussion) => {
      addDiscussionToUI(discussion, discussionsContainer);
    });
  }
  
  // Function to update a discussion in local storage
  function updateDiscussion(discussionElement, updates) {
    const discussions = JSON.parse(localStorage.getItem('discussions')) || [];
    const discussionIndex = discussions.findIndex(
      (d) => d.timestamp === discussionElement.querySelector('.timestamp').innerText
    );
    if (discussionIndex !== -1) {
      discussions[discussionIndex] = { ...discussions[discussionIndex], ...updates };
      localStorage.setItem('discussions', JSON.stringify(discussions));
    }
  }
  
  // Function to add a discussion to the UI
  function addDiscussionToUI(discussion, container) {
    const discussionElement = document.createElement('div');
    discussionElement.className = 'discussion';
    discussionElement.innerHTML = `<p>${discussion.content}</p><p class="timestamp">Posted on ${discussion.timestamp}</p><button onclick="addComment(this)">Comment</button><button onclick="addLike(this)">Like</button>`;
    container.appendChild(discussionElement);
  
    // Add comments to the UI
    discussion.comments.forEach((comment) => {
      addCommentToUI(comment, discussionElement);
    });
  
    // Add likes to the UI
    for (let i = 0; i < discussion.likes; i++) {
      const likesContainer = document.createElement('div');
      likesContainer.className = 'likes-container';
      likesContainer.innerHTML = '<p>1 like</p>';
      discussionElement.insertBefore(likesContainer, discussionElement.lastChild);
    }
  }
  
  // Function to add a comment to the UI
  function addCommentToUI(comment, container) {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `<p>${comment.content}</p><p class="timestamp">Commented on ${comment.timestamp}</p>`;
    container.insertBefore(commentElement, container.lastChild);
  }
  