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
		setTimeout(() => {
			music.pause();
			$("#info-dialog").removeClass("d-none");
			info.play();
			info.addEventListener("ended", () => music.play());
		}, 100);
	});
	$("#back").click(() => {
		setTimeout(() => {
			$("#info-dialog").addClass("d-none");
			info.pause();
			info.currentTime = 0;
			music.play();
		}, 100);
	});
	$("#start").click(() => {
		$("#page-title").fadeOut(300, () => {
			$("#page-title, #page-name").toggleClass("d-none");
		});
	});

	$("#submit").click(() => {
		user = $("#user").val();
		$("#page-name").fadeOut(300, () => {
			$("#page-name, #page-player").toggleClass("d-none");
		});
	});

	// $("#talk").click(() => {
	// 	$("#page-details").fadeOut(300, () => {
	// 		$("#page-details, #chat").toggleClass("d-none");
	// 		$("#chat").fadeIn(300);
	// 	});
	// });
});
