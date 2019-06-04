<template>
  <table class="info-table">
    <tbody>
      <tr v-for="(info, index) in infos" :key="index" class="row">
        <td>
          <svg-icon v-if="!!info.icon" :icon-class="info.icon" />
          <span v-else>{{ info.key }}</span>
        </td>
        <td>
          <span
            class="message-row message-element"
            :class="{ 'type-other': typeOther(info.value) }"
          >
            {{ info.value }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'InfoTable',
  props: {
    value: {
      type: Object,
      default: function() {
        return {
          infos: [
            {
              key: '名称',
              value: 'NiFi Flow'
            },
            {
              key: 'uncaught',
              value: false
            }
          ]
        }
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
    infos: function() {
      return this.value && this.value.infos || []
    }
  },
  methods: {
    typeOther(value) {
      return typeof value === 'number' || typeof value === 'boolean'
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@flow/styles/index.scss";

.info-table {
  max-width: 100%;
  background-color: transparent;
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 14px;
  margin: 0 0 10px;
  width: 100%;
  tbody {
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
    tr {
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      td {
        &:first-child {
          color: #444;
          vertical-align: top;
          width: 90px;
          padding: 3px 3px 3px 6px;
          background: #f9f9f9;
          border-right: 1px solid #ddd;
        }
        &:last-child {
          padding: 3px 3px 3px 6px;
          color: #666;
          overflow-y: hidden;
        }
        .message-row {
          display: block;
          padding: 4px 2px 2px;
          position: relative;
        }
        .message-element {
          color: #333;
          font-family: Menlo, monospace;
          font-size: 13px;
          line-height: 1.3em;
        }
        .type-other {
          color: #775351;
        }
      }
    }
  }
}

</style>
