"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const path = __importStar(require("path"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    serveClient: false,
});
const changeDevice = (device) => {
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
const timers = {};
app.use("/static", express_1.default.static(path.resolve(__dirname, "../../static")));
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
const devicesDataDetails = [
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
