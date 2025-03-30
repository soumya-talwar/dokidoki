var user;

$("document").ready(() => {
	var music = new Audio("audio/bgm.mp3");
	$("#play").click(() => {
		music.play();
		music.loop = true;
		$("#permission").addClass("d-none");
		$("#background").css("opacity", "100%");
	});
	var info = new Audio("audio/info.m4a");
	$("#info").click(() => {
		music.pause();
		$("#info-dialog").removeClass("d-none");
		info.play();
		info.addEventListener("ended", () => music.play());
	});
	$("#back").click(() => {
		$("#info-dialog").addClass("d-none");
		info.pause();
		info.currentTime = 0;
		music.play();
	});
	// $("#start").click(() => {
	// 	$("#page-title").fadeOut(300, () => {
	// 		$("#page-title, #page-details").toggleClass("d-none");
	// 		$("#page-details").fadeIn(300);
	// 	});
	// });

	// $("#submit").click(() => {
	// 	user = $("#user").val();
	// 	$("#name").fadeOut(300, () => {
	// 		$("#name, #route").toggleClass("d-none");
	// 		$("#route").fadeIn(300);
	// 	});
	// });

	// $("#talk").click(() => {
	// 	$("#page-details").fadeOut(300, () => {
	// 		$("#page-details, #chat").toggleClass("d-none");
	// 		$("#chat").fadeIn(300);
	// 	});
	// });
});
