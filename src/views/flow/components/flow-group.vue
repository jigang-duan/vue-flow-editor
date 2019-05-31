<template>
  <g ref="thisGroup" class="flow-group" :transform="`translate(${x},${y})`">
    <rect
      class="node"
      :class="{ 'node_selected': selected }"
      rx="5"
      ry="5"
      :fill="value.style.color"
      :width="width"
      :height="height"
      @mouseup="groupMouseUp"
      @mousedown="groupMouseDown"
    />
    <g class="node_icon_group" x="0" y="0" transform="translate(0,0)" style="pointer-events: none;">
      <rect x="0" y="0" class="node_icon_shade" width="30" stroke="node" fill="#000" fill-opacity="0.05" height="30" />
      <image :href="value.icon" class="node_icon" x="5" y="0" width="20" height="30" />
      <path d="M 30 1 l 0 28" class="node_icon_shade_border" stroke-opacity="0.1" stroke="#000" stroke-width="1" />
      <text class="node_label" x="38" y="14" dy=".35em" text-anchor="start">{{ value.label }}</text>
      <text class="node_count" :x="width/2" :y="height/2" dy="0.65em" text-anchor="middle">{{ nodeCount }}</text>
    </g>
    <g v-if="value.status && value.status.show" class="node_status_group" :transform="`translate(3,${height+3})`">
      <rect class="node_status" x="6" y="1" width="9" height="9" rx="2" ry="2" stroke-width="3" />
      <text class="node_status_label" x="20" y="10">{{ value.status.label }}</text>
    </g>
    <polygon
      v-if="value.error"
      class="node_error"
      :points="`${width-26},3 ${width-22},-5 ${width-18},3`"
      style="fill:red;stroke:purple;stroke-width:1"
    />
    <circle
      v-if="value.changed"
      class="node_changed"
      :cx="width-10"
      cy="-1"
      r="4"
      stroke="black"
      stroke-width="1"
      fill="cyan"
    />
  </g>
</template>

<script>

export default {
  name: 'FlowGroup',
  props: {
    value: {
      type: Object,
      default: function() {
        return {
          id: '',
          label: '新建分组',
          error: false,
          changed: false,
          status: {
            show: false,
            label: ''
          },
          rect: {
            x: 100,
            y: 125,
            w: 140,
            h: 70
          },
          icon: 'icons/node-red/folder.png',
          style: {
            color: 'RGBA(242, 244, 245, 1.00)'
          },
          count: 0
        }
      }
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    width: function() {
      return this.value.rect.w
    },
    height: function() {
      return this.value.rect.h
    },
    x: function() {
      return this.value.rect.x - this.value.rect.w / 2
    },
    y: function() {
      return this.value.rect.y - this.value.rect.h / 2
    },
    nodeCount: function() {
      if (this.value.content) {
        return this.value.content.nodes && this.value.content.nodes.length || 0
      }
      return this.value.count
    }
  },
  methods: {
    groupMouseUp(event) {
      this.$emit('groupMouseUp', {
        event,
        g: this.value
      })
    },
    groupMouseDown(event) {
      this.$emit('groupMouseDown', {
        event,
        g: this.value
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@flow/styles/index.scss";

  .flow-group {
    .node {
      cursor: move;
      stroke-width: 1;
      &_selected {
        stroke-width: 2;
        stroke: $node-selected-color;
      }
    }
    .node_icon_group {
      .node_label {
        stroke-width: 0;
        fill: #333;
        font-size: 14px;
        pointer-events: none;
        -webkit-touch-callout: none;
        user-select: none;
      }
      .node_count {
        stroke-width: 0;
        fill: RGBA(112, 189, 215, 1.00);
        font-size: 32px;
        pointer-events: none;
        -webkit-touch-callout: none;
        user-select: none;
      }
    }
    .node_status_group {
      .node_status_label {
        stroke-width: 0;
        fill: #888;
        font-size:9pt;
        stroke:#000;
        text-anchor:start;
        user-select: none;
      }
    }

  }
</style>
