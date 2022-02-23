import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import * as path from "path";

const app = express();
const server = createServer(app);
const io = new Server(server, { serveClient: false });

const timers: Record<string, any> = {};

app.use("/static", express.static("./static"));

app.get("/", (req, res) => {
  const fileDirectory = path.resolve(__dirname, "../static");
  res.sendFile("index.html", { root: fileDirectory });
});

app.get("/api/v1/devices", (req, res) => {
  res.json(devicesData);
});

app.get("/api/v1/devices/:id", (req, res) => {
  res.json(devicesData[Number(req.params.id)]);
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("show-device", (id) => {
    console.log("show device");
    const timer = setInterval(() => {
      console.log("log");
      io.to(socket.id).emit("device-change", devicesData[Number(id)]);
    }, 2000);
    if (timers[socket.id]) {
      clearInterval(timers[socket.id]);
    }
    timers[socket.id] = timer;
  });
});

server.listen(3000, () => console.log("listining on port 3000"));

const devicesData = [
  {
    connectionState: "connected",
    id: "0",
    name: "zerowy",
    type: "bulb",
  },
  {
    connectionState: "connected",
    id: "1",
    name: "pierwszy",
    type: "bulb",
  },
  {
    connectionState: "poorConnection",
    id: "2",
    name: "drugi",
    type: "outlet",
  },
  {
    connectionState: "disconnected",
    id: "3",
    name: "trzeci",
    type: "temperatureSensor",
  },
  {
    connectionState: "connected",
    id: "4",
    name: "czwarty",
    type: "bulb",
  },
  {
    connectionState: "connected",
    id: "5",
    name: "piąty",
    type: "outlet",
  },
];
