<template>
  <div class="flow-sidebar">
    <tabs v-model="tab">
      <tab-pane name="info" label="信息" icon="info">
        <info-content />
      </tab-pane>
      <tab-pane name="config" label="配置" icon="settings">
        ...
      </tab-pane>
    </tabs>
    <footer />
  </div>
</template>

<script>
import { Tabs, TabPane, InfoContent } from './components'

export default {
  name: 'FlowSidebar',
  components: {
    Tabs,
    TabPane,
    InfoContent
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
