<script setup>
const svgData = [
  {
    id: "gate1",
    paths: [
      {
        d: "M 24.7 15 L 30.5 15",
        fill: "none",
        stroke: "white",
        "stroke-width": "1.3",
      },
      {
        d: "M 1.5 10.65 L 7.3 10.65",
        fill: "none",
        stroke: "white",
        "stroke-width": "1.3",
      },
      {
        d: "M 1.5 19.35 L 7.3 19.35",
        fill: "none",
        stroke: "white",
        "stroke-width": "1.3",
      },
      {
        d: "M 7.3 6.3 L 16 6.3 C 20.8 6.3 24.7 10.2 24.7 15 C 24.7 19.8 20.8 23.7 16 23.7 L 7.3 23.7 Z",
        fill: "rgb(241, 243, 244)",
        stroke: "white",
        "stroke-width": "1.3",
      },
    ],
    width: "32px",
    height: "32px",
  },
  {
    id: "gate2",
    paths: [
      {
        d: "M 1.5 15 L 7.3 15",
        fill: "none",
        stroke: "white",
        "stroke-width": "1.3",
      },
      {
        d: "M 24.7 15 L 30.5 15",
        fill: "none",
        stroke: "white",
        "stroke-width": "1.3",
      },
      {
        d: "M 7.3 6.3 L 24.7 15 L 7.3 23.7 Z",
        fill: "rgb(241, 243, 244)",
        stroke: "white",
        "stroke-width": "1.3",
      },
    ],
    width: "32px",
    height: "32px",
  },
  {
    id: "gate3",
    paths: [
      {
        d: "M 24.7 15 L 30.5 15",
        fill: "none",
        stroke: "white",
        "stroke-width": "1.3",
      },
      {
        d: "M 1.5 10.65 L 8.17 10.65",
        fill: "none",
        stroke: "white",
        "stroke-width": "1.3",
      },
      {
        d: "M 1.5 19.35 L 8.17 19.35",
        fill: "none",
        stroke: "white",
        "stroke-width": "1.3",
      },
      {
        d: "M 4.4 6.3 C 7.51 11.68 7.51 18.32 4.4 23.7",
        fill: "none",
        stroke: "white",
        "stroke-width": "1.3",
      },
      {
        d: "M 13.1 6.3 C 18.16 6.46 22.69 9.85 24.7 15 C 22.69 20.15 18.16 23.54 13.1 23.7 L 5.85 23.7 C 8.96 18.32 8.96 11.68 5.85 6.3 Z",
        fill: "rgb(241, 243, 244)",
        stroke: "white",
        "stroke-width": "1.3",
      },
    ],
    width: "32px",
    height: "32px",
  },
  {
    id: "gate4",
    paths: [
      {
        d: "M 24.7 15 L 30.5 15",
        fill: "none",
        stroke: "white",
        "stroke-width": "1.3",
      },
      {
        d: "M 1.5 10.65 L 8.17 10.65",
        fill: "none",
        stroke: "white",
        "stroke-width": "1.3",
      },
      {
        d: "M 1.5 19.35 L 8.17 19.35",
        fill: "none",
        stroke: "white",
        "stroke-width": "1.3",
      },
      {
        d: "M 13.1 6.3 C 18.16 6.46 22.69 9.85 24.7 15 C 22.69 20.15 18.16 23.54 13.1 23.7 L 5.85 23.7 C 8.96 18.32 8.96 11.68 5.85 6.3 Z",
        fill: "rgb(241, 243, 244)",
        stroke: "black",
        "stroke-width": "1.3",
      },
    ],
    width: "32px",
    height: "32px",
  },
];
</script>

<template>
  <aside
    class="justify-center h-screen p-5 m-3 text-white border-2 border-white rounded-lg w-60"
  >
    <h5 class="p-4">Gates</h5>
    <div class="flex gap-3 ml-3">
      <div
        v-for="gate in svgData"
        :key="gate.id"
        id="draggable"
        @dragstart="(e) => e.dataTransfer.setData('text/plain', gate.id)"
        draggable="true"
        class="w-10 h-10"
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
