function addDiscussion() {
    const discussionInput = document.getElementById('discussionInput');
    const discussionsContainer = document.getElementById('discussions');
  
    if (discussionInput.value.trim() !== '') {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString();
  
      const discussion = document.createElement('div');
      discussion.className = 'discussion';
      discussion.innerHTML = `<p>${discussionInput.value}</p><p class="timestamp">Posted on ${formattedDate}</p><button onclick="addComment(this)">Comment</button><button onclick="addLike(this)">Like</button>`;
      discussionsContainer.appendChild(discussion);
      discussionInput.value = '';
    }
  }
  
  function addComment(button) {
    const commentInput = prompt('Add a comment:');
    if (commentInput !== null && commentInput.trim() !== '') {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString();
  
      const comment = document.createElement('div');
      comment.className = 'comment';
      comment.innerHTML = `<p>${commentInput}</p><p class="timestamp">Commented on ${formattedDate}</p>`;
      button.parentNode.insertBefore(comment, button);
    }
  }
  
  function addLike(button) {
    const likesContainer = document.createElement('div');
    likesContainer.className = 'likes-container';
    likesContainer.innerHTML = '<p>1 like</p>';
    button.parentNode.insertBefore(likesContainer, button);
  }
  