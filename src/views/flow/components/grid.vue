<template>
  <g class="grid" :style="{visibility: visibility}">
    <line
      v-for="tick in gridTicks"
      :key="`flow-grid-horizontal-${tick}`"
      class="horizontal"
      x1="0"
      :x2="spaceSize"
      :y1="tick"
      :y2="tick"
      fill="node"
      shape-rendering="crispEdges"
      stroke="#eee"
      stroke-width="1px"
    />
    <line
      v-for="tick in gridTicks"
      :key="`flow-grid-vertical-${tick}`"
      class="vertical"
      :x1="tick"
      :x2="tick"
      y1="0"
      :y2="spaceSize"
      fill="node"
      shape-rendering="crispEdges"
      stroke="#eee"
      stroke-width="1px"
    />
  </g>
</template>

<script>
export default {
  name: 'FlowGrid',
  props: {
    spaceSize: {
      type: Number,
      default: 5000
    },
    gridSize: {
      type: Number,
      default: 20
    },
    visibility: {
      type: String,
      default: 'visible'
    }
  },
  data() {
    return {
    }
  },
  computed: {
    gridTicks: function() {
      const ticks = []
      for (let i = 0; i < this.spaceSize; i += +this.gridSize) {
        ticks.push(i)
      }
      return ticks
    }
  }
}
</script>
