const CORRECT_LOGIN = "23сентября";
const CORRECT_PASSWORD = "26марта";

const loginScreen = document.getElementById("login-screen");
const giftScreen = document.getElementById("gift-screen");

const loginInput = document.getElementById("login");
const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("login-button");
const errorMessage = document.getElementById("error-message");

const song = document.getElementById("song");
const playButton = document.getElementById("play-button");

const progressContainer =
    document.getElementById("progress-container");

const progressBar =
    document.getElementById("progress-bar");

const currentTimeElement =
    document.getElementById("current-time");

const durationElement =
    document.getElementById("duration");

const finalMessage =
    document.getElementById("final-message");


/* =========================
   ВХОД НА САЙТ
   ========================= */

function openGift() {

    const enteredLogin = loginInput.value.trim();
    const enteredPassword = passwordInput.value.trim();

    if (
        enteredLogin === CORRECT_LOGIN &&
        enteredPassword === CORRECT_PASSWORD
    ) {

        errorMessage.textContent = "";

        loginScreen.classList.add("hidden");
        giftScreen.classList.remove("hidden");

    } else {

        errorMessage.textContent =
            "Логин или пароль введены неправильно 🤍";

        passwordInput.value = "";
    }
}

loginButton.addEventListener("click", openGift);


/* =========================
   ВХОД ПО ENTER
   ========================= */

passwordInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        openGift();
    }

});

loginInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        openGift();
    }

});


/* =========================
   ВОСПРОИЗВЕДЕНИЕ ПЕСНИ
   ========================= */

playButton.addEventListener("click", function() {

    if (song.paused) {

        song.play()
            .then(function() {

                playButton.textContent = "❚❚";

            })
            .catch(function(error) {

                console.error(
                    "Ошибка воспроизведения:",
                    error
                );

                alert(
                    "Не удалось загрузить песню 😔"
                );

            });

    } else {

        song.pause();

        playButton.textContent = "▶️";
    }

});


/* =========================
   ПРОВЕРКА ЗАГРУЗКИ ПЕСНИ
   ========================= */

song.addEventListener("error", function() {

    console.error(
        "Не удалось загрузить song.mp3"
    );

    alert(
        "Сайт не смог найти файл песни 😔"
    );

});


/* =========================
   ДЛИТЕЛЬНОСТЬ ПЕСНИ
   ========================= */

song.addEventListener("loadedmetadata", function() {

    durationElement.textContent =
        formatTime(song.duration);

});


/* =========================
   ПРОГРЕСС ПЕСНИ
   ========================= */

song.addEventListener("timeupdate", function() {

    if (!song.duration) return;

    const progress =
        (song.currentTime / song.duration) * 100;

    progressBar.style.width =
        progress + "%";

    currentTimeElement.textContent =
        formatTime(song.currentTime);

});


/* =========================
   ПЕРЕМОТКА ПАЛЬЦЕМ И МЫШКОЙ
   ========================= */

let isSeeking = false;

function seekSong(clientX) {

    if (!song.duration) return;

    const rect =
        progressContainer.getBoundingClientRect();

    let position =
        clientX - rect.left;

    position =
        Math.max(0, Math.min(position, rect.width));

    const percentage =
        position / rect.width;

    song.currentTime =
        percentage * song.duration;
}


/* Касание пальцем */

progressContainer.addEventListener(
    "touchstart",
    function(event) {

        isSeeking = true;

        seekSong(event.touches[0].clientX);

        event.preventDefault();

    },
    { passive: false }
);progressContainer.addEventListener(
    "touchmove",
    function(event) {

        if (!isSeeking) return;

        seekSong(event.touches[0].clientX);

        event.preventDefault();

    },
    { passive: false }
);


progressContainer.addEventListener(
    "touchend",
    function() {

        isSeeking = false;

    }
);


/* Мышь на компьютере */

progressContainer.addEventListener(
    "mousedown",
    function(event) {

        isSeeking = true;

        seekSong(event.clientX);

    }
);


document.addEventListener(
    "mousemove",
    function(event) {

        if (!isSeeking) return;

        seekSong(event.clientX);

    }
);


document.addEventListener(
    "mouseup",
    function() {

        isSeeking = false;

    }
);


/* =========================
   ОКОНЧАНИЕ ПЕСНИ
   ========================= */

song.addEventListener("ended", function() {

    playButton.textContent = "▶️";

    progressBar.style.width = "0%";

    currentTimeElement.textContent = "00:00";

    finalMessage.classList.add("visible");

});


/* =========================
   ФОРМАТ ВРЕМЕНИ
   ========================= */

function formatTime(seconds) {

    if (!isFinite(seconds)) {
        return "00:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0")
    );

}