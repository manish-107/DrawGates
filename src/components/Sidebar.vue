<script setup>
import { svgData } from "@/assets/svgData";
</script>

<template>
  <aside
    class="justify-center h-screen p-5 m-3 text-white border-2 border-white rounded-lg w-60"
  >
    <h5 class="p-4">Gates</h5>
    <div class="flex flex-wrap gap-3">
      <div
        v-for="gate in svgData"
        :key="gate.id"
        id="draggable"
        @dragstart="(e) => e.dataTransfer.setData('text/plain', gate.id)"
        draggable="true"
        class="w-1/5 p-1"
      >
        <svg :width="gate.width" :height="gate.height" viewBox="0 0 32 32">
          <path
            v-for="(path, index) in gate.paths"
            :key="index"
            v-bind="path"
          />
        </svg>
      </div>
    </div>
  </aside>
</template>
