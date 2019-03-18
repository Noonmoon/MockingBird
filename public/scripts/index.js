// used to prevent xss
var escape = function(unsafe) {
  return unsafe
   .replace(/&/g, "&amp;")
   .replace(/</g, "&lt;")
   .replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;")
   .replace(/'/g, "&#039;");
 };

if (auth) {
  function createPostElement(post, escape) {
    var $post =
      `<div class="col-lg-4">
        <a class="btn postcard" href='#' role='button'>
          <img class="rounded-circle float-left" src='data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==' width='100' height='100'>
          <h2>${post.user_id}</h2>
          <p>
            ${escape(post.text)}
          </p>
        </a>
      </div>`;
    return $post;
  }
  console.log(auth)

  $(function () {

    // forms new post
    function renderPosts(posts) {
      posts.forEach(function(post) {
        var $post = createPostElement(post, escape);
        $('#newsfeed').prepend($post);
      });
    }

    // grabs and renders all current tweets
    function grabPosts() {
      $.get(`/post/${auth}`, function(data) {
        renderPosts(data);
      });
    }
    grabPosts();


  });
}