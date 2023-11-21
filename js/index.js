(() => {
    console.log("Inside index.js");

    // Globals

    const commentsContainer = document.querySelector('.comments-container');

    // Functions

    const renderComment = comment => {
        const commentEl = document.createElement('div');
        commentEl.classList.add('comment');
        commentEl.setAttribute('data-comment-id', comment.id);
        commentEl.innerHTML = `
            <div class="comment-votes">
                
            </div>
            <div class="comment-body">
                <div class="comment-header">
                    <div class="header-left">
                        <div class="comment-avatar"></div>
                        <div class="comment-author"></div>
                        <div class="you-div"></div>
                        <div class="comment-created-at"></div>
                    </div>
                    <div class="header-right">
                        <div class="comment-delete">
                            <div class="delete-icon"></div>
                            <div class="delete-text">Delete</div>
                        </div>
                        <div class="comment-edit">
                            <div class="edit-icon"></div>
                            <div class="edit-text">Edit</div>
                        </div>
                        <div class="comment-reply">
                            <div class="reply-icon"></div>
                            <div class="reply-text">Reply</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };
    const renderCommentsSection = comments => {
        const commentsSection = document.createElement('div');
        commentsSection.id = 'comments-section';
        for(const comment of comments) {
            renderComment(comment);
        }
    };
    const renderCommentsData = commentsData => {
        console.log(commentsData);
        renderCommentsSection(commentsData.comments);
    };
    const getCommentsData = async () => {
        let response = await fetch('../data.json');
        if(!response.ok) {
            console.log('Unable to access data');
            return null;
        }
        let data = await response.json();
        renderCommentsData(data);
    };

    // Events



    // On Load
    getCommentsData();

})();