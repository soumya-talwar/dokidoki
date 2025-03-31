var user, music, info, chat, button;
var message;

$("document").ready(() => {
	music = new Audio("audio/bgm.mp3");
	music.volume = 0.3;
	info = new Audio("audio/info.m4a");
	chat = new Audio("audio/chat.mp3");
	button = new Audio("audio/button.mp3");
	message = new Audio("audio/message1.m4a");
	$("#play").click(() => {
		music.play();
		music.loop = true;
		$("#permission").addClass("d-none");
		$("#background").css("opacity", "100%");
	});
	$(".button").click(() => button.play());
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

	$("#meet").click(() => {
		let text = `hi ${user}! how are you? how was your weekend?`;
		$("#invisible").text(text);
		$("#page-player").fadeOut(300, () => {
			music.pause();
			music.currentTime = 0;
			setTimeout(() => {
				chat.play();
				$("#page-details, #page-chat").toggleClass("d-none");
				$("#window>div").css("background-image", "url(images/chat2.gif)");
				chat.addEventListener("ended", () => {
					$("#window>div").css("background-image", "url(images/chat1.gif)");
					message.play();
					type(text);
				});
			}, 100);
		});
	});

	$("#reply").click(() => {
		$("#speaking").fadeOut(300, () => {
			$("#speaking, #waiting").toggleClass("d-none");
			music.play();
		});
	});
});

function type(text) {
	let i = 0;
	let typing = setInterval(() => {
		if (i <= text.length) {
			$("#visible").text(text.substring(0, i));
			$("#invisible").text(text.substring(i, text.length));
			i++;
		} else {
			$("#window>div").css("background-image", "url(images/chat2.gif)");
			$("#reply").removeClass("d-none");
			clearInterval(typing);
		}
	}, 70);
}
