document.addEventListener("DOMContentLoaded", function() {
    // Получаем список оферов из URL
    const urlParams = new URLSearchParams(window.location.search);
    var text = urlParams.get("htext");
    var src = urlParams.get("himage");
    if (text) {
        const textView = document.querySelector("#header-text");
        textView.innerHTML = text;
    }

    if (src) {
        var img = document.createElement("img");
        img.style = "width: 100%; margin: 0 auto; max-width: 400px;";
        img.src = src;
        var container = document.querySelector("#himage-container");
        container.appendChild(img);
    }
});