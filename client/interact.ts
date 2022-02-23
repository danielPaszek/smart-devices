import interact from "interactjs";

function dragMoveListener(event: any) {
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

export const interactjs = interact(".panel")
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
      interact.modifiers.restrictEdges({
        outer: "parent",
      }),

      // minimum size
      interact.modifiers.restrictSize({
        min: { width: 300, height: 150 },
      }),
    ],
  })
  .draggable({
    listeners: { move: dragMoveListener },
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: "parent",
        endOnly: true,
      }),
    ],
    inertia: true,
  });
