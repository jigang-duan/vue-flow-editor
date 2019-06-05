<template>
  <div
    :id="data.id"
    class="palette_node"
    :style="data.style"
    draggable="true"
    @dragstart="dragstart"
    @dragend="dragend"
  >
    <span class="label" :class="{'label_right': data.iconOnRight}">{{ $t(data.name) }}</span>
    <div class="icon_container" :class="{'icon_container_right': data.iconOnRight}">
      <img :src="data.icon" class="icon">
    </div>
    <div v-if="data.hasOutput" class="port port_output" />
    <div v-if="data.hasInput" class="port port_input" />
  </div>
</template>

<script>

export default {
  name: 'PaletteNode',
  props: {
    data: {
      type: Object,
      default: function() {
        return {
          id: '',
          name: 'inject',
          icon: '',
          iconOnRight: false,
          style: {
            height: '28px',
            'background-color': 'rgba(0, 0, 0, 0.05)'
          },
          hasInput: false,
          hasOutput: true
        }
      }
    }
  },
  methods: {
    dragstart(event) {
      event.dataTransfer.setData('node_id', this.data.id)
      event.dataTransfer.setData('node_touch_x', event.offsetX)
      event.dataTransfer.setData('node_touch_y', event.offsetY)
    },
    dragend(event) {
      event.dataTransfer.clearData()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@flow/styles/index.scss";

  .palette_node {
    display: block;
    cursor: move;
    background: #ddd;
    margin: 10px auto;
    height: 25px;
    border-radius: 5px;
    border: 1px solid #999;
    background-position: 5% 50%;
    background-repeat: no-repeat;
    width: $palette-width - 40px;
    background-size: contain;
    position: relative;
    &:hover {
      border-color: $node-selected-color;
      background-color: #eee;
      .port {
        border-color: #999;
        background-color: #eee;
      }
    }

    .label {
      font-size: 13px;
      margin: 4px 0 4px 32px;
      line-height: 20px;
      overflow: hidden;
      text-align: center;
      user-select: none;
      &_right {
        margin: 4px 32px 4px 0;
      }
    }

    .icon_container {
      position: absolute;
      text-align: center;
      top:0;
      bottom:0;
      left:0;
      width: 30px;
      border-right: 1px solid rgba(0,0,0,0.1);
      background-color: rgba(0,0,0,0.05);
      .icon {
        display: inline-block;
        width: 20px;
        height: 100%;
        background-position: 50% 50%;
        background-size: contain;
        background-repeat: no-repeat;
      }
      &_right {
        left: auto;
        right: 0;
        border-right: none;
        border-left: 1px solid rgba(0,0,0,0.1);
      }
    }

    .port {
      position: absolute;
      top:8px;
      left: -5px;
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      background:#d9d9d9;
      border-radius: 3px;
      width: 10px;
      height: 10px;
      border: 1px solid #999;
      &_output {
        left: auto;
        right: -6px;
      }
    }
  }
</style>
