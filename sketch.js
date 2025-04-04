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
var score = 0;
var report = "";

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
		$("#invisible").text(
			`hi ${parameters.user}! how are you? how was your weekend?`
		);
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
		$("#speaking").fadeOut(300, () => {
			wait();
			$("#waiting").removeClass("d-none");
			$("#reply").addClass("d-none");
			$("#waiting").show();
			music.play();
		});
	});

	$("#recommend").click(() => {
		parameters.anime = $("#anime").val();
	});

	$("#share1").click(() => {
		report = "";
		score = 0;
		for (let answer of answers) {
			if (answer.option) {
				report = report + answer.question + " : " + answer.option.text + "\n\n";
				score += answer.option.point * answer.weight;
			} else if (answer.point) score += answer.point * answer.weight;
		}
		emailjs.send("service_hjqw7g4", "template_gcipkel", {
			name: parameters.user,
			phone: $("#phone").val(),
			message: $("#message1").val(),
			occupation: parameters.occupation,
			anime: parameters.anime ? parameters.anime : "n/a",
			score: score,
			answers: report,
		});
		$("#page-chat, #page-end").toggleClass("d-none");
		music.play();
		$("#window>div").css("background-size", "135%");
		$("#window>div").css("background-position", "50% 90%");
	});
	$("#share2").click(() => {
		emailjs.send("service_hjqw7g4", "template_kfpy5hf", {
			name: parameters.user,
			message: $("#message2").val(),
			occupation: parameters.occupation,
			score: score,
			answers: report,
		});
		$("#page-chat, #page-end").toggleClass("d-none");
		music.play();
		$("#window>div").css("background-size", "135%");
		$("#window>div").css("background-position", "50% 90%");
	});
});

function speak() {
	$("#window>div").css("background-image", "url(images/chat1.gif)");
	index++;
	if (index < data.length) {
		let message = data[index];
		if (!message.condition) {
			let text;
			$("#visible, #invisible").html("");
			if (message.message.length == 1) {
				text = message.message[0];
			} else {
				text = message.message[answers[index - 1].option.index];
			}
			let matches = /<([^>]+)>/g.exec(text);
			if (matches) text = text.replace(matches[0], parameters[matches[1]]);
			$("#invisible").html(text);
			type(text);
		} else {
			evaluate();
			if (message.condition == "win" && win) {
				let text;
				$("#visible, #invisible").html("");
				if (message.message.length == 1) {
					text = message.message[0];
				} else {
					text = message.message[answers[index - 1].option.index];
				}
				let matches = /<([^>]+)>/g.exec(text);
				if (matches) text = text.replace(matches[0], parameters[matches[1]]);
				$("#invisible").html(text);
				type(text);
			} else {
				$("#speech, #feedback").toggleClass("d-none");
				$("#window>div").css("background-image", "url(images/chat5.gif)");
				type2($("#invisible2").text(), "visible2", "invisible2");
			}
		}
	} else {
		if (win) {
			$("#speech, #details").toggleClass("d-none");
			type2($("#invisible1").text(), "visible1", "invisible1");
		} else {
			$("#speech, #feedback").toggleClass("d-none");
			$("#window>div").css("background-image", "url(images/chat5.gif)");
			type2($("#invisible2").text(), "visible2", "invisible2");
		}
	}
}

function wait() {
	let options;
	if (data[index].options.length == 1) options = data[index].options[0];
	else options = data[index].options[answers[index - 1].option.index];
	$("#waiting").html("");
	for (let i = 0; i < options.length; i++) {
		if (options[i].field) {
			$("#waiting").append(`
        <div class="response2">
          <div class="phrase">
            <div class="icon">
              <img src="images/heart1.png" />
            </div>
            <div class="text">
              <p>${options[i].text}</p>
            </div>
          </div>
          <input type="text" class="field" placeholder="${data[index].question}" id="${data[index].question}" />
          <button class="button" id="reply2">reply</button>
        </div>`);
		} else {
			$("#waiting").append(`
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
		$("#waiting").fadeOut(300, () => {
			speak();
			$("#speaking").show();
		});
	});

	$("#reply2").click(function () {
		let answer = {};
		let question;
		question = data[index].question;
		answer.question = question;
		if (question == "anime") answer.point = 1;
		answer.value = $(".field").eq(1).val();
		answer.weight = data[index].weight;
		answers.push(answer);
		parameters[question] = answer.value;
		$("#waiting").fadeOut(300, () => {
			speak();
			$("#speaking").show();
		});
	});
}

function type(text) {
	music.pause();
	music.currentTime = 0;
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
	}, 50);
}

function type2(text, visible, invisible) {
	music.pause();
	music.currentTime = 0;
	let i = 0;
	let typing = setInterval(() => {
		if (i <= text.length) {
			$(`#${visible}`).text(text.substring(0, i));
			$(`#${invisible}`).text(text.substring(i, text.length));
			i++;
		} else {
			$("#window>div").css(
				"background-image",
				`url(images/chat${win ? 3 : 4}.gif)`
			);
			$(".inputs").removeClass("hidden");
			clearInterval(typing);
		}
	}, 50);
}

function evaluate() {
	for (let answer of answers) {
		if (answer.option) score += answer.option.point * answer.weight;
	}
	if (score > 0) win = true;
	else win = false;
}
