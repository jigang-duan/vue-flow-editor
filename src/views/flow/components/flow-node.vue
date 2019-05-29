<template>
  <g :id="value.id" ref="thisNode" class="flow-node node nodegroup" :transform="`translate(${x},${y})`">
    <rect
      class="node"
      :class="{ 'node_selected': selected }"
      rx="5"
      ry="5"
      :fill="value.style.color"
      :width="width"
      :height="height"
      @mouseup="nodeMouseUp"
      @mousedown="nodeMouseDown"
    />
    <g class="node_icon_group" x="0" y="0" :transform="`translate(${value.iconOnRight ? width-30 : 0},0)`" style="pointer-events: none;">
      <rect x="0" y="0" class="node_icon_shade" width="30" stroke="node" fill="#000" fill-opacity="0.05" height="30" />
      <image :href="value.icon" class="node_icon" x="5" y="0" width="20" height="30" />
      <path d="M 30 1 l 0 28" class="node_icon_shade_border" stroke-opacity="0.1" stroke="#000" stroke-width="1" />
    </g>
    <text class="node_label" x="38" y="14" dy=".35em" text-anchor="start">{{ value.label }}</text>
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
    <g
      v-if="value.hasInput"
      ref="inputGroup"
      class="port_input"
      transform="translate(-5, 10)"
    >
      <rect
        class="port"
        :class="{ 'port_hovered': value.port.inputActive }"
        rx="3"
        ry="3"
        width="10"
        height="10"
        @mousedown="portMouseDown($event, FLOW.VIEW.PORT_TYPE_INPUT)"
        @mouseup="portMouseUp($event, FLOW.VIEW.PORT_TYPE_INPUT)"
        @mouseover="portMouseOver($event, FLOW.VIEW.PORT_TYPE_INPUT)"
        @mouseout="portMouseOut($event, FLOW.VIEW.PORT_TYPE_INPUT)"
      />
    </g>
    <g
      v-if="value.hasOutput"
      ref="outputGroup"
      class="port_output"
      :transform="`translate(${width-5}, 10)`"
    >
      <rect
        class="port"
        :class="{ 'port_hovered': value.port.outputActive }"
        rx="3"
        ry="3"
        width="10"
        height="10"
        @mousedown="portMouseDown($event, FLOW.VIEW.PORT_TYPE_OUTPUT)"
        @mouseup="portMouseUp($event, FLOW.VIEW.PORT_TYPE_OUTPUT)"
        @mouseover="portMouseOver($event, FLOW.VIEW.PORT_TYPE_OUTPUT)"
        @mouseout="portMouseOut($event, FLOW.VIEW.PORT_TYPE_OUTPUT)"
      />
    </g>
  </g>
</template>

<script>

export default {
  name: 'FlowNode',
  props: {
    value: {
      type: Object,
      default: function() {
        return {
          id: '',
          label: '测试',
          hasInput: true,
          hasOutput: true,
          iconOnRight: false,
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
            h: 30
          },
          icon: '',
          style: {
            color: 'silver'
          },
          port: {
            inputActive: false,
            outputActive: false
          }
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
      // return 80 + (this.value.label.length) * 10
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
    }
  },
  methods: {
    portMouseOver(event, portType) {
      this.$emit('portMouseOver', {
        event,
        portType,
        d: this.value,
        portIndex: 0
      })
    },
    portMouseOut(event, portType) {
      this.$emit('portMouseOut', {
        event,
        portType,
        d: this.value,
        portIndex: 0
      })
    },
    portMouseUp(event, portType) {
      this.$emit('portMouseUp', {
        event,
        portType,
        d: this.value,
        portIndex: 0
      })
    },
    portMouseDown(event, portType) {
      this.$emit('portMouseDown', {
        event,
        portType,
        d: this.value,
        portIndex: 0
      })
    },
    nodeMouseUp(event) {
      this.$emit('nodeMouseUp', {
        event,
        d: this.value
      })
    },
    nodeMouseDown(event) {
      this.$emit('nodeMouseDown', {
        event,
        d: this.value
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@flow/styles/index.scss";

  .flow-node {
    .node {
      /* stroke: #999; */
      cursor: move;
      stroke-width: 1;
      &_selected {
        stroke-width: 2;
        stroke: $node-selected-color;
      }
    }
    .node_label {
      stroke-width: 0;
      fill: #333;
      font-size: 14px;
      pointer-events: none;
      -webkit-touch-callout: none;
      user-select: none;
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
    .port {
      stroke: #999;
      stroke-width: 1;
      fill: #ddd;
      cursor: crosshair;
      &_hovered {
        stroke: $port-selected-color;
        fill:  $port-selected-color;
      }
    }

  }
</style>
