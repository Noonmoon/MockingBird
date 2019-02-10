// used to prevent xss
var escape = function(unsafe) {
  return unsafe
   .replace(/&/g, "&amp;")
   .replace(/</g, "&lt;")
   .replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;")
   .replace(/'/g, "&#039;");
 };

console.log(name)
console.log(posts[0].text)

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

});