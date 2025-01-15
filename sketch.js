var user;

$("document").ready(() => {
  $("#details").hide();
  $("#start").click(() => {
    $("#title").fadeOut(300, () => {
      $("#title, #details").toggleClass("d-none");
      $("#details").fadeIn(300);
    });
  });

  $("#submit").click(() => {
    user = $("#user").val();
    $("#name").fadeOut(300, () => {
      $("#name, #route").toggleClass("d-none");
      $("#route").fadeIn(300);
    });
  });
});