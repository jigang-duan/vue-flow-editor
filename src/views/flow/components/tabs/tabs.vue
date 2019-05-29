<template>
  <div class="tabs el-tabs--card ">
    <div class="tabs__header">
      <div>
        <ul>
          <li v-for="pane in panes" v-show="currentName === pane.name" :key="pane.name" class="tab tab-pinned" style="width:201px;">
            <a class="tab-label" title="pane.name">
              <svg-icon :icon-class="pane.icon || 'example'" />
              <span class="bidiAware">{{ pane.label || pane.name }}</span>
            </a>
            <span class="tabs-badges" />
          </li>
        </ul>
      </div>
      <div class="tab-link-buttons">
        <a v-for="pane in panes" :key="pane.name" class="tab-link-button tab-link-pinned" @click="handleTabClick(pane, pane.name, $event)">
          <svg-icon :icon-class="pane.icon || 'example'" />
        </a>
      </div>
    </div>
    <div class="tabs__content">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'Tabs',
  componentName: 'Tabs',
  props: {
    activeName: {
      type: String,
      default: null
    },
    value: {
      type: String,
      default: null
    }
  },
  provide() {
    return {
      rootTabs: this
    }
  },
  data() {
    return {
      currentName: this.value || this.activeName,
      panes: []
    }
  },
  computed: {
  },
  mounted() {
    this.calcPaneInstances()
  },
  updated() {
    this.calcPaneInstances()
  },
  methods: {
    handleTabClick(tab, tabName, event) {
      if (tab.disabled) return
      this.setCurrentName(tabName)
      this.$emit('tab-click', tab, event)
    },
    setCurrentName(value) {
      const changeCurrentName = () => {
        this.currentName = value
        this.$emit('input', value)
      }
      changeCurrentName()
    },
    calcPaneInstances(isForceUpdate = false) {
      if (this.$slots.default) {
        const paneSlots = this.$slots.default.filter(vnode => vnode.tag &&
          vnode.componentOptions && vnode.componentOptions.Ctor.options.name === 'TabPane')
        // update indeed
        const panes = paneSlots.map(({ componentInstance }) => componentInstance.$props)
        const panesChanged = !(panes.length === this.panes.length && panes.every((pane, index) => pane === this.panes[index]))
        if (isForceUpdate || panesChanged) {
          this.panes = panes
        }
      } else if (this.panes.length !== 0) {
        this.panes = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@flow/styles/index.scss";

  .tabs {
    .tabs__header {
      position: relative;
      background: #fff;
      overflow: hidden;
      height: 35px;
      box-sizing: border-box;
      ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        display: block;
        height: 35px;
        box-sizing: border-box;
        border-bottom: 1px solid $primary-border-color;
        white-space: nowrap;
        user-select: none;
        li {
          box-sizing: border-box;
          display: inline-block;
          border: 1px solid $primary-border-color;
          background: $background-color;
          margin: 3px 3px 0 3px;
          height: 32px;
          line-height: 29px;
          max-width: 200px;
          width: 14%;
          overflow: hidden;
          white-space: nowrap;
          position: relative;
          a {
            &.tab-label {
              display: block;
              font-size: 14px;
              padding-left: 12px;
              width: 100%;
              height: 100%;
              color: #666;
              .bidiAware {
                margin-left: 8px;
              }
            }
          }
        }
      }
      .tab-link-buttons {
        position: absolute;
        box-sizing: border-box;
        top: 0;
        right: 0;
        height: 35px;
        background: #fff;
        border-bottom: 1px solid $primary-border-color;
        z-index: 2;
        a {
          user-select: none;
          box-sizing: border-box;
          display: inline-block;
          color: #888;
          background: #eee;
          border: 1px solid #ccc;
          text-align: center;
          margin: 0;
          text-decoration: none;
          cursor: pointer;
          line-height: 26px;
          height: 28px;
          width: 28px;
          margin: 4px 3px 3px;
          z-index: 2;
          &:not(disabled):active {
            color: #666;
            background: #efefef;
            text-decoration: none;
          }
          &:not(disabled):hover {
            color: #666;
            background: #ddd;
          }
          &.selected {
            color: #888;
            background: #fff;
            border-bottom-width: 2px;
            border-bottom-color: #aaa;
            margin-bottom: 0;
            cursor: default;
          }
        }
      }
    }

  }
</style>
