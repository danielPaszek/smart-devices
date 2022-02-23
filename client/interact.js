"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.interactjs = void 0;
const interactjs_1 = __importDefault(require("interactjs"));
function dragMoveListener(event) {
    var target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
    // translate the element
    target.style.transform = "translate(" + x + "px, " + y + "px)";
    // update the posiion attributes
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
    localStorage.setItem("data-x", String(x));
    localStorage.setItem("data-y", String(y));
}
exports.interactjs = (0, interactjs_1.default)(".panel")
    .resizable({
    // resize from all edges and corners
    edges: { left: true, right: true, bottom: true, top: true },
    listeners: {
        move(event) {
            var target = event.target;
            var x = parseFloat(target.getAttribute("data-x")) || 0;
            var y = parseFloat(target.getAttribute("data-y")) || 0;
            // update the element's style
            target.style.width = event.rect.width + "px";
            target.style.height = event.rect.height + "px";
            localStorage.setItem("width", target.style.width);
            localStorage.setItem("height", target.style.height);
            // translate when resizing from top or left edges
            x += event.deltaRect.left;
            y += event.deltaRect.top;
            target.style.transform = "translate(" + x + "px," + y + "px)";
            console.log("x", x);
            console.log("y", y);
            target.setAttribute("data-x", x);
            target.setAttribute("data-y", y);
            localStorage.setItem("data-x", String(x));
            localStorage.setItem("data-y", String(y));
        },
    },
    modifiers: [
        // keep the edges inside the parent
        interactjs_1.default.modifiers.restrictEdges({
            outer: "parent",
        }),
        // minimum size
        interactjs_1.default.modifiers.restrictSize({
            min: { width: 300, height: 150 },
        }),
    ],
})
    .draggable({
    listeners: { move: dragMoveListener },
    modifiers: [
        interactjs_1.default.modifiers.restrictRect({
            restriction: "parent",
            endOnly: true,
        }),
    ],
    inertia: true,
});
