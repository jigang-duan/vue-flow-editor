<template>
  <div
    v-if="(!lazy || loaded) || active"
    v-show="active"
    :id="`pane-${paneName}`"
    class="el-tab-pane"
    role="tabpanel"
    :aria-hidden="!active"
    :aria-labelledby="`tab-${paneName}`"
  >
    <slot />
  </div>
</template>
<script>
export default {
  name: 'TabPane',
  componentName: 'TabPane',
  props: {
    // label: String,
    // labelContent: Function,
    name: {
      type: String,
      default: ''
    },
    closable: Boolean,
    disabled: Boolean,
    lazy: Boolean,
    icon: {
      type: String,
      default: 'example'
    }
  },
  data() {
    return {
      index: null,
      loaded: false
    }
  },
  computed: {
    isClosable() {
      return this.closable || this.$parent.closable
    },
    active() {
      const active = this.$parent.currentName === (this.name || this.index)
      if (active) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.loaded = true
      }
      return active
    },
    paneName() {
      return this.name || this.index
    }
  },
  updated() {
    this.$parent.$emit('tab-nav-update')
  }
}
</script>
