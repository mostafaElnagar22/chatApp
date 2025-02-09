import main from "/js/main.js";
const userData = main.userData();
const baseUrl = main.baseUrl;
const postContent = document.querySelector(".selected-post");
const postOwner = document.querySelector(".post-owner span");
const commentsDiv = document.querySelector("#comments");
window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    window.location.reload(); // This forces the page to refresh
  }
});

// function of get postID
function postId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const postID = urlParams.get("postId");
  return postID;
}
const id = postId();
// function of request for the selected post
function getSelectedPost() {
  axios
    .get(`${baseUrl}/posts/${id}`)
    .then(function (response) {
      let selectedPost = response.data.data;
      let allComments = selectedPost.comments;
      card(selectedPost);
      postOwner.innerHTML = `${selectedPost.author.username}`;
      showAllComments(allComments);
    })
    .catch(function (error) {
      commentsDiv.innerHTML = `<div  style="display: block; text-align: center;">
  <div style="color:red" >there is an error try again</div>
</div>`;
    });
}
getSelectedPost();
// function of post construct
function card(post) {
  const content = `
              <div class="card shadow my-3">
              <div class="card-header d-flex align-items-center">
              <span  style = 'cursor:pointer' onclick="showProfile(${post.author.id})">
                <img
                  src=${post.author.profile_image}
                  alt=""
                  class="rounded-circle border border-info"
                  style="width: 30px; height: 30px"
                />  
                <p class="ms-1 mb-0 fw-bold" style="display:inline-block">@${post.author.username}</p>
                </span>
              </div>
              <div class="card-body" ">
                <img src=${post.image} alt="" class="w-100" />
                <h6 style="color: gray">${post.created_at}</h6>
                <h4>${post.title || ""}</h4>
                <p>
                  ${post.body}
                </p>
                <hr />
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-pen"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"
                    />
                  </svg>
                  <span> (${post.comments_count})comments </span>
                </div>
              </div>
            </div>
  `;
  postContent.innerHTML = content;

}
// function of comment construct
function showComment(comment) {
  return `
    <div class="comment ">
            <div class="comment-header d-flex align-items-center" style = 'cursor:pointer' onclick="showProfile(${comment.author.id})">
              <img
                src=${comment.author.profile_image}
                alt=""
                class="rounded-circle border border-info"
                style="width: 30px; height: 30px"
              />
              <p class="ms-1 mb-0 fw-bold">${comment.author.username}</p>
            </div>
            <p class="my-2 comment-text " >${comment.body}</p>
          </div>
          <hr>
  `;
}
// function of set all comments
function showAllComments(allComments) {
  const addCommentDiv = `<div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="add new comment"
                aria-label="add new comment"
                aria-describedby="button-addon2"
                id="comment-content"
              />
              <button
                class="btn btn-outline-primary"
                type="button"
                id="button-addon2"
                style="color: white !important;"
                onclick="addComment()"
              >
                Send
              </button>
            </div>`;
  let commentContent = "";
  if (allComments.length == 0) {
    commentContent = "there is no comments";
  } else {
    for (const ele of allComments) {
      commentContent += showComment(ele);
    }
  }

  commentsDiv.innerHTML = commentContent + addCommentDiv;
}
// function of add comment
function addComment() {
  const newCommentContent = document.querySelector("#comment-content");
  if (newCommentContent.value === "") {
    failedMessage("comment is required");
  } else {
    const params = {
      body: newCommentContent.value,
    };
    addCommentRequest(params);
  }
}
window.addComment = addComment;
// function of add comment request
function addCommentRequest(params) {
  const token = localStorage.getItem("token");
  const headers = {
    authorization: `Bearer ${token}`,
  };
  axios
    .post(`${baseUrl}/posts/${id}/comments`, params, { headers: headers })
    .then(function (response) {
      getSelectedPost();
    })
    .catch(function (error) {
      failedMessage("please Login for add comment");
    });
}
// function of message after failed process
function failedMessage(message) {
  Swal.fire({
    icon: "error",
    title: "",
    text: `${message}`,
    showConfirmButton: true,
  });
}
