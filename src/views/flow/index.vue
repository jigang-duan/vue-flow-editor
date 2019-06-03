<template>
  <div>
    <github-corner v-if="false" />
    <layout>
      <workspace slot="workspace" />
      <palette slot="palette" />
      <sidebar slot="sidebar" />
    </layout>
  </div>
</template>

<script>
import { Layout } from './components'
import GithubCorner from '@/components/GithubCorner'
import Workspace from './workspace'
import Palette from './palette'
import Sidebar from './sidebar'

export default {
  name: 'Flow',
  components: {
    Workspace,
    Palette,
    Sidebar,
    Layout,
    GithubCorner
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
</style>

<style lang="scss" scoped>
  /* @import "./styles/index.scss";
  .flow {
    &-container {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: hidden;
    }
  } */
</style>
