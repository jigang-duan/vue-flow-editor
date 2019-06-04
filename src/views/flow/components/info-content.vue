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
  },
  data() {
    return {
      active: [],
      infos: [
        {
          key: '1',
          title: '信息',
          component: 'InfoTable',
          value: {
            infos: [
              {
                key: '名称',
                value: 'Flow'
              },
              {
                key: 'uncaught',
                value: false
              }
            ]
          }
        },
        {
          key: '2',
          title: '全局状态',
          component: 'InfoTable',
          value: {
            infos: [
              {
                key: '线程数',
                value: 0
              },
              {
                icon: 'list',
                value: '14,655 / 23.98 MB'
              },
              {
                key: '控制器传输个数',
                value: 0
              },
              {
                icon: 'play',
                value: 15
              },
              {
                icon: 'stop',
                value: 223
              },
              {
                icon: 'warning',
                value: 13
              },
              {
                icon: 'disabled',
                value: 7
              },
              {
                icon: 'check',
                value: 0
              },
              {
                icon: 'asterisk',
                value: 0
              },
              {
                icon: 'arrow-circle-up',
                value: 0
              },
              {
                icon: 'exclamation-circle',
                value: 0
              },
              {
                icon: 'question',
                value: 0
              },
              {
                icon: 'refresh',
                value: '15:56:27 CST'
              }
            ]
          }
        },
        {
          key: '3',
          title: '描述',
          component: 'Viewer',
          value: '# This is Viewer.\n Hello World.'
        }
      ]
    }
  },
  computed: {
  }
}
</script>

