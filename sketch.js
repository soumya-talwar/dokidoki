var user;

$("document").ready(() => {
	$("#details").hide();
	$("#start").click(() => {
		$("#page-title").fadeOut(300, () => {
			$("#page-title, #page-details").toggleClass("d-none");
			$("#page-details").fadeIn(300);
		});
	});

	$("#submit").click(() => {
		user = $("#user").val();
		$("#name").fadeOut(300, () => {
			$("#name, #route").toggleClass("d-none");
			$("#route").fadeIn(300);
		});
	});

	$("#talk").click(() => {
		$("#page-details").fadeOut(300, () => {
			$("#page-details, #chat").toggleClass("d-none");
			$("#chat").fadeIn(300);
		});
	});
});
