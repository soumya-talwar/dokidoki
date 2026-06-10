class Game {
	constructor() {
		this.audio = {
			music: new Audio("audio/bgm.mp3"),
			transition: new Audio("audio/transition.mp3"),
			button: new Audio("audio/button.mp3"),
		};
		this.audio.music.volume = 0.3;

		this.state = {
			parameters: {},
			messages: [],
			answers: [],
			messageIndex: -1,
			win: undefined,
			score: 0,
			report: "",
		};
	}

	loadDialogue() {
		return fetch("data/chat.json")
			.then((response) => response.json())
			.then((data) => {
				this.state.messages = data.messages;
			});
	}

	bindEvents() {
		$("#play").click(() => {
			this.audio.music.play();
			this.audio.music.loop = true;
			$("#permission").addClass("d-none");
			$("#background").css("opacity", "100%");
		});

		$(".button").click(() => this.audio.button.play());

		$("#info").click(() => {
			setTimeout(() => $("#info-dialog").removeClass("d-none"), 100);
		});

		$("#back").click(() => {
			setTimeout(() => {
				$("#info-dialog").addClass("d-none");
			}, 100);
		});

		$("#start").click(() => {
			$("#page-title").fadeOut(300, () => {
				$("#page-title, #page-name").toggleClass("d-none");
			});
		});

		$("#submit").click(() => {
			this.state.parameters.user = $("#user").val();
			$("#page-name").fadeOut(300, () => {
				$("#page-name, #page-player").toggleClass("d-none");
			});
		});

		$("#meet").click(() => this.startGame());

		$("#reply").click(() => {
			$("#speaking").fadeOut(300, () => {
				this.showOptions();
				$("#waiting").removeClass("d-none");
				$("#reply").addClass("d-none");
				$("#waiting").show();
				this.audio.music.play();
			});
		});

		$("#share1").click(() => {
			this.buildShareReport();
			emailjs.send("service_hjqw7g4", "template_gcipkel", {
				name: this.state.parameters.user,
				phone: $("#phone").val(),
				message: $("#message1").val(),
				occupation: this.state.parameters.occupation,
				age: this.state.parameters.age,
				status: this.state.parameters.status,
				hobbies: this.state.parameters.hobbies,
				anime: this.state.parameters.anime
					? this.state.parameters.anime
					: "n/a",
				score: this.state.score,
				answers: this.state.report,
			});
			this.showEndScreen();
		});

		$("#share2").click(() => {
			emailjs.send("service_hjqw7g4", "template_kfpy5hf", {
				name: this.state.parameters.user,
				message: $("#message2").val(),
				occupation: this.state.parameters.occupation,
				age: this.state.parameters.age,
				status: this.state.parameters.status,
				hobbies: this.state.parameters.hobbies,
				score: this.state.score,
				answers: this.state.report,
			});
			this.showEndScreen();
		});
	}

	startGame() {
		$("#invisible").text(
			`hi ${this.state.parameters.user}! how are you? how was your weekend?`,
		);
		$("#page-player").fadeOut(300, () => {
			this.audio.music.pause();
			this.audio.music.currentTime = 0;
			setTimeout(() => {
				this.audio.transition.play();
				$("#page-details, #page-chat").toggleClass("d-none");
				this.setWindowBackground("url(images/chat2.gif)");
				this.audio.transition.addEventListener("ended", () =>
					this.advanceDialogue(),
				);
			}, 100);
		});
	}

	advanceDialogue() {
		this.setWindowBackground("url(images/chat1.gif)");
		this.state.messageIndex++;

		const { messages, messageIndex } = this.state;

		if (messageIndex < messages.length) {
			const message = messages[messageIndex];

			if (!message.condition) {
				this.showMessage(message);
				return;
			}

			this.evaluateScore();

			if (message.condition == "win" && this.state.win) {
				this.showMessage(message);
			} else {
				this.showEnding("feedback");
			}
			return;
		}

		if (this.state.win) {
			this.showEnding("win");
		} else {
			this.showEnding("feedback");
		}
	}

	showMessage(message) {
		const text = this.resolveMessageText(message);
		$("#visible, #invisible").html("");
		$("#invisible").html(text);
		this.typeDialogue(text);
	}

	showOptions() {
		const message = this.state.messages[this.state.messageIndex];
		const options = this.getOptionsForMessage(message);

		$("#waiting").html("");

		for (let i = 0; i < options.length; i++) {
			if (options[i].field) {
				$("#waiting").append(`
        <div class="response2">
          <input type="text" class="field" id="${message.question}" />
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

		$(".response").click((event) => {
			this.recordAnswer({ optionIndex: $(event.currentTarget).index() });
		});

		$("#reply2").click(() => {
			this.recordAnswer({ field: true });
		});
	}

	recordAnswer({ optionIndex, field }) {
		const message = this.state.messages[this.state.messageIndex];
		const answer = { question: message.question, weight: message.weight };

		if (field) {
			const question = message.question;
			if (question == "anime") answer.point = 1;
			answer.value = $(`#${question}`).val();
			this.state.parameters[question] = answer.value;
		} else {
			this.audio.button.play();
			const prevIndex = this.getPreviousOptionIndex();
			answer.option = {
				index: optionIndex,
				text: message.options[prevIndex][optionIndex].text,
				point: message.options[prevIndex][optionIndex].point,
			};
		}

		this.state.answers.push(answer);

		$("#waiting").fadeOut(300, () => {
			this.advanceDialogue();
			$("#speaking").show();
		});
	}

	evaluateScore() {
		this.state.score = 0;

		for (const answer of this.state.answers) {
			if (answer.option) {
				this.state.score += answer.option.point * answer.weight;
			}
		}

		this.state.win = this.state.score > 0;
	}

	showEnding(type) {
		if (type === "win") {
			$("#speech, #details").toggleClass("d-none");
			this.typeEnding($("#invisible1").text(), "visible1", "invisible1");
		} else {
			$("#speech, #feedback").toggleClass("d-none");
			this.setWindowBackground("url(images/chat5.gif)");
			this.typeEnding($("#invisible2").text(), "visible2", "invisible2");
		}
	}

	buildShareReport() {
		this.state.report = "";
		this.state.score = 0;

		for (let answer of this.state.answers) {
			if (answer.option) {
				this.state.report +=
					answer.question + " : " + answer.option.text + "\n\n";
				this.state.score += answer.option.point * answer.weight;
			} else if (answer.point) {
				this.state.score += answer.point * answer.weight;
			}
		}
	}

	resolveMessageText(message) {
		let text;

		if (message.message.length == 1) {
			text = message.message[0];
		} else {
			text =
				message.message[
					this.state.answers[this.state.messageIndex - 1].option.index
				];
		}

		const matches = /<([^>]+)>/g.exec(text);
		if (matches) {
			text = text.replace(matches[0], this.state.parameters[matches[1]]);
		}

		return text;
	}

	getOptionsForMessage(message) {
		if (message.options.length == 1) return message.options[0];
		return message.options[
			this.state.answers[this.state.messageIndex - 1].option.index
		];
	}

	getPreviousOptionIndex() {
		const message = this.state.messages[this.state.messageIndex];
		if (message.options.length == 1) return 0;
		return this.state.answers[this.state.messageIndex - 1].option.index;
	}

	setWindowBackground(url) {
		$("#window>div").css("background-image", url);
	}

	typeDialogue(text) {
		this.typeText(text, "visible", "invisible", () => {
			this.setWindowBackground("url(images/chat2.gif)");
			$("#reply").removeClass("d-none");
		});
	}

	typeEnding(text, visibleId, invisibleId) {
		this.typeText(text, visibleId, invisibleId, () => {
			this.setWindowBackground(`url(images/chat${this.state.win ? 3 : 4}.gif)`);
			$(".inputs").removeClass("hidden");
		});
	}

	typeText(text, visibleId, invisibleId, onComplete) {
		this.audio.music.pause();
		this.audio.music.currentTime = 0;

		let i = 0;
		const typing = setInterval(() => {
			if (i <= text.length) {
				$(`#${visibleId}`).text(text.substring(0, i));
				$(`#${invisibleId}`).text(text.substring(i, text.length));
				i++;
			} else {
				onComplete();
				clearInterval(typing);
			}
		}, 50);
	}

	showEndScreen() {
		$("#page-chat, #page-end").toggleClass("d-none");
		this.audio.music.play();
		$("#window>div").css("background-size", "135%");
		$("#window>div").css("background-position", "50% 90%");
	}
}

const game = new Game();

game.loadDialogue();

$("document").ready(() => {
	game.bindEvents();
});
