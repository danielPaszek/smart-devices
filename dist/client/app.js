"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const interact_1 = require("./interact");
interact_1.interactjs;
const socket = (0, socket_io_client_1.io)();
const devices = document.querySelector(".devices");
const panel = document.getElementById("panel");
let deviceData;
let isOpen = false;
socket.on("connect", () => {
    console.log(socket.id);
});
socket.on("device-change", (device) => {
    // console.log(device);
    createPanel(device, device.type);
    // createListElement(device);
    const inx = deviceData.findIndex((item) => item.id === device.id);
    deviceData[inx] = device;
    devices.innerHTML = "";
    deviceData.forEach((el) => {
        createListElement(el);
    });
});
const closePanel = () => {
    panel === null || panel === void 0 ? void 0 : panel.classList.add("panel__close");
    isOpen = false;
};
const openPanel = () => {
    panel === null || panel === void 0 ? void 0 : panel.classList.remove("panel__close");
    isOpen = true;
};
const createPanel = (data, type) => {
    if (!panel) {
        alert("Something went wrong!");
        return;
    }
    panel.innerHTML = "";
    const header = document.createElement("h1");
    header.innerHTML = `Details of <span> ${data.name} </span> : `;
    header.classList.add("panel__header");
    panel.appendChild(header);
    Object.keys(data).forEach((key) => {
        const element = document.createElement("div");
        element.classList.add("panel__div");
        element.innerHTML = `<span class="panel__span1">${key}:</span> <span class="panel__span2">${data[key]}</span>`;
        panel.appendChild(element);
    });
    const icon = document.createElement("div");
    icon.classList.add("panel__icon");
    if (type === "bulb") {
        icon.innerHTML = iconBulb;
        icon.style.color = data.color;
    }
    else if (type === "outlet") {
        icon.innerHTML = iconOutlet;
        icon.style.color = data.isTurnedOn ? "yellow" : "gray";
    }
    else {
        icon.innerHTML = iconTemperature;
    }
    panel.appendChild(icon);
    const btn = document.createElement("button");
    btn.addEventListener("click", closePanel);
    btn.innerText = "X";
    btn.classList.add("panel__btn");
    panel.appendChild(btn);
};
const createListElement = (el) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("device__wrapper");
    if (el.connectionState !== "disconnected")
        wrapper.addEventListener("click", () => handleListClick(el.id, el.type));
    const properties = document.createElement("div");
    properties.classList.add("device__properties");
    const title = document.createElement("h1");
    title.classList.add("device__title");
    title.innerText = el.name;
    const p1 = document.createElement("p");
    title.classList.add("device__p");
    p1.innerText = el.type;
    const p2 = document.createElement("p");
    title.classList.add("device__p");
    p2.innerText = el.connectionState;
    el.connectionState === "disconnected"
        ? ((wrapper.style.opacity = "0.5"), (wrapper.style.cursor = "defualt"))
        : ((wrapper.style.opacity = "1"), (wrapper.style.cursor = "pointer"));
    properties.appendChild(title);
    properties.appendChild(p1);
    properties.appendChild(p2);
    wrapper.appendChild(properties);
    const icon = document.createElement("div");
    icon.classList.add("icon");
    if (el.type === "temperatureSensor") {
        icon.innerHTML = iconTemperature;
    }
    else if (el.type === "bulb") {
        icon.innerHTML = iconBulb;
    }
    else {
        icon.innerHTML = iconOutlet;
    }
    wrapper.appendChild(icon);
    devices === null || devices === void 0 ? void 0 : devices.appendChild(wrapper);
};
const handleListClick = (id, type) => __awaiter(void 0, void 0, void 0, function* () {
    if (!panel) {
        alert("Something went wrong!");
        return;
    }
    openPanel();
    panel.innerHTML = "loading...";
    const result = yield (yield fetch("/api/v1/devices/" + id)).json();
    socket.emit("show-device", id);
    createPanel(result, type);
});
//
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    //interactjs
    const x = localStorage.getItem("data-x") || "0";
    const y = localStorage.getItem("data-y") || "0";
    const width = localStorage.getItem("width") || String(panel === null || panel === void 0 ? void 0 : panel.scrollWidth);
    const height = localStorage.getItem("height") || String(panel === null || panel === void 0 ? void 0 : panel.scrollHeight);
    if (panel) {
        panel.style.width = width;
        panel.style.height = height;
        panel.setAttribute("data-x", x);
        panel.setAttribute("data-y", y);
        panel.style.transform = "translate(" + x + "px, " + y + "px)";
    }
    // fetch and render
    deviceData = (yield (yield fetch("/api/v1/devices")).json());
    deviceData.forEach((el) => {
        createListElement(el);
    });
    if (isOpen)
        openPanel();
    else
        closePanel();
});
init();
const iconTemperature = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M416 0c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm0 128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm-160-16C256 50.1 205.9 0 144 0S32 50.1 32 112v166.5C12.3 303.2 0 334 0 368c0 79.5 64.5 144 144 144s144-64.5 144-144c0-34-12.3-64.9-32-89.5V112zM144 448c-44.1 0-80-35.9-80-80 0-25.5 12.2-48.9 32-63.8V112c0-26.5 21.5-48 48-48s48 21.5 48 48v192.2c19.8 14.8 32 38.3 32 63.8 0 44.1-35.9 80-80 80zm16-125.1V112c0-8.8-7.2-16-16-16s-16 7.2-16 16v210.9c-18.6 6.6-32 24.2-32 45.1 0 26.5 21.5 48 48 48s48-21.5 48-48c0-20.9-13.4-38.5-32-45.1z"></path></svg>`;
const iconBulb = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M632 888H392c-4.4 0-8 3.6-8 8v32c0 17.7 14.3 32 32 32h192c17.7 0 32-14.3 32-32v-32c0-4.4-3.6-8-8-8zM512 64c-181.1 0-328 146.9-328 328 0 121.4 66 227.4 164 284.1V792c0 17.7 14.3 32 32 32h264c17.7 0 32-14.3 32-32V676.1c98-56.7 164-162.7 164-284.1 0-181.1-146.9-328-328-328zm127.9 549.8L604 634.6V752H420V634.6l-35.9-20.8C305.4 568.3 256 484.5 256 392c0-141.4 114.6-256 256-256s256 114.6 256 256c0 92.5-49.4 176.3-128.1 221.8z"></path></svg>`;
const iconOutlet = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path fill-rule="nonzero" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm2-10h2v4h-2v-4zm-6 0h2v4H8v-4z"></path></g></svg>`;
