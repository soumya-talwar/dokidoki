var user;

$("document").ready(() => {
	var music = new Audio("audio/bgm.mp3");
	$("#play").click(() => {
		music.play();
		$("#permission").addClass("d-none");
		$("#background").css("opacity", "100%");
	});
	var info = new Audio("audio/info.m4a");
	$("#details").hide();
	$("#info").click(() => info.play());
	// $("#start").click(() => {
	// 	$("#page-title").fadeOut(300, () => {
	// 		$("#page-title, #page-details").toggleClass("d-none");
	// 		$("#page-details").fadeIn(300);
	// 	});
	// });

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
