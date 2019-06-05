<template>
  <div class="info-content">
    <el-collapse v-model="active">
      <el-collapse-item v-for="info in infos" :key="info.key" :title="info.title" :name="info.key">
        <component :is="info.component" :value="info.value">{{ info.title }}</component>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import 'tui-editor/dist/tui-editor-contents.css'
import 'highlight.js/styles/github.css'
import { Viewer } from '@toast-ui/vue-editor'
import InfoTable from './info-table'

export default {
  name: 'InfoContent',
  components: {
    InfoTable,
    Viewer
  },
  props: {
    infos: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      active: []
    }
  },
  computed: {
  }
}
</script>

