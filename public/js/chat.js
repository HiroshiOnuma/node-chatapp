"use strict";

const socket = io();
const login = document.getElementById("login");
const app = document.getElementById("app");
const messages = document.getElementById("messages");
const messageForm = document.getElementById("message-form");
const loginForm = document.getElementById("login-form");
const messageInput = document.getElementById("message-area");

//最新のメッセージの箇所で固定する関数
function windowScroll() {
    window.scrollTo(0, messages.scrollHeight);
}

//ユーザーログイン機能
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userNameInput = document.getElementById("name");
    const userName = userNameInput.value.trim();
    if (userName) {
        socket.emit("login", userName);
        socket.userName = userName;
        login.style.display = "none";
        app.classList.add("active");
        //現在までのメッセージを画面に追加する処理を呼び出し
        displayMessages();
    }
});

//ユーザーログイン通知
socket.on("user joined", (userName) => {
    console.log(`${userName}さんがログインしました`);
});

//現在までのメッセージを画面に追加
async function displayMessages() {
    try {
        const responce = await axios.get("/api/v1/threads");
        responce.data.forEach(msgData => {
            let userContainer = document.createElement("div");
            userContainer.classList.add("user");
            if (msgData.user === socket.userName) {
                userContainer.classList.add("user-r");
            }
            messages.appendChild(userContainer);
            let messageContainer = document.createElement("div");
            messageContainer.classList.add("message-container");
            userContainer.appendChild(messageContainer);
            if (msgData.user !== socket.userName) {
                let userName = document.createElement("p");
                userName.classList.add("user-name");
                userName.textContent = `${msgData.user}さん`;
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
        });
        //最新のメッセージの箇所で固定関数の呼び出し
        windowScroll();

    } catch (err) {
        console.log(err);
    }
}

// form内容をサーバーに送信
messageForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const messageText = messageInput.value.trim();
    const userNameInput = document.getElementById("name");
    const userName = userNameInput.value.trim();
    const currentTime = `${('0' + (new Date().getHours())).slice(-2)}:${('0' + (new Date().getMinutes())).slice(-2)}`;

    if (!messageText) return;
    socket.emit("chat message", messageText);
    try {
        const responce = await axios.post("/api/v1/thread", {
            message: messageText,
            time: currentTime,
            user: userName
        });
    } catch (err) {
        console.log(err);
    }
    messageInput.value = "";
    messageInput.style.height = "auto";
});

//texareaをEnterキーで送信,Shiftキー+Enterキーで改行
messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { // Enterキーを押したとき
        e.preventDefault();
        messageForm.dispatchEvent(new Event('submit')); // formのsubmitイベントを発火
    }
});

socket.on("chat message", function (msgData) {
    setTimeout(function () {
        let userContainer = document.createElement("div");
        userContainer.classList.add("user");
        if (msgData.user === socket.userName) {
            userContainer.classList.add("user-r");
        }
        messages.appendChild(userContainer);
        let messageContainer = document.createElement("div");
        messageContainer.classList.add("message-container");
        userContainer.appendChild(messageContainer);
        if (msgData.user !== socket.userName) {
            let userName = document.createElement("p");
            userName.classList.add("user-name");
            userName.textContent = `${msgData.user}さん`;
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

        //最新のメッセージの箇所で固定関数の呼び出し
        windowScroll();
    }, 300);
});
