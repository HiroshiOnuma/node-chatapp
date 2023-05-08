const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
// const mongoose = require("mongoose"); //MongoDBと接続するケース
// const Thread = require("./models/Thread"); //MongoDBと接続するケース
require("dotenv").config();
const mongo_uri = process.env.MONGODB_URI;

// app.use(express.json()); //MongoDBと接続するケース
app.use(express.static("public"));

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

// //MongoDBと接続
// mongoose
//     .connect(mongo_uri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         retryWrites: true
//     })
//     .then(() => console.log("db connected"))
//     .catch((err) => console.log(err));

// //getメソッド(MongoDBからデータを取得)
// app.get("/api/v1/threads", async (req, res) => {
//     try {
//         const allThreads = await Thread.find({});
//         res.status(200).json(allThreads);
//     } catch {
//         console.log(err);
//     }
// });

// //postメソッド(MongoDBにデータを追加)
// app.post("/api/v1/thread", async (req, res) => {
//     try {
//         const createThread = await Thread.create(req.body);
//         res.status(200).json(createThread);
//     } catch {
//         console.log(err);
//     }
// });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
    console.log(`${socket.id}さんが接続しました`);
    socket.on("login", (userName) => {
        socket.userName = userName; // ソケットオブジェクトにユーザー名を紐付ける
        console.log(`${socket.userName}さんがログインしました`);
        io.emit("user joined", userName); // 全クライアントにログインしたユーザー名を通知
    });
    socket.on("chat message", (msg) => {
        console.log(`${socket.userName}さんのメッセージ: ${msg}`);
        const msgData = {
            message: msg,
            user: socket.userName,
            time: `${('0' + (new Date().getHours())).slice(-2)}:${('0' + (new Date().getMinutes())).slice(-2)}` // 現在時刻を取得する
        };
        io.emit("chat message", msgData);
    });

    socket.on("disconnect", () => {
        console.log("disconnect");
        console.log(`${socket.userName}さんがログアウトしました`);
    })

});

server.listen(process.env.PORT || 3002, () => {
    console.log("listening on 3002");
});