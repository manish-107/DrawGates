<script setup>
import { svgData } from "@/assets/svgData";
import { lines } from "@/assets/svgData";

const emit = defineEmits(["add-line"]);
</script>

<template>
  <aside
    class="justify-center h-screen p-5 m-3 text-white border-2 border-white rounded-lg w-60"
  >
    <h5 class="p-4">Gates</h5>
    <div class="flex flex-wrap gap-3 bg-[#2d2b2b] p-3 rounded-lg">
      <div
        v-for="gate in svgData"
        :key="gate.id"
        id="draggable"
        @dragstart="(e) => e.dataTransfer.setData('text/plain', gate.id)"
        draggable="true"
        class="w-1/6 p-1"
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
    <h5 class="p-4">Lines</h5>
    <div class="flex flex-wrap gap-3 bg-[#2d2b2b] p-3 rounded-lg">
      <div
        v-for="line in lines"
        :key="line.id"
        class="hover:bg-[#545252] transition-colors duration-300 rounded-lg p-1"
        @click="
          emit('add-line', {
            lineName: line.id,
            path: line.paths,
          })
        "
      >
        <svg :width="line.width" :height="line.height" viewBox="0 0 32 32">
          <path
            v-for="(path, index) in line.paths"
            :key="index"
            v-bind="path"
          />
        </svg>
      </div>
    </div>
  </aside>
</template>
