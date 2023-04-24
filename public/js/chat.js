"use strict";

const socket = io();

//textareaの高さの可変
window.addEventListener("DOMContentLoaded", () => {
    const textareaEls = document.querySelectorAll("textarea");
    textareaEls.forEach((textareaEl) => {
        textareaEl.setAttribute("style", `height: ${textareaEl.scrollHeight}px;`);
        textareaEl.addEventListener("input", setTextareaHeight);
    });
    function setTextareaHeight() {
        this.style.height = "auto";
        this.style.height = `${this.scrollHeight}px`;
    }
});

const form = document.getElementById("form");
const messageInput = document.getElementById("message-area");
const messages = document.getElementById("messages");

form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (messageInput.value) {
        socket.emit("chat message", messageInput.value.trim());
        messageInput.value = "";
        messageInput.style.height = "auto";
    }
});

//texareaをEnterキーで送信,Shiftキー+Enterキーで改行
messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { // Enterキーを押したとき
        e.preventDefault();
        form.dispatchEvent(new Event('submit')); // formのsubmitイベントを発火
    }
});

socket.on("chat message", function (msgData) {
    setTimeout(function () {
        let userContainer = document.createElement("div");
        if (msgData.socketId === socket.id) {
            userContainer.classList.add("user", "user-r");
        } else {
            userContainer.classList.add("user");
    
        }
        messages.appendChild(userContainer);
        let messageContainer = document.createElement("div");
        messageContainer.classList.add("message-container");
        userContainer.appendChild(messageContainer);
        if (msgData.socketId !== socket.id) {
            let userName = document.createElement("p");
            userName.classList.add("user-name");
            userName.textContent = msgData.socketId.substring(0, 10) + "さん";
            messageContainer.appendChild(userName);
        }
        let message = document.createElement("p");
        message.classList.add("message");
        message.textContent = msgData.message;
        messageContainer.appendChild(message);
    
        let dateTime = document.createElement("p");
        dateTime.classList.add("date-time");
        dateTime.textContent = msgData.time;
        messageContainer.appendChild(dateTime);

        //最新のメッセージの箇所で固定
        window.scrollTo(0, messages.scrollHeight);
    }, 300);
});






