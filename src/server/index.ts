import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import * as path from "path";
import {
  ClientToServerEvents,
  deviceUnion,
  ServerToClientEvents,
  SmartDevice,
} from "../types";

const app = express();
const server = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  serveClient: false,
});

const changeDevice = (device: any) => {
  if (device.type === "bulb") {
    device.brightness = Math.floor(Math.random() * (100 - 1)) + 1;
    device.isTurnedOn = !device.isTurnedOn;
  }
  if (device.type === "outlet") {
    device.powerConsumption = Math.floor(Math.random() * (100 - 1)) + 1;
    device.isTurnedOn = !device.isTurnedOn;
  }
  if (device.type === "temperatureSensor") {
    device.temperature = Math.floor(Math.random() * (100 - 1)) + 1;
  }
};

const timers: Record<string, any> = {};

app.use("/static", express.static(path.resolve(__dirname, "../../static")));

app.get("/", (req, res) => {
  const fileDirectory = path.resolve(__dirname, "../../static");
  res.sendFile("index.html", { root: fileDirectory });
});

app.get("/api/v1/devices", (req, res) => {
  res.json(devicesData);
});

app.get("/api/v1/devices/:id", (req, res) => {
  res.json(devicesDataDetails[Number(req.params.id)]);
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("show-device", (id) => {
    console.log("show device");
    const timer = setInterval(() => {
      console.log("change");
      changeDevice(devicesDataDetails[Number(id)]);
      io.to(socket.id).emit("device-change", devicesDataDetails[Number(id)]);
    }, 8000);
    if (timers[socket.id]) {
      clearInterval(timers[socket.id]);
    }
    timers[socket.id] = timer;
  });
  socket.on("disconnect", () => {
    clearInterval(timers[socket.id]);
  });
});

server.listen(3000, () => console.log("listining on port 3000"));

const devicesData: SmartDevice[] = [
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

const devicesDataDetails: deviceUnion[] = [
  {
    connectionState: "connected",
    id: "0",
    name: "zerowy",
    type: "bulb",
    brightness: 10,
    color: "red",
    isTurnedOn: true,
  },
  {
    connectionState: "connected",
    id: "1",
    name: "pierwszy",
    type: "bulb",
    brightness: 20,
    color: "blue",
    isTurnedOn: false,
  },
  {
    connectionState: "poorConnection",
    id: "2",
    name: "drugi",
    type: "outlet",
    isTurnedOn: true,
    powerConsumption: 50,
  },
  {
    connectionState: "disconnected",
    id: "3",
    name: "trzeci",
    type: "temperatureSensor",
    temperature: 100,
  },
  {
    connectionState: "connected",
    id: "4",
    name: "czwarty",
    type: "bulb",
    brightness: 30,
    color: "green",
    isTurnedOn: true,
  },
  {
    connectionState: "connected",
    id: "5",
    name: "piąty",
    type: "outlet",
    isTurnedOn: true,
    powerConsumption: 20,
  },
];
