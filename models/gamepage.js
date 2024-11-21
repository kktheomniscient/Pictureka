document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.querySelector(".overlay");
    const alertBox = document.querySelector(".alert");
    const startButton = document.querySelector(".start-btn");
    const countdownElement = document.querySelector(".countdown");
    const cards = document.querySelectorAll(".card");
    const hirenScore = document.querySelector(".score:nth-child(1) p:nth-child(2)");
    const otherPlayers = document.querySelectorAll(".score:not(:first-child) p:nth-child(2)");
    const questionText = document.querySelector(".question-text");
    const missionWord = document.querySelector(".word");
    const frontFaces = document.querySelectorAll(".front-face img");
    const backFaces = document.querySelectorAll(".back-face img");
    const settings = document.querySelector(".settings");

    let countdown = 30;
    let hirenScoreCount = 0;
    let currentQuestionIndex = 0;

    const questions = [
        {
            mission: "Penguin",
            images: ["./assets/images/lion.png", "./assets/images/penguin.png", "./assets/images/rat.png"],
            answerIndex: 1,
        },
        {
            mission: "Deer",
            images: ["./assets/images/deer.png", "./assets/images/monkey.png", "./assets/images/bear.png"],
            answerIndex: 0,
        },
        {
            mission: "Lion",
            images: ["./assets/images/lion.png", "./assets/images/monkey.png", "./assets/images/elephant.png"],
            answerIndex: 0,
        },
        {
            mission: "Elephant",
            images: ["./assets/images/penguin.png", "./assets/images/deer.png", "./assets/images/elephant.png"],
            answerIndex: 2,
        },
        {
            mission: "Rat",
            images: ["./assets/images/lion.png", "./assets/images/rat.png", "./assets/images/deer.png"],
            answerIndex: 1,
        },
        {
            mission: "Bear",
            images: ["./assets/images/deer.png", "./assets/images/elephant.png", "./assets/images/bear.png"],
            answerIndex: 2,
        },
    ];

    function showAlert(message, isSuccess = true) {
        const alertMessage = document.createElement("div");
        alertMessage.textContent = message;
        alertMessage.style.position = "fixed";
        alertMessage.style.top = "50%";
        alertMessage.style.left = "50%";
        alertMessage.style.transform = "translate(-50%, -50%)";
        alertMessage.style.backgroundColor = isSuccess ? "green" : "red";
        alertMessage.style.color = "white";
        alertMessage.style.padding = "1rem";
        alertMessage.style.borderRadius = "0.5rem";
        alertMessage.style.zIndex = "100";
        document.body.appendChild(alertMessage);

        setTimeout(() => {
            alertMessage.remove();
        }, 2000);
    }

    function startCountdown() {
        const timerInterval = setInterval(() => {
            countdown -= 1;
            countdownElement.textContent = `0:${countdown.toString().padStart(2, '0')}`;
            if (countdown <= 0) {
                clearInterval(timerInterval);
                countdownElement.textContent = "Time's up!";
                showAlert("Time's up! Restarting the game...", false);
                setTimeout(() => {
                    location.reload(); 
                }, 3000);
            }
        }, 1000);
    }

    function increaseOtherScores() {
        otherPlayers.forEach((playerScore) => {
            const interval = Math.floor(Math.random() * 8000) + 4000;
            const intervalId = setInterval(() => {
                const currentScore = parseInt(playerScore.textContent, 10);
                if (currentScore < 5) {
                    playerScore.textContent = currentScore + 1;
                } else {
                    clearInterval(intervalId);
                }
            }, interval);
        });
    }

    function updateQuestion() {
        currentQuestionIndex += 1;

        if (currentQuestionIndex < questions.length) {
            const { mission, images } = questions[currentQuestionIndex];

            missionWord.textContent = mission;
            frontFaces.forEach((img) => {
                img.src = "./assets/images/image.png";
            });
            backFaces.forEach((img, index) => {
                img.src = images[index];
            });
        } else {
            showAlert("All questions completed!", true);
            setTimeout(() => {
                location.reload(); 
            }, 3000);
        }
    }

    cards.forEach((card, index) => {
        card.addEventListener("click", () => {
            const { answerIndex } = questions[currentQuestionIndex];

            if (index === answerIndex) {
                hirenScoreCount += 1;
                hirenScore.textContent = hirenScoreCount;
                showAlert("Correct Answer!", true);
                updateQuestion();
            } else {
                showAlert("Wrong Answer!", false);
            }
        });
    });

    settings.addEventListener('click', () => {
        window.location.href = '/settings';
    });

    startButton.addEventListener("click", () => {
        overlay.classList.add("hidden");
        alertBox.classList.add("hidden");

        setTimeout(() => {
            alertBox.style.display = "none";
        }, 500);

        startCountdown();
        increaseOtherScores();
    });
});
