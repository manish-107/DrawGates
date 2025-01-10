<script setup>
import { ref, watch, onMounted, reactive } from "vue";
import Shapes from "./classes/shapes";
import Line from "./classes/lines";
import NavBar from "./components/NavBar.vue";
import Sidebar from "./components/Sidebar.vue";
import { svgData } from "./assets/svgData";

const svgContainerRef = ref(null);
const draggedItems = ref([]); // Store shape instances
const lines = ref([]); // Store line instances
const selectedIdDelete = ref(null);

// Render all shapes
const renderAllShapes = () => {
  draggedItems.value.forEach((shapeData) => {
    const shape = new Shapes({
      ...shapeData,
      svgContainer: svgContainerRef.value,
      draggedItems,
      selectedIdDelete,
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
      draggedItems,
      selectedIdDelete,
    });
    line.render();
  });
};

const deleteSelected = () => {
  if (selectedIdDelete.value?.startsWith("l")) {
    // Delete the selected line
    lines.value = lines.value.filter(
      (lineData) => lineData.lineId !== selectedIdDelete.value
    );
    selectedIdDelete.value = null; // Clear the selection
  } else if (selectedIdDelete.value?.startsWith("s")) {
    // Delete the selected shape
    draggedItems.value = draggedItems.value.filter(
      (shapeData) => shapeData.svgId !== selectedIdDelete.value
    );
    selectedIdDelete.value = null; // Clear the selection
  } else {
    console.log("No valid item selected for deletion");
  }
};

// Re-render everything
const renderAll = () => {
  svgContainerRef.value.innerHTML = "";
  renderAllLines();
  renderAllShapes();
};

// Add a new line
const addLines = () => {
  const newLineData = {
    lineId: `l${lines.value.length + 1}`,
    startXY: [100, 100],
    endXY: [300, 300],
    startShapeJoin: { sid: null, diffX: null, diffY: null },
    endShapeJoin: { sid: null, diffX: null, diffY: null },
    lineName: `Line ${lines.value.length + 1}`,
  };
  lines.value.push(newLineData);
};

// Find an SVG by ID
const getSvgById = (id) => svgData.find((svg) => svg.id === id);

// Add a shape to the container
const renderShape = (shapeData, x, y) => {
  const shape = {
    svgId: `s${draggedItems.value.length + 1}`,
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

const downloadImage = () => {
  const svgElement = document.getElementById("diagramSvg");

  if (!svgElement) {
    console.warn("SVG element not found.");
    return;
  }

  // Get the bounding box of the entire SVG
  const bbox = svgElement.getBBox();
  const minX = bbox.x - 284; // Adjust for sidebar
  const minY = bbox.y - 84; // Adjust for navbar
  const maxX = bbox.x + bbox.width + 284; // Full width with offset
  const maxY = bbox.y + bbox.height + 84; // Full height with offset

  // Clone SVG content into a new <svg>
  const svgNS = "http://www.w3.org/2000/svg";
  const croppedSvg = document.createElementNS(svgNS, "svg");
  croppedSvg.setAttribute("xmlns", svgNS);
  croppedSvg.setAttribute(
    "viewBox",
    `${minX} ${minY} ${maxX - minX} ${maxY - minY}`
  );
  croppedSvg.setAttribute("width", maxX - minX);
  croppedSvg.setAttribute("height", maxY - minY);
  croppedSvg.setAttribute("style", "background-color: black;");

  // Clone the entire SVG element
  Array.from(svgElement.children).forEach((child) => {
    croppedSvg.appendChild(child.cloneNode(true));
  });

  // Serialize the cropped SVG to a string
  const svgData = new XMLSerializer().serializeToString(croppedSvg);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = function () {
    // Create a canvas to draw the image
    const canvas = document.createElement("canvas");
    canvas.width = maxX - minX;
    canvas.height = maxY - minY;

    const ctx = canvas.getContext("2d");

    // Set background color to black
    ctx.fillStyle = "#444";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the SVG image onto the canvas
    ctx.drawImage(img, 0, 0);

    // Export the canvas as a PNG
    const pngData = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = pngData;
    a.download = "full_canvas.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up
    URL.revokeObjectURL(url);
  };

  img.src = url;
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
            id="diagramSvg"
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
