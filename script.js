document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  const secondsHtml = document.getElementById("seconds");
  const tenthsHtml = document.getElementById("tenths");
  const resetBtn = document.getElementById("reset-btn");

  const allIcons = [
    "git",
    "html",
    "python",
    "javascript",
    "css",
    "java",
    "php",
    "react",
    "go",
    "csharp",
    "cplusplus",
    "nextjs",
    "ruby",
    "nodejs",
    "ubuntu",
  ];

  let firstCard, secondCard;
  let hasFlippedCard = false;
  let lockBoard = false;
  let seconds = 0;
  let tenths = 0;
  let interval;
  let currentPairs = 15;

  function createBoard(numberOfPairs) {
    container.innerHTML = "";
  }

  function flipcard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flipped");

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      startTimer();
      return;
    }
    secondCard = this;
    checkForMatch();
  }

  function checkForMatch() {
    let isMatch = firstCard.dataset.item === secondCard.dataset.item;
    isMatch ? disableCards() : unflipCards();
  }

  function disableCards() {
    firstCard.classList.add("correct");
    secondCard.classList.add("correct");

    firstCard.removeEventListener("click", flipcard);
    secondCard.removeEventListener("click", flipcard);

    resetBoard();
    checkWin();
  }

  function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetBoard();
    }, 1000);
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  function shuffle() {
    cards.forEach((card) => {
      let randomPos = Math.floor(Math.random() * 20);
      card.style.order = randomPos;
    });
  }

  function startTimer() {
    if (interval) return;
    interval = setInterval(() => {
      tenths++;
      if (tenths > 99) {
        seconds++;
        tenths = 0;
      }
      secondsHtml.innerHTML = seconds < 10 ? "0" + seconds : seconds;
      tenthsHtml.innerHTML = tenths < 10 ? "0" + tenths : tenths;
    }, 10);
  }

  function stopTimer() {
    clearInterval(interval);
    interval = null;
  }

  function checkWin() {
    const allCorrect = document.querySelectorAll(".correct").length;
    const totalCards = document.querySelectorAll("[data-view='card']").length;

    console.log(`Status: ${allCorrect} of ${totalCards} found`);

    if (allCorrect === totalCards && totalCards > 0) {
      stopTimer();
      const finalScore = `${seconds}:${tenths}`;

      setTimeout(() => {
        document.getElementById("finalTime").innerText = finalScore;
        document.getElementById("nameModal").style.display = "flex";
      }, 600);
    }
  }

  resetBtn.addEventListener("click", () => {
    stopTimer();
    seconds = 0;
    tenths = 0;
    secondsHtml.innerHTML = "00";
    tenthsHtml.innerHTML = "00";

    cards.forEach((card) => {
      card.classList.remove("flipped", "correct");
      card.addEventListener("click", flipcard);
    });
    resetBoard();
    setTimeout(shuffle, 500);
  });

  document.getElementById("saveScoreBtn").addEventListener("click", () => {
    const name = document.getElementById("playerName").value || "Anonym";
    const time = document.getElementById("finalTime").innerText;

    const highscores =
      JSON.parse(localStorage.getItem("memoryHighscores")) || [];
    highscores.push({ name, time, rawTime: seconds * 100 + tenths });
    highscores.sort((a, b) => a.rawTime - b.rawTime);

    localStorage.setItem(
      "memoryHighscores",
      JSON.stringify(highscores.slice(0, 10)),
    );
    window.location.href = "highscores.html";
  });

  cards.forEach((card) => card.addEventListener("click", flipcard));

  shuffle();
});
