<script setup>
import { ref, watch, onMounted } from "vue";
import Shapes from "./classes/shapes";
import Line from "./classes/lines";
import NavBar from "./components/NavBar.vue";
import Sidebar from "./components/Sidebar.vue";
import { svgData } from "./assets/svgData";

const svgContainerRef = ref(null);
const draggedItems = ref([]); // Store shape instances
const lines = ref([]); // Store line instances

// Render all shapes
const renderAllShapes = () => {
  draggedItems.value.forEach((shapeData) => {
    const shape = new Shapes({
      ...shapeData,
      svgContainer: svgContainerRef.value,
      draggedItems,
    });
    shape.render(svgContainerRef.value);
  });
};

// Render all lines
const renderAllLines = () => {
  lines.value.forEach((lineData) => {
    const line = new Line({
      ...lineData,
      svgContainer: svgContainerRef.value,
      lines,
    });
    line.render();
  });
};

// Re-render everything
const renderAll = () => {
  svgContainerRef.value.innerHTML = "";
  renderAllShapes();
  renderAllLines();
  console.log(lines.value);
  console.log(draggedItems.value);
};

// Add a new line
const addLines = () => {
  const newLineData = {
    lineId: `line-${lines.value.length + 1}`,
    startXY: [100, 100],
    endXY: [300, 300],
    lineName: `Line ${lines.value.length + 1}`,
  };
  lines.value.push(newLineData);
};

// Find an SVG by ID
const getSvgById = (id) => svgData.find((svg) => svg.id === id);

// Add a shape to the container
const renderShape = (shapeData, x, y) => {
  const shape = {
    svgId: `shape-${draggedItems.value.length + 1}`,
    svgName: shapeData.id,
    x,
    y,
    style: {
      strokeColor: "#444",
      fillColor: "#000",
      strokeWidth: 1,
    },
    dimensions: {
      width: 48,
      height: 48,
    },
    paths: shapeData.paths,
  };
  draggedItems.value.push(shape);
};

// Watchers to re-render on array changes
watch(draggedItems, renderAll, { deep: true });
watch(lines, renderAll, { deep: true });

// Event listeners for the SVG container
onMounted(() => {
  const svgContainer = svgContainerRef.value;

  // Handle drag over
  svgContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  // Handle drop for shapes
  svgContainer.addEventListener("drop", (e) => {
    e.preventDefault();

    const rect = svgContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const draggedSvgId = e.dataTransfer.getData("text/plain");
    const svg = getSvgById(draggedSvgId);

    if (svg) {
      renderShape(svg, x, y);
    }
  });
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <NavBar />
    <div class="flex flex-1">
      <Sidebar
        @add-line="addLines"
        @delete-selected="deleteSelected"
        @download-image="downloadImage"
      />
      <main class="flex-1 px-5 overflow-auto">
        <div
          class="w-full h-full bg-white rounded-lg shadow-lg canvas-container resizable-container"
        >
          <svg
            ref="svgContainerRef"
            xmlns="http://www.w3.org/2000/svg"
            class="w-full h-full svgcontainer"
            style="
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
.main {
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
