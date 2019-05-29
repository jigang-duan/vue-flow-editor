<template>
  <div class="container" @mouseup="onMouseUp" @mousemove="onMouseMove">
    <div
      class="workspace"
      :class="{'ws-palette-closed':!paletteOpened, 'ws-sidebar-closed':!sidebarOpened}"
      :style="{ right: (separatorWidth + 7) + 'px' }"
    >
      <slot name="workspace" />
    </div>
    <div
      class="palette"
      :class="{'palette-closed':!paletteOpened}"
      @mouseenter="sidbarShowed.left = true"
      @mouseleave="sidbarShowed.left = false"
    >
      <div v-show="paletteOpened"><slot name="palette" /></div>
      <div v-show="sidbarShowed.left" class="sidbar-left" @click="togglePalette">
        <i class="el-icon-arrow-left" />
      </div>
    </div>
    <div />
    <div
      v-show="sidebarOpened"
      class="sidebar"
      :class="{'sidebar-closing': sidebarClosing}"
      :style="{ width: separatorWidth + 'px' }"
    >
      <slot name="sidebar" />
    </div>
    <div
      class="sidebar-separator"
      :style="{ right: separatorWidth + 'px' }"
      @mouseenter="sidbarShowed.right = true"
      @mouseleave="sidbarShowed.right = false"
      @mousedown="onMouseDown"
    >
      <div v-show="sidbarShowed.right" class="sidbar-right" @click="toggleSidebar">
        <i class="el-icon-arrow-right" />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Layout',
  data() {
    return {
      sidbarShowed: {
        left: false,
        right: false
      },
      paletteOpened: true,
      sidebarOpened: false,
      sidebarClosing: false,
      separator: {
        width: 315
      },
      moving: {
        active: false
      }
    }
  },
  computed: {
    separatorWidth() {
      return this.sidebarOpened ? this.separator.width : 0
    }
  },
  methods: {
    togglePalette() {
      this.paletteOpened = !this.paletteOpened
    },
    toggleSidebar() {
      this.sidebarOpened = !this.sidebarOpened
    },
    onMouseDown() {
      this.moving.active = true
    },
    onMouseUp(e) {
      this.moving.active = false
      if (this.sidebarClosing) {
        this.sidebarClosing = false
        this.sidebarOpened = false
      }
    },
    onMouseMove(e) {
      if (e.buttons === 0 || e.which === 0) {
        this.moving.active = false
      }
      if (this.moving.active && this.sidebarOpened) {
        const newSidebarWidth = e.currentTarget.offsetWidth - e.pageX
        if (newSidebarWidth < 150) {
          this.sidebarClosing = true
        } else {
          this.sidebarClosing = false
          if (newSidebarWidth < (e.currentTarget.offsetWidth * 0.4)) {
            this.separator.width = newSidebarWidth
          }
        }

        this.$emit('sidebar:resize')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@flow/styles/index.scss";

  .container {
    position: absolute;
    top: 0; left: 0; bottom: 0; right :0;
    overflow: hidden;
  }

  .workspace {
    position: absolute;
    margin: 0;
    top: 0px;
    left: 179px;
    bottom: 0px;
    right: 322px;
    overflow: hidden;
    @include component-border;
    transition: left 0.1s ease-in-out;
  }

  .palette {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left:0px;
    background: #f3f3f3;
    width: 180px;
    text-align: center;
    user-select: none;
    @include component-border;
    transition: width 0.2s ease-in-out;
    &-closed {
      width: 7px;
    }
  }

  .sidebar {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    width: 315px;
    background: #fff;
    box-sizing: border-box;
    z-index: 10;
    @include component-border;
    &-separator {
      position: absolute;
      top: 5px;
      right: 315px;
      bottom:10px;
      width: 7px;
      z-index: 11;
      background: $background-color url(~@/assets/images/grip.png) no-repeat 50% 50%;
      cursor: col-resize;
    }
    &-closing {
      background: #eee;
      border-color: $primary-color;
      border-style: dashed;
    }
  }

  .sidbar {
    &-left {
      @include sidbar;
      left: calc(100%);
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
    &-right {
      @include sidbar;
      right: calc(100%);
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }
  }

  .ws {
    &-palette-closed {
      left: 7px;
    }
    &-sidebar-closed {
      right: 7px;
    }
  }

</style>
