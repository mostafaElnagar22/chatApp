import main from '/js/main.js'
const userData = main.userData();
const modifyUI = main.modifyUI;
const baseUrl = main.baseUrl;
const userName = document.querySelector("#user-name");
const name = document.querySelector("#name");
const email = document.querySelector("#email");
const postNumber = document.querySelector("#post-num");
const commentNumber = document.querySelector("#comment-num");
const currentUser = document.querySelector("#current-user");
const postsDiv = document.querySelector("#user-posts");
const addPostIcon = document.querySelector("#addPostIcon");

let myPostBtns;
modifyUI();
function userId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("userId");
  return id || userData?.id;
}
// function of get user
function getUserData() {
  const id = userId();
  if (id == undefined) {
    return;
  }
  axios
    .get(`${baseUrl}/users/${id}`)
    .then(function (response) {
      const user = response.data.data;
      updateUserData(user);
    })
    .catch(function (error) {
      console.log(error);
    });
}
getUserData();
// function of update profile according to user
function updateUserData(user) {
  const imageParent = document.querySelector("#profile-image-div");
  imageParent.innerHTML = `  <img
                src=${user.profile_image}
                  alt=""
                  class="rounded-circle border border-info profile-image"
                  id="profile-image"
                />`;
  userName.textContent = user.username;
  currentUser.textContent = user.username;
  name.textContent = user.name;
  email.textContent = user.email || `email not exist`;
  commentNumber.textContent = user.comments_count;
  postNumber.textContent = user.posts_count;
}
// function of post construct
function card(post) {
  let user = userData;
  let edit = "";
  let del = "";
  if (user) {
    if (user.id == post.author.id && user != "") {
      edit = `  <button type="button"
                 onclick="editPost('${encodeURIComponent(
                   JSON.stringify(post)
                 )}')" class="btn btn-info"style="font-size: 13px;padding: 3px 10px;">Edit</button>`;
      del = `  <button type="button"
                 onclick="deletePost(${post.id})" class="btn btn-danger "style="font-size: 13px;padding: 3px 7px;">delete</button>`;
    }
  } else {
    edit = "";
    del = "";
  }
  const content = `
              <div class="card shadow my-3">
              <div class="card-header d-flex align-items-center">
                <img
                  src=${post.author.profile_image}
                  alt=""
                  class="rounded-circle border border-info"
                  style="width: 30px; height: 30px"
                />
                <p class="ms-1 mb-0 fw-bold">@${post.author.username}</p>
                  <div class = "ms-auto postBtns"> 
                ${edit}
                ${del}
                </div> 
              </div>
              <div class="card-body" style = 'cursor:pointer' onclick="goToDetail(${
                post.id
              })">
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
  return content;
}
// function of filling posts
function fillingPosts(posts) {
  postsDiv.innerHTML = "";
  posts.reverse();
  for (const post of posts) {
    const postContent = card(post);
    postsDiv.innerHTML += postContent;
  }

  myPostBtns = document.querySelectorAll(".postBtns");
}
// function of get user posts
function getUserPosts() {
  const id = userId();
  if (id == undefined) {
    postsDiv.innerHTML = `<div class="mt-4 fs-1 fs-sm-3 fs-md-4 fs-lg-5 fs-xl-6" style="display: block; text-align: center;"> 
      please click on any user to show it's profile!
      </div>`;
    return;
  }

  axios
    .get(`${baseUrl}/users/${id}/posts`)
    .then(function (response) {
      const posts = response.data.data;
      if (posts.length != 0) {
        fillingPosts(posts);
      } else {
        postsDiv.innerHTML = `<div style="display: block; text-align: center;">
            <div style= "font-size:18px;">There is no post for this user yet</div>
          </div>`;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
getUserPosts();
