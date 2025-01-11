<script setup>
import { svgData } from "@/assets/svgData";
import { lines } from "@/assets/svgData";
import { ref } from "vue";

const dropdownVisible = ref(false);

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value;
};

const emit = defineEmits([
  "add-line",
  "delete-selected",
  "download-image",
  "download-json",
]);
</script>

<template>
  <aside
    class="flex flex-col items-center h-screen bg-[#2d2b2b] text-white border border-[#787676] rounded-lg w-60 ml-2"
  >
    <div class="flex gap-2 p-4">
      <button
        @click="emit('delete-selected')"
        class="flex items-center px-3 py-2 text-sm font-medium bg-white border rounded-lg text-slate-800 hover:text-blue-600 hover:bg-slate-100 border-slate-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
        <span class="ml-2 hidden md:inline-block">Delete</span>
      </button>
      <div class="relative inline-block text-left">
        <div>
          <button
            @click="toggleDropdown"
            class="flex items-center px-3 py-2 text-sm font-medium bg-white border rounded-lg text-slate-800 hover:text-blue-600 hover:bg-slate-100 border-slate-200"
          >
            <span class="hidden md:inline-block">Download</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 ml-2 -mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 9.707a1 1 0 011.414 0L10 13.586l3.293-3.879a1 1 0 011.707 1.207l-4 4.5a1 1 0 01-1.414 0l-4-4.5a1 1 0 01.293-.707z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        <!-- Dropdown menu -->
        <div
          v-if="dropdownVisible"
          class="absolute right-0 z-10 mt-2 w-30 bg-white rounded-xl shadow-lg border border-gray-200"
        >
          <button
            @click="$emit('download-image')"
            class="block w-full px-4 py-2 text-sm text-left rounded-xl text-slate-800 hover:bg-slate-100 hover:text-blue-600"
          >
            Download Image
          </button>
          <button
            @click="$emit('download-json')"
            class="block w-full px-4 py-2 text-sm text-left rounded-xl text-slate-800 hover:bg-slate-100 hover:text-blue-600"
          >
            Download JSON
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col w-full px-4">
      <h5 class="mb-3 ml-1 text-sm font-semibold">Gates</h5>
      <div class="grid grid-cols-4 gap-2 p-3 bg-[#1f1e1e] rounded-lg">
        <div
          v-for="gate in svgData.slice(0, 4)"
          :key="gate.id"
          id="draggable"
          @dragstart="(e) => e.dataTransfer.setData('text/plain', gate.id)"
          draggable="true"
          class="flex items-center justify-center w-9 h-9"
        >
          <svg :width="35" :height="35" viewBox="0 0 32 32">
            <path
              v-for="(path, index) in gate.paths"
              :key="index"
              v-bind="path"
            />
          </svg>
        </div>
      </div>
    </div>

    <div class="flex flex-col w-full px-4 mt-6">
      <h5 class="mb-3 text-sm font-semibold">Shapes</h5>
      <div class="grid grid-cols-4 gap-2 p-3 bg-[#1f1e1e] rounded-lg">
        <div
          v-for="shape in svgData.slice(4, 12)"
          :key="shape.id"
          id="draggable"
          @dragstart="(e) => e.dataTransfer.setData('text/plain', shape.id)"
          draggable="true"
          class="flex items-center justify-center w-9 h-9"
        >
          <svg :width="35" :height="35" viewBox="0 0 32 32">
            <path
              v-for="(path, index) in shape.paths"
              :key="index"
              v-bind="path"
            />
          </svg>
        </div>
      </div>
    </div>

    <div class="flex flex-col w-full px-4 mt-6">
      <h5 class="mb-3 text-sm font-semibold">Others</h5>
      <div class="grid grid-cols-3 gap-3 p-3 bg-[#1f1e1e] rounded-lg">
        <div
          v-for="other in svgData.slice(12)"
          :key="other.id"
          id="draggable"
          @dragstart="(e) => e.dataTransfer.setData('text/plain', other.id)"
          draggable="true"
          class="flex items-center justify-center w-12 h-12"
        >
          <svg :width="40" :height="40" viewBox="0 0 32 42">
            <!-- Increased SVG size -->
            <path
              v-for="(path, index) in other.paths"
              :key="index"
              v-bind="path"
            />
          </svg>
        </div>
      </div>
    </div>

    <div class="flex flex-col w-full px-4 mt-6">
      <h5 class="mb-3 text-sm font-semibold">Lines</h5>
      <div class="grid grid-cols-4 gap-2 p-3 bg-[#1f1e1e] rounded-lg">
        <div
          v-for="line in lines"
          :key="line.id"
          class="flex items-center justify-center w-9 h-9 hover:bg-[#545252] rounded"
          @click="emit('add-line', { lineName: line.id, path: line.paths })"
        >
          <svg :width="35" :height="35" viewBox="0 0 32 32">
            <path
              v-for="(path, index) in line.paths"
              :key="index"
              v-bind="path"
            />
          </svg>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  width: 12rem;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
