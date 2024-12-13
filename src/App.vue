<script setup>
import NavBar from "./components/NavBar.vue";
import Sidebar from "./components/Sidebar.vue";
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <NavBar />

    <div class="flex flex-1">
      <Sidebar />

      <main class="flex-1 px-5 overflow-auto">
        <div
          class="w-full h-full bg-white rounded-lg shadow-lg canvas-container"
        >
          <!-- Canvas or other content goes here -->
          <canvas id="diagramCanvas" style="border: 1px solid #ccc"></canvas>
        </div>
      </main>
    </div>
  </div>
</template>

<script></script>

<style scoped>
main {
  margin-top: 10px;
  transition: margin-left 0.3s ease-in-out;
}

canvas {
  width: 100%;
  height: 100%;
  background-color: #1e1e1e;
  background-image: linear-gradient(#444 1px, transparent 1px),
    linear-gradient(90deg, #444 1px, transparent 1px);
  background-size: 10px 10px;
}
</style>
