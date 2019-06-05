<template>
  <div class="flow-sidebar">
    <tabs v-model="tab">
      <tab-pane name="info" label="信息" icon="info">
        <info-content :infos="infos" />
      </tab-pane>
      <tab-pane name="config" label="配置" icon="settings">
        <node-settings />
      </tab-pane>
    </tabs>
    <footer />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { Tabs, TabPane, InfoContent, NodeSettings } from './components'

const { mapState: infoState } = createNamespacedHelpers('flow/info')

export default {
  name: 'FlowSidebar',
  components: {
    Tabs,
    TabPane,
    InfoContent,
    NodeSettings
  },
  data() {
    return {
      tab: 'info'
    }
  },
  computed: {
    ...infoState({
      infos: state => state.content
    })
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
