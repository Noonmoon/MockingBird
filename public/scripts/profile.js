// used to prevent xss
var escape = function(unsafe) {
  return unsafe
   .replace(/&/g, "&amp;")
   .replace(/</g, "&lt;")
   .replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;")
   .replace(/'/g, "&#039;");
};



$(function () {
  var pList = $('#pl')
  posts.forEach(function(post) {
    var li = $('<li/>')
        .addClass('ui-menu-item')
        .attr('role', 'menuitem')
        .appendTo(pList);
    var aaa = $('<p/>')
        .addClass('ui-all')
        .text(post.text)
        .appendTo(li);
  })

  console.log(following)
  if (following) {
    $('#follo').html('unfollow')
    $('#follow').attr('action', `/user/unfollow/${name}`)
  } else {
    $('#follo').html('follow')
    $('#follow').attr('action', `/user/follow/${name}`)
  }

});

