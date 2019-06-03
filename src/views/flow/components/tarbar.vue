<template>
  <div class="tarbar">
    <div v-for="group in itemGroups" :key="group.name" class="group">
      <el-tooltip v-for="item in group.items" :key="item.name" class="item" effect="dark" :content="item.label" placement="bottom">
        <el-button :disabled="invalid(item.name)" class="command" @click="click(item.name)">
          <svg-icon :icon-class="item.name" />
        </el-button>
      </el-tooltip>
      <div class="divider" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabBar',
  props: {
    itemGroups: {
      type: Array,
      default: function() {
        return [
          {
            name: 'edit',
            items: [
              {
                label: '复制',
                name: 'copy'
              },
              {
                label: '粘贴',
                name: 'paste'
              },
              {
                label: '删除',
                name: 'delete'
              }
            ]
          },
          {
            name: 'group',
            items: [
              {
                label: '添加组',
                name: 'addGroup'
              },
              {
                label: '取消组',
                name: 'ungroup'
              },
              {
                label: '进入组',
                name: 'enterGroup'
              }
            ]
          }
        ]
      }
    },
    actives: {
      type: Object,
      default: function() {
        return {
          copy: false,
          paste: false,
          delete: false,
          addGroup: false,
          ungroup: false,
          enterGroup: false
        }
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
    invalid(name) {
      return !this.actives[name]
    },
    click(name) {
      this.$emit('tarbar-action', name)
    }
  }
}
</script>

<style lang="scss" scoped>
.tarbar {
  padding: 8px;
  .group {
    display: inline-block;
    .command {
      padding: 8px 8px;
      border: 1px solid #fff;
      margin-left: 0;
    }
    .divider {
      display: inline-block;
      width: 1px;
      height: 1em;
      margin: 0 8px;
      vertical-align: middle;
      position: relative;
      background-color: #dcdfe6;
    }
  }
}
</style>
