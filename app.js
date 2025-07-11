// import express from 'express';
// import http from 'http';
// import path from 'path';  //Helps manage file paths.
// import socketio from 'socket.io';
// import { dirname } from 'path';

const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const { dirname } = require("path");






const app = express();

const server = http.createServer(app)  // server: A server created using Node’s HTTP module so that it can be used with Socket.IO.

const io = socketio(server)  // This sets up Socket.IO to work with your server. now server and socketio are linked


app.set("view engine", "ejs")  // telling Express: I will use EJS files for rendering pages.

app.use(express.static(path.join(__dirname, "public")))

io.on("connection", function(socket){  // socket represents the connected client.
    socket.on("send-location", function(data){
        io.emit("recieve-location", {id: socket.id, ...data})
    })   
    console.log("Connected")

    socket.on("disconnect", function(){
        io.emit("user-disconnected", socket.id)
    })
})



app.get("/", function (req, res) {
    res.render("index")
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
