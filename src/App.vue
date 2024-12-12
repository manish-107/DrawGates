<script setup>
import Nav from "./components/Nav.vue";
import Sidebar from "./components/Sidebar.vue";
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Navbar -->
    <Nav />

    <div class="flex flex-1">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main Content -->
      <main class="flex-1 p-5 overflow-auto bg-gray-100">
        <div
          class="w-full h-full p-4 bg-white rounded-lg shadow-lg canvas-container"
        >
          <!-- Canvas or other content goes here -->
          <h1 class="text-xl font-bold text-gray-800">Canvas Area</h1>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
main {
  margin-top: 10px; /* Offset the content below the navbar */
  transition: margin-left 0.3s ease-in-out;
}
</style>
