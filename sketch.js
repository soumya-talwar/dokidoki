var music = new Audio("audio/bgm.mp3");
music.volume = 0.3;
var info = new Audio("audio/info.m4a");
var transition = new Audio("audio/transition.mp3");
var button = new Audio("audio/button.mp3");
var recordings = [];

var parameters = {};
var data = [];
var answers = [];
var points = [];
var index = -1;
var win = undefined;
var winindex = 1;
var loseindex = 1;

fetch("data/chat.json")
	.then((response) => response.json())
	.then((messages) => {
		data = messages.messages;
	});

$("document").ready(() => {
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
		parameters.user = $("#user").val();
		$("#page-name").fadeOut(300, () => {
			$("#page-name, #page-player").toggleClass("d-none");
		});
	});

	$("#meet").click(() => {
		$(".invisible")
			.eq(0)
			.text(`hi ${parameters.user}! how are you? how was your weekend?`);
		$("#page-player").fadeOut(300, () => {
			music.pause();
			music.currentTime = 0;
			setTimeout(() => {
				transition.play();
				$("#page-details, #page-chat").toggleClass("d-none");
				$("#window>div").css("background-image", "url(images/chat2.gif)");
				transition.addEventListener("ended", () => speak());
			}, 100);
		});
	});

	$("#reply").click(() => {
		$(".speaking")
			.eq(0)
			.fadeOut(300, () => {
				wait();
				$(".waiting").eq(0).removeClass("d-none");
				$("#reply").addClass("d-none");
				$(".waiting").eq(0).show();
				music.play();
			});
	});

	$(".win").click(() => {
		let screens = $(".win-screen").length;
		if (winindex < screens) {
			$(".win-screen").addClass("d-none");
			$(".win-screen").eq(winindex).removeClass("d-none");
			if (winindex == 2) {
				$("#window>div").css("background-image", "url(images/chat1.gif)");
				type($(".feedback .invisible").eq(0).text(), 2);
			}
			winindex++;
		}
	});

	$("#recommend").click(() => {
		parameters.anime = $("#anime").val();
	});

	$("#contact").click(() => {
		emailjs.send("service_hjqw7g4", "template_gcipkel", {
			name: "madara",
			phone: $("#phone").val(),
			message: $("#message").val(),
		});
		$("#page-win, #page-end").toggleClass("d-none");
	});
});

function speak() {
	$("#window>div").css("background-image", "url(images/chat1.gif)");
	index++;
	let message = data[index];
	let text;
	$(".visible").eq(0).html("");
	$(".invisible").eq(0).html("");
	if (message.message.length == 1) {
		text = message.message[0];
	} else {
		text = message.message[answers[index - 1].option.index];
	}
	let matches = /<([^>]+)>/g.exec(text);
	if (matches) text = text.replace(matches[0], parameters[matches[1]]);
	$(".invisible").eq(0).html(text);
	type(text, 0);
}

function wait() {
	let options;
	if (data[index].options.length == 1) options = data[index].options[0];
	else options = data[index].options[answers[index - 1].option.index];
	$(".waiting").eq(0).html("");
	for (let i = 0; i < options.length; i++) {
		if (options[i].field) {
			$(".waiting").eq(0).append(`
        <div class="response2">
          <div class="phrase">
            <div class="icon">
              <img src="images/heart1.png" />
            </div>
            <div class="text">
              <p>${options[i].text}</p>
            </div>
          </div>
          <input type="text" class="" placeholder="${data[index].question}" id="${data[index].question}" />
          <button class="button" id="job">reply</button>
        </div>`);
		} else {
			$(".waiting").eq(0).append(`
        <div class="response">
          <div class="icon">
            <img src="images/heart1.png" />
          </div>
          <div class="text">
            <p>${options[i].text}</p>
          </div>
        </div>`);
		}
	}
	$(".response").click(function () {
		button.play();
		let answer = {};
		let prev = 0;
		answer.question = data[index].question;
		answer.option = {};
		let index2 = $(this).index();
		answer.option.index = index2;
		if (data[index].options.length == 1) prev = 0;
		else prev = answers[index - 1].option.index;
		answer.option.text = data[index].options[prev][index2].text;
		answer.option.point = data[index].options[prev][index2].point;
		answer.weight = data[index].weight;
		answers.push(answer);
		$(".waiting")
			.eq(0)
			.fadeOut(300, () => {
				speak();
				$(".speaking").eq(0).show();
				music.pause();
				music.currentTime = 0;
			});
	});

	$("#job").click(() => {
		button.play();
		parameters.job = $("#job").val();
		$("#page-chat").fadeOut(300, () => {
			win = true;
			// if (win) {
			$("#page-chat, #page-win").toggleClass("d-none");
			type($(".win-screen").eq(0).find(".invisible").text(), 1);
			$("#window>div").css("background-image", "url(images/chat1.gif)");
			// }
			// else $("#page-chat, #page-lose").toggleClass("d-none");
		});
	});
}

function type(text, index) {
	let i = 0;
	let typing = setInterval(() => {
		if (i <= text.length) {
			$(".visible").eq(index).text(text.substring(0, i));
			$(".invisible").eq(index).text(text.substring(i, text.length));
			i++;
		} else {
			$("#window>div").css(
				"background-image",
				`url(images/chat${index < 2 ? 2 : index + 1}.gif)`
			);
			if (index < 2)
				$(`${index == 0 ? "#reply" : "#reply" + index}`).removeClass("d-none");
			else $(".form").removeClass("invisible");
			clearInterval(typing);
		}
	}, 10);
}
