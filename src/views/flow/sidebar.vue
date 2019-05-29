<template>
  <div class="flow-sidebar">
    <tabs v-model="tab">
      <tab-pane name="info" label="信息" icon="info">
        ...
      </tab-pane>
      <tab-pane name="config" label="配置" icon="settings">
        ...
      </tab-pane>
    </tabs>
    <footer />
  </div>
</template>

<script>
import { Tabs, TabPane } from './components'

export default {
  name: 'FlowSidebar',
  components: {
    Tabs,
    TabPane
  },
  data() {
    return {
      tab: 'info'
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import "@flow/styles/index.scss";

.flow-sidebar {
  footer {
    @include component-footer;
  }
}
</style>
