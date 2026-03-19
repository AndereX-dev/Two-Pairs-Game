document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll("[data-view='card']");
  const secondsHtml = document.getElementById("seconds");
  const tenthsHtml = document.getElementById("tenths");
  const resetBtn = document.getElementById("reset-btn");

  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;
  let seconds = 0;
  let tenths = 0;
  let interval;

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
    if (allCorrect === cards.length) {
      stopTimer();
      setTimeout(() => {
        alert(`Congratulation! You used ${seconds}:${tenths} seconds.`);
      }, 500);
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

    setTimeout(shuffle, 500);
  });

  cards.forEach((card) => card.addEventListener("click", flipcard));

  shuffle();
});
