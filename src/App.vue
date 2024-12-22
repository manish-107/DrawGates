<script setup>
import NavBar from "./components/NavBar.vue";
import Sidebar from "./components/Sidebar.vue";
import { svgData } from "./assets/svgData";

import { ref, onMounted } from "vue";

const svgContainerRef = ref(null);
const draggedItems = ref([]);

const getSvgById = (id) => {
  return svgData.find((svg) => svg.id === id);
};

const renderSvg = (svg, x, y) => {
  const svgContainer = svgContainerRef.value;

  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("transform", `translate(${x}, ${y})`);

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
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    const newX = initialX + deltaX;
    const newY = initialY + deltaY;

    group.setAttribute("transform", `translate(${newX}, ${newY})`);
  };

  const onMouseUp = () => {
    isDragging = false;

    // Remove drag event listeners
    svgContainer.removeEventListener("mousemove", onMouseMove);
    svgContainer.removeEventListener("mouseup", onMouseUp);
  };

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
    pathElement.setAttribute("transform", "scale(2)"); // Scale factor for size

    group.appendChild(pathElement);
  });

  svgContainer.appendChild(group);
};

onMounted(() => {
  const svgContainer = svgContainerRef.value;

  svgContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  svgContainer.addEventListener("drop", (e) => {
    e.preventDefault();

    const rect = svgContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const draggedSvg = e.dataTransfer.getData("text/plain");
    const svg = getSvgById(draggedSvg);

    if (svg) {
      draggedItems.value.push({
        svgId: draggedItems.value.length + 1,
        svgName: draggedSvg,
        x,
        y,
      });

      renderSvg(svg, x, y);
    }
  });
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <NavBar />

    <div class="flex flex-1">
      <Sidebar />

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
