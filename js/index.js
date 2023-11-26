(async () => {
    console.log("Inside index.js");

    // Globals

    const commentsContainer = document.querySelector('.comments-container');
    const currentUser = await getUser();

    // Functions

    function isCurrentUser(comment) {
        return comment.user.username === currentUser.username;
    }
    function renderComment(commentEl, comment, isReply) {
        commentEl.setAttribute('data-comment-id', comment.id);
        commentEl.innerHTML = `
            <div class="comment-votes">
                <div class="up-vote pointer">
                    <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
                </div>
                <div class="votes">${comment.score}</div>
                <div class="down-vote pointer">
                    <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
                </div>
            </div>
            <div class="comment-body">
                <div class="comment-header">
                    <div class="header-left">
                        <div class="comment-avatar">
                            <img src="${comment.user.image.png}">
                        </div>
                        <div class="comment-author">${comment.user.username}</div>
                        ${isCurrentUser(comment) ? '<div class="you-div">you</div>' : ''}
                        <div class="comment-created-at">${comment.createdAt}</div>
                    </div>
                    <div class="header-right">
                        ${isCurrentUser(comment) ? '<div class="comment-delete pointer"><div class="delete-icon"><svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368"/></svg></div><div class="delete-text">Delete</div></div>' : ''}
                        ${isCurrentUser(comment) ? '<div class="comment-edit pointer"><div class="edit-icon"><svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6"/></svg></div><div class="edit-text">Edit</div></div>' : ''}
                        ${!isCurrentUser(comment) ? '<div class="comment-reply pointer"><div class="reply-icon"><svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6"/></svg></div><div class="reply-text">Reply</div></div>' : ''}
                    </div>
                </div>
                <div class="comment-content-wrapper">
                    ${isReply ? `<span class="reply-to">@${comment.replyingTo}</span> ` : ''}<span class="comment-content">${comment.content}</span>
                </div>
            </div>
        `;
        if(!isCurrentUser(comment)) commentEl.querySelector('.comment-reply').addEventListener('click', handleReplyClick);
        commentsContainer.appendChild(commentEl);
    }
    function renderReplies(replies) {
        for(const reply of replies) {
            const replyEl = document.createElement('div');
            replyEl.classList.add('reply');
            renderComment(replyEl, reply, true);
        }
    }
    function renderComments(comments) {
        const commentsSection = document.createElement('div');
        commentsSection.id = 'comments-section';
        for(const comment of comments) {
            const commentEl = document.createElement('div');
            commentEl.classList.add('comment');
            renderComment(commentEl, comment, false);
            if(comment.replies.length > 0) {
                renderReplies(comment.replies);
            }
        }
    }
    function renderCreateComment() {
        const createCommentEl = document.createElement('div');
        createCommentEl.id = 'create-comment-container';
        createCommentEl.innerHTML = `
            <div class="create-comment-avatar">
                <img src="${currentUser.image.png}">
            </div>
            <textarea class="create-comment-input" rows="4" placeholder="Add a comment..."></textarea>
            <button type="button" class="create-comment-btn pointer">SEND</button>
        `;
        commentsContainer.appendChild(createCommentEl);
    }
    function renderCreateReply(replyToElement) {
        console.log('Inside renderCreateReply');
        const createReplyEl = document.createElement('div');
        createReplyEl.classList.add('create-reply-container');
        createReplyEl.innerHTML = `
            <div class="create-reply-avatar">
                <img src="${currentUser.image.png}">
            </div>
            <textarea class="create-reply-input" rows="4" placeholder="Add a comment..."></textarea>
            <button type="button" class="create-reply-btn pointer">SEND</button>
        `;
        replyToElement.insertAdjacentElement("afterend", createReplyEl);
    }
    function renderData(data) {
        console.log(data);
        renderComments(data.comments);
        renderCreateComment();
    }
    async function getData() {
        let response = await fetch('../data.json');
        if(!response.ok) {
            console.log('Unable to access data');
            return null;
        }
        return await response.json();
    }
    async function getUser() {
        const data = await getData();
        return data.currentUser;
    }
    function handleReplyClick(e) {
        renderCreateReply(e.target.parentElement.parentElement.parentElement.parentElement);
    }

    // Events



    // On Load
    renderData(await getData());

})();