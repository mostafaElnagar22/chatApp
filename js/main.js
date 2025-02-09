const postDiv = document.querySelector("#posts");
const logBtns = document.querySelector("#logBtns");
const userName = document.querySelector("#userName");
const password = document.querySelector("#password");
const userNameRegister = document.querySelector("#userNameRegister");
const passwordRegister = document.querySelector("#passwordRegister");
const nameRegister = document.querySelector("#nameRegister");
const loginBtn = document.querySelector("#login-btn");
const logoutBtn = document.querySelector("#logout-btn");
const registerBtn = document.querySelector("#register-btn");
const addPostIcon = document.querySelector("#addPostIcon");
const postTitle = document.querySelector("#postTitle");
const postBody = document.querySelector("#postBody");
const postImage = document.querySelector("#postImage");
const profileImage = document.querySelector("#profile-image");
const profileUserName = document.querySelector("#profile-user-name");
const profileContent = document.querySelector("#profile-content");
const inputProfileRegister = document.querySelector("#profileImageRegister");
let myPostBtns;
let post = [];
const baseUrl = "https://tarmeezacademy.com/api/v1";
let currentPage = 1;
let isLoading = false;
let lastPage = 1;
let editId = -1;
closeLoader();
window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    window.location.reload(); // This forces the page to refresh
  }
});

// function of pagination while scrolling
window.addEventListener("scroll", () => {
  const endOfPage =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
  if (endOfPage && !isLoading && lastPage > currentPage) {
    currentPage++;
    getPosts(currentPage, 0);
    isLoading = true;
  }
});
// function of get posts

closeLoader();
function getPosts(currentPage = 1, empty = 1) {
  openLoader();
  axios
    .get(`${baseUrl}/posts?limit=5&page=${currentPage}`)
    .then(function (response) {
      let posts = response.data.data;
      fillingPosts(posts, empty);
      closeLoader();
      isLoading = false;
      lastPage = response.data.meta.last_page;
    })
    .catch(function (error) {
      postDiv == null
        ? ""
        : (postDiv.innerHTML = `<div  style="display: block; text-align: center;">
  <div style="color:red" >there is an error try again</div>
</div>`);

      isLoading = false;
    });
}

if (window.location.pathname.includes("index.html")) {
  getPosts();
  modalAction();
}
modifyUI();
// two function of handle pg loader
function closeLoader() {
  const loader = document.querySelector(".loader-pg");
  if(loader){
    loader.style.display = "none";


  }
}
function openLoader() {
  const loader = document.querySelector(".loader-pg");
  if (currentPage === 1) {
    return;
  }
  if(loader){
    loader.style.display = "block";


  }
}

// function of card construct
function card(post) {
  let user = userData();
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
  return `
              <div class="card shadow my-3">
              <div class="card-header d-flex align-items-center justify-content-space-between">
              <span  style = 'cursor:pointer' onclick="showProfile(${
                post.author.id
              })">
                <img
                  src=${post.author.profile_image}
                  alt=""
                  class="rounded-circle border border-info"
                  style="width: 30px; height: 30px"
                />  
                <p class="ms-1 mb-0 fw-bold" style="display:inline-block">@${
                  post.author.username
                }</p>
                </span>
                <div class = "ms-auto postBtns" > 
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
}
// function of filling posts
function fillingPosts(posts, empty) {
  if (empty === 1) {
    postDiv.innerHTML = "";
  }

  for (const post of posts) {
    const postContent = card(post);

    postDiv.innerHTML += postContent;
  }
  myPostBtns = document.querySelectorAll(".postBtns");
}
// function of goToDetail page

function goToDetail(id) {
  window.location.href = `/html/postDetails.html?postId=${id}`;
}
window.goToDetail = goToDetail;

const loginRequest = (params) => {
  axios
    .post(`${baseUrl}/login`, params)
    .then(function (response) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      closeLoginModal();
      successLogMessage("Login");
      if (window.location.pathname.includes("profile.html")) {
        window.location.reload();
      }
      modifyUI();
    })
    .catch(function (error) {
      const message = error.response.data.message;
      failedMessage(message);
    })
    
};
// function of login button
function loginSubmit() {
  const params = {
    username: userName.value,
    password: password.value,
  };
  loginRequest(params);
}
window.loginSubmit = loginSubmit;
// function of logout button
function logOutBtn() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  successLogMessage("Logout");
  if (window.location.pathname.includes("profile.html")) {
    window.location.reload();
  }
  modifyUI();
}
window.logOutBtn = logOutBtn;
// function of register request

function registerRequest(formData) {
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  axios
    .post(`${baseUrl}/register`, formData, { headers: headers })
    .then(function (response) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      closeRegisterModal();
      successLogMessage("Register process");
      if (window.location.pathname.includes("profile.html")) {
        window.location.reload();
      }
      modifyUI();
    })
    .catch(function (error) {
      const message = error.response.data.message;
      failedMessage(message);
    });
}
function registerSubmit() {
  const formData = new FormData();
  formData.append("name", nameRegister.value);
  formData.append("username", userNameRegister.value);
  formData.append("password", passwordRegister.value);
  formData.append("image", inputProfileRegister.files[0]);
  registerRequest(formData);
}
window.registerSubmit = registerSubmit;
// function of exchange between login & logout button

function modifyUI() {
  const token = localStorage.getItem("token");
  const user = userData();
  if (token) {
    if (addPostIcon) {
      addPostIcon.style.display = "flex";
    }
    if (myPostBtns) {
      myPostBtns.forEach((button) => {
        button.style.display = "block";
      });
    }

    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    registerBtn.style.display = "none";
    profileContent.style.display = "block";
    profileImage.setAttribute("src", `${user.profile_image}`);
    profileUserName.innerHTML = `@${user.username}`;
  } else {
    if (addPostIcon) {
      addPostIcon.style.display = "none";
    }
    if (myPostBtns) {
      myPostBtns.forEach((button) => {
        button.style.display = "none";
      });
    }
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    registerBtn.style.display = "inline-block";
    profileContent.style.display = "none";
  }
}

// function of close login modal
const closeLoginModal = () => {
  const loginModal = document.querySelector("#loginModal");
  const bootstrapModal = bootstrap.Modal.getInstance(loginModal);
  bootstrapModal.hide();
};
// function of close create post modal
function closeCreatePostModal() {
  const createPostModal = document.querySelector("#createPostModal");
  const bootstrapModal = bootstrap.Modal.getInstance(createPostModal);
  bootstrapModal.hide();
  editId = -1;
}
// function of close register modal
const closeRegisterModal = () => {
  const registerModal = document.querySelector("#registerModal");
  const bootstrapModal = bootstrap.Modal.getInstance(registerModal);
  bootstrapModal.hide();
};
// function of message after success process
function successLogMessage(btn) {
  Swal.fire({
    icon: "success",
    title: `Successfully ${btn}`,
    showConfirmButton: false,
    timer: 2000,
  });
}
// function of message after failed process

function failedMessage(message) {
  Swal.fire({
    icon: "error",
    title: "invalid input",
    text: `${message}`,
    showConfirmButton: true,
  });
}

// function of update the post

function updatePost() {
  const id = editId;
  const formData = new FormData();
  formData.append("image", postImage.files[0]);
  formData.append("body", postBody.value);
  formData.append("title", postTitle.value);
  formData.append("_method", "put");
  const token = localStorage.getItem("token");
  const headers = {
    authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };

  axios
    .post(`${baseUrl}/posts/${id}`, formData, { headers: headers }, {})
    .then(function (response) {
      successLogMessage("Edit Post");
      closeCreatePostModal();
      getPosts();
    })
    .catch(function (error) {
      const message = error.response.data.message;
      failedMessage(message);
    });
}
window.updatePost = updatePost;

// function of delete post
function deletePost(id) {
  const token = localStorage.getItem("token");
  const headers = {
    authorization: `Bearer ${token}`,
  };
  Swal.fire({
    title: "Are you sure?",
    text: "Once deleted,  You can not restore your post!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .delete(`${baseUrl}/posts/${id}`, { headers: headers })
        .then(function (response) {
          Swal.fire({
            title: "Deleted!",
            text: "Your post has been deleted.",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        })
        .then(() => {
          if (window.location.pathname.includes("index.html")) {
            getPosts();
          } else {
            window.location.reload();
          }
        })
        .catch(function (error) {
          const message = error.response.data.message;
          failedMessage(message);
        });
    }
  });
}

window.deletePost = deletePost;
// function of request of create new post
function createPostRequest(formData) {
  const token = localStorage.getItem("token");
  const headers = {
    authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };

  axios
    .post(`${baseUrl}/posts`, formData, { headers: headers })
    .then(function (response) {
      closeCreatePostModal();
      successLogMessage("Create New Post");
      if (window.location.pathname.includes("index.html")) {
        getPosts();
      } else {
        window.location.reload();
      }
    })
    .catch(function (error) {
      const message = error.response.data.message;
      failedMessage(message);
    });
}
// function of create new post and edit the post
function createPost() {
  const id = editId;
  if (id == -1) {
    const formData = new FormData();
    formData.append("image", postImage.files[0]);
    formData.append("body", postBody.value);
    formData.append("title", postTitle.value);
    createPostRequest(formData);
  } else {
    updatePost();
  }
}
window.createPost = createPost;
// function of get user data from local storage after register
function userData() {
  if (localStorage.token) {
    const user = JSON.parse(localStorage.getItem("user"));
    return user;
  }
}

// function of edit post
function editPost(strPost) {
  const post = JSON.parse(decodeURIComponent(strPost));
  editId = post.id;
  let modalTitle = document.querySelector("#modal-title");
  modalTitle.innerHTML = "Edit Post";
  postBody.value = post.body;
  postTitle.value = post.title;
  let submitBtn = document.querySelector("#create-editBtn");
  submitBtn.innerHTML = "Edit";
  const myModal = new bootstrap.Modal(
    document.getElementById("createPostModal")
  );
  myModal.toggle();
}
window.editPost = editPost;
// function of modify modal close to make integration between create and edit post
function modalAction() {
  const myModal = document.getElementById("createPostModal");
  let submitBtn = document.querySelector("#create-editBtn");
  let modalTitle = document.querySelector("#modal-title");

  myModal.addEventListener("hidden.bs.modal", function () {
    editId = -1;
    submitBtn.innerHTML = "Create";
    modalTitle.innerHTML = "Create new post";
    postBody.value = "";
    postTitle.value = "";
  });
}
// function of profile show
function showProfile(id) {
  window.location.href = `/html/profile.html?userId=${id}`;
}
window.showProfile = showProfile;

export default {
  baseUrl,
  modifyUI,
  loginRequest,
  loginSubmit,
  logOutBtn,
  registerRequest,
  registerSubmit,
  closeLoginModal,
  closeCreatePostModal,
  closeRegisterModal,
  successLogMessage,
  failedMessage,
  userData,
  card,
  editPost,
  deletePost,
};
