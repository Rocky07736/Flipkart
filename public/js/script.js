const startingMinutes = 50;
let time = startingMinutes * 60;

const timer = document.getElementById('timer');

setInterval(updateCountdown, 1000);

function updateCountdown() {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    timer.innerHTML = `${minutes}:${seconds}`;

    time--;

    // 🔁 Restart when timer reaches 00:00
    if (time < 0) {
        time = startingMinutes * 60;
    }
}
