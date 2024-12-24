<script setup>
import NavBar from "./components/NavBar.vue";
import Sidebar from "./components/Sidebar.vue";
import { svgData } from "./assets/svgData";

import { ref, onMounted } from "vue";

const svgContainerRef = ref(null);
const draggedItems = ref([]);
const lines = ref([]);
const selectedId = ref(["", null]);

const getSvgById = (id) => {
  return svgData.find((svg) => svg.id === id);
};

const deleteSelected = () => {
  console.log("Selected ID:", selectedId.value);

  if (!selectedId.value || selectedId.value[1] === null) {
    console.warn("No SVG or line is selected for deletion.");
    return;
  }

  // Check if the selected item is a SVG or a line
  if (selectedId.value[0] === "svg") {
    // Filter out the SVG with the matching selected ID
    draggedItems.value = draggedItems.value.filter(
      (svg) => svg.svgId !== selectedId.value[1]
    );

    // Find and remove the SVG element from the DOM
    const svgElement = svgContainerRef.value.querySelector(
      `[datasvgid="${selectedId.value[1]}"]`
    );
    if (svgElement) {
      svgContainerRef.value.removeChild(svgElement);
    }
  } else if (selectedId.value[0] === "line") {
    // Filter out the line with the matching selected ID
    lines.value = lines.value.filter(
      (line) => line.lineid !== selectedId.value[1]
    );

    // Find and remove the line group from the DOM
    const lineElement = svgContainerRef.value.querySelector(
      `[data-line-id="${selectedId.value[1]}"]`
    );
    if (lineElement) {
      svgContainerRef.value.removeChild(lineElement);
    }
  }

  // Clear the selection
  selectedId.value = ["", null];
  console.log("Updated draggedItems:", draggedItems.value);
  console.log("Updated lines:", lines.value);
};

const renderSvg = (svg, x, y, scale = 1.5) => {
  const svgContainer = svgContainerRef.value;

  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("transform", `translate(${x}, ${y}) scale(${scale})`);
  group.setAttribute("datasvgid", draggedItems.value.length);

  let isDragging = false;
  let startX, startY, initialX, initialY;

  const onMouseDown = (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;

    // Extract initial transform values
    const transform = group.getAttribute("transform");
    const translateMatch = /translate\(([\d.]+),\s*([\d.]+)\)/.exec(transform);
    if (translateMatch) {
      initialX = parseFloat(translateMatch[1]);
      initialY = parseFloat(translateMatch[2]);
    } else {
      initialX = x;
      initialY = y;
    }

    // Add event listeners for dragging
    svgContainer.addEventListener("mousemove", onMouseMove);
    svgContainer.addEventListener("mouseup", onMouseUp);

    console.log(draggedItems.value);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    const newX = initialX + deltaX;
    const newY = initialY + deltaY;

    group.setAttribute(
      "transform",
      `translate(${newX}, ${newY}) scale(${scale})`
    );
  };

  const onMouseUp = () => {
    isDragging = false;

    // Remove drag event listeners
    svgContainer.removeEventListener("mousemove", onMouseMove);
    svgContainer.removeEventListener("mouseup", onMouseUp);
  };

  const onClick = () => {
    selectedId.value[0] = "svg";
    selectedId.value[1] = parseInt(group.getAttribute("datasvgid"));

    console.log("Selected SVG ID:", selectedId);
  };
  group.addEventListener("click", onClick);

  group.addEventListener("mousedown", onMouseDown);

  svg.paths.forEach((path) => {
    const pathElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    pathElement.setAttribute("d", path.d);
    pathElement.setAttribute("fill", path.fill);
    pathElement.setAttribute("stroke", path.stroke);
    pathElement.setAttribute("stroke-width", path["stroke-width"]);
    pathElement.setAttribute("transform", "scale(2)");

    pathElement.addEventListener("mouseover", () => {
      pathElement.setAttribute("stroke", "green");
    });

    pathElement.addEventListener("mouseleave", () => {
      pathElement.setAttribute("stroke", path.stroke);
    });

    group.appendChild(pathElement);

    // If the path has an ellipse, handle it separately
    if (path.ellipse) {
      const ellipseElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "ellipse"
      );

      ellipseElement.setAttribute("cx", path.ellipse.cx);
      ellipseElement.setAttribute("cy", path.ellipse.cy);
      ellipseElement.setAttribute("rx", path.ellipse.rx);
      ellipseElement.setAttribute("ry", path.ellipse.ry);
      ellipseElement.setAttribute("fill", path.ellipse.fill);
      ellipseElement.setAttribute("stroke", path.ellipse.stroke);
      ellipseElement.setAttribute("stroke-width", path.ellipse["stroke-width"]);
      ellipseElement.setAttribute("transform", "scale(2)");

      group.appendChild(ellipseElement);
    }
  });

  svgContainer.appendChild(group);
};

// lines
const addLines = (lineData) => {
  lines.value.push({
    lineid: lines.value.length + 1,
    startXY: [100, 100],
    endXY: [300, 300],
    startAttachedTo: null,
    endAttachedTo: null,
    lineName: lineData.lineName,
    paths: lineData.path,
  });

  // Render the new line immediately after adding it
  renderLines(lines.value[lines.value.length - 1]);
};

const renderLines = (line) => {
  const svgContainer = svgContainerRef.value;

  const lineGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  lineGroup.setAttribute("data-line-id", line.lineid);

  // Create the line element
  const lineElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );
  lineElement.setAttribute("x1", line.startXY[0]);
  lineElement.setAttribute("y1", line.startXY[1]);
  lineElement.setAttribute("x2", line.endXY[0]);
  lineElement.setAttribute("y2", line.endXY[1]);
  lineElement.setAttribute("stroke", "white");
  lineElement.setAttribute("stroke-width", "2");

  // Append line to group
  lineGroup.appendChild(lineElement);

  const onClick = () => {
    selectedId.value[0] = "line";
    selectedId.value[1] = parseInt(lineGroup.getAttribute("data-line-id"));
  };
  lineGroup.addEventListener("click", onClick);

  // Create start and end drag handles
  const createHandle = (cx, cy) => {
    const handle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    handle.setAttribute("cx", cx);
    handle.setAttribute("cy", cy);
    handle.setAttribute("r", "3");
    handle.setAttribute("fill", "red");
    handle.setAttribute("class", "drag-handle");
    return handle;
  };

  const startHandle = createHandle(line.startXY[0], line.startXY[1]);
  const endHandle = createHandle(line.endXY[0], line.endXY[1]);

  // Append handles to group
  lineGroup.appendChild(startHandle);
  lineGroup.appendChild(endHandle);

  // Append group to the SVG container
  svgContainer.appendChild(lineGroup);

  // Enable dragging on both start and end handles
  const enableHandleDrag = (handle, line, handleType) => {
    handle.addEventListener("mousedown", () => {
      updateLineOnDrag(handle, line, handleType);
    });
  };

  // Add drag behavior for the handles
  enableHandleDrag(startHandle, line, "startXY");
  enableHandleDrag(endHandle, line, "endXY");

  // Function to update the line and handles during dragging
  const updateLineOnDrag = (handle, line, handleType) => {
    const onMouseMove = (e) => {
      const rect = svgContainer.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Update the respective coordinate (start or end) based on the handle
      if (handleType === "startXY") {
        line.startXY = [mouseX, mouseY];
        startHandle.setAttribute("cx", mouseX);
        startHandle.setAttribute("cy", mouseY);
        lineElement.setAttribute("x1", mouseX);
        lineElement.setAttribute("y1", mouseY);
      } else if (handleType === "endXY") {
        line.endXY = [mouseX, mouseY];
        endHandle.setAttribute("cx", mouseX);
        endHandle.setAttribute("cy", mouseY);
        lineElement.setAttribute("x2", mouseX);
        lineElement.setAttribute("y2", mouseY);
      }
    };

    // Attach mousemove listener
    svgContainer.addEventListener("mousemove", onMouseMove);

    // Stop dragging when mouseup is triggered
    const onMouseUp = () => {
      svgContainer.removeEventListener("mousemove", onMouseMove);
      svgContainer.removeEventListener("mouseup", onMouseUp);
    };

    svgContainer.addEventListener("mouseup", onMouseUp);
  };
};

onMounted(() => {
  const svgContainer = svgContainerRef.value;

  svgContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  // Render existing lines only once during mount
  lines.value.forEach((line) => {
    renderLines(line);
  });

  svgContainer.addEventListener("drop", (e) => {
    e.preventDefault();

    const rect = svgContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const draggedSvgId = e.dataTransfer.getData("text/plain");
    const svg = getSvgById(draggedSvgId);

    if (svg) {
      draggedItems.value.push({
        svgId: draggedItems.value.length + 1,
        svgName: draggedSvgId,
        x,
        y,
      });

      renderSvg(svg, x, y);
    }

    console.log(draggedItems.value);
  });
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <NavBar />

    <div class="flex flex-1">
      <Sidebar @add-line="addLines" @delete-selected="deleteSelected" />

      <main class="flex-1 px-5 overflow-auto">
        <div
          class="w-full h-full bg-white rounded-lg shadow-lg canvas-container resizable-container"
        >
          <svg
            ref="svgContainerRef"
            id="diagramSvg"
            xmlns="http://www.w3.org/2000/svg"
            class="w-full h-full svgcontainer"
            style="
              border: 1px solid #ccc;
              background: #1e1e1e;
              background-image: linear-gradient(#444 1px, transparent 1px),
                linear-gradient(90deg, #444 1px, transparent 1px);
              background-size: 10px 10px;
            "
          ></svg>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
main {
  margin-top: 10px;
  transition: margin-left 0.3s ease-in-out;
}

.svgcontainer {
  cursor: default;
}

.resizable-container {
  min-width: 300px;
  min-height: 300px;
  resize: both;
  overflow: auto;
}
</style>
