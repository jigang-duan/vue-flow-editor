<template>
  <div class="flow-palette">
    <el-input
      v-model="search"
      placeholder="过滤节点"
      prefix-icon="el-icon-search"
    />
    <div class="scroll">
      <el-collapse v-model="activeGroupIDs">
        <el-collapse-item
          v-for="group in filterGroups"
          :key="group.id"
          :title="group.title"
          :name="group.id"
        >
          <palette-node v-for="node in group.nodes" :key="node.id" :data="node" />
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="footer">
      <el-button class="mini" icon="el-icon-arrow-up" @click="closeAll" />
      <el-button class="mini" icon="el-icon-arrow-down" @click="openAll" />
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { PaletteNode } from './components'

const { mapState, mapActions } = createNamespacedHelpers('flow/type')

export default {
  name: 'FlowPalette',
  components: {
    PaletteNode
  },
  data() {
    return {
      activeGroupIDs: [],
      search: ''
    }
  },
  computed: {
    ...mapState({
      groups: state => state.groups
    }),
    filterGroups: function() {
      return this.search &&
        this.groups.map(group => ({
          ...group,
          nodes: group.nodes.filter(node => node.name.includes(this.search))
        })) ||
        this.groups
    }
  },
  watch: {
    search(value) {
      this.activeGroupIDs = this.filterGroups.map(g => g.id)
    }
  },
  mounted() {
    this.getGroups()
  },
  methods: {
    ...mapActions({
      getGroups: 'getGroups'
    }),
    openAll() {
      this.activeGroupIDs = this.groups.map(g => g.id)
    },
    closeAll() {
      this.activeGroupIDs = []
    }
  }
}
</script>

<style lang="scss">
  @import "@flow/styles/index.scss";
  .flow-palette {
    .el-collapse-item__header {
      padding-left: 6px;
      background-color: $palette-header-background;
    }
    .el-collapse-item__content {
      padding-bottom: 0;
    }
  }
</style>

<style lang="scss" scoped>
   @import "@flow/styles/index.scss";

  .flow-palette {
    .scroll {
      position: absolute;
      top: 35px;
      right: 0;
      bottom: 25px;
      left: 0;
      padding: 0;
      overflow-y: auto;
      box-sizing: border-box;
    }
    .footer {
      border-top: 1px solid $primary-border-color;
      background: $background-color;
      text-align: right;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 25px;
      line-height: 23px;
      padding: 0 10px;
      user-select: none;
    }
    .mini {
      padding: 2px 2px;
      margin-left: 0;
    }
  }
</style>
