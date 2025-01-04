<script setup>
import { ref, onMounted } from "vue";
import Shapes from "./classes/shapes";
import NavBar from "./components/NavBar.vue";
import Sidebar from "./components/Sidebar.vue";
import { svgData } from "./assets/svgData";

const svgContainerRef = ref(null);
const draggedItems = ref([]);

const renderSvg = (svg, x, y) => {
  const newShape = new Shapes({
    svgId: draggedItems.value.length + 1,
    svgName: svg.id,
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
    paths: svg.paths,
  });

  newShape.render(svgContainerRef.value);
  draggedItems.value.push(newShape);
};

const getSvgById = (id) => {
  return svgData.find((svg) => svg.id === id);
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

    const draggedSvgId = e.dataTransfer.getData("text/plain");
    const svg = getSvgById(draggedSvgId);

    if (svg) {
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
