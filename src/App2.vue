<script setup>
import { onMounted, ref, watch } from "vue";
import NavBar from "./components/NavBar.vue";
import Sidebar from "./components/Sidebar.vue";
import { svgData } from "./assets/svgData";

const svgContainerRef = ref(null);
const draggedItems = ref([]);

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
      draggedItems.value.push({
        svgId: draggedItems.value.length + 1,
        svgName: draggedSvgId,
        offset: { x, y },
        style: {
          fillColor: "#ff0000",
          strokeColor: "#000000",
          strokeWidth: 2,
        },
        dimensions: { width: 50, height: 50 },
        paths: svg.paths,
      });
    }
  });
});

watch(
  draggedItems,
  (newItems) => {
    console.log("Dragged items updated:", newItems);
  },
  { deep: true }
);
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
