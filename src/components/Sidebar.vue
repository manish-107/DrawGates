<script setup>
import { svgData } from "@/assets/svgData";
import { lines } from "@/assets/svgData";

const emit = defineEmits(["add-line", "delete-selected", "download-image"]);
</script>

<template>
  <aside
    class="justify-center h-screen p-5 m-3 text-white border border-[#787676] rounded-lg w-60"
  >
    <div class="flex flex-row gap-3 bg-[#2d2b2b] p-3 rounded-lg">
      <button
        @click="emit('delete-selected')"
        class="inline-flex items-center px-2 py-2 space-x-2 text-sm font-medium bg-white border rounded-lg text-slate-800 hover:text-blue-600 hover:bg-slate-100 border-slate-200"
      >
        <span>
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
        </span>
        <span class="hidden md:inline-block">Delete</span>
      </button>
      <button
        @click="emit('download-image')"
        class="inline-flex items-center px-2 py-2 space-x-2 text-sm font-medium bg-white border rounded-lg text-slate-800 hover:text-blue-600 hover:bg-slate-100 border-slate-200"
      >
        <span class="hidden md:inline-block">Download</span>
      </button>
    </div>

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
    <div class="flex flex-wrap">
      <div
        v-for="line in lines"
        :key="line.id"
        class="hover:bg-[#545252]"
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
