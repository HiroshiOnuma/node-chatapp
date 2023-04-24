const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const PORT = 3002;

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
    console.log(`${socket.id}さんが接続しました`);
    socket.on("chat message", (msg) => {
        //日時の取得
        let today = new Date();
        let week = ["日", "月", "火", "水", "木", "金", "土"];
        let year = today.getFullYear();
        let month = ('0' + (today.getMonth() + 1)).slice(-2);
        let date = ('0' + (today.getDate())).slice(-2);
        let day = today.getDay();
        let hour = ('0' + (today.getHours())).slice(-2);
        let minute = ('0' + (today.getMinutes())).slice(-2);
        let second = ('0' + (today.getSeconds())).slice(-2);
        let time = `${hour}:${minute}`;

        console.log("メッセージ:" + msg);
        const msgData = {
            message: msg, socketId: socket.id, time: time
        };
        io.emit("chat message", msgData);
    });

});

server.listen(PORT, () => {
    console.log("listening on 3002");
});