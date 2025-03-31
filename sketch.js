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

	$("#meet").click(() => {
		let text = `i don't drink or smoke, or drink tea or coffee for that matter. it's less about self restraint, but i've never enjoyed it. people find it unusual. i'm also not on any social media, which makes it difficult for me to connect with people because my lifestyle is so removed from the common. what about you? are you on social media?`;
		$("#invisible").text(text);
		$("#page-player").fadeOut(300, () => {
			$("#page-details, #page-chat").toggleClass("d-none");
			$("#window>div").toggleClass("talking");
			type(text);
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
		} else clearInterval(typing);
	}, 70);
}
