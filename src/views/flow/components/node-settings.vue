<template>
  <div class="node-settings">
    <form-create v-model="fApi" :rule="rule" :option="option" @goods-name-change="change" />
  </div>
</template>

<script>

export default {
  name: 'NodeSettings',
  components: {
  },
  props: {
  },
  data() {
    const vm = this
    return {
      fApi: {},
      formData: {},
      rule: [
        { 'type': 'input', 'field': 'name', 'title': '名称', 'value': 'mi' },
        {
          'type': 'checkbox',
          'field': 'enabled',
          'title': '使能',
          'value': ['1'],
          'options': [
            {
              'value': '1',
              'label': '',
              'disabled': false
            }
          ]
        }
      ],
      option: {
        // 显示表单重置按钮
        resetBtn: false,
        // 表单提交事件
        onSubmit: function(formData) {
          alert(JSON.stringify(formData))
          // 按钮进入提交状态
          vm.fApi.btn.loading()
          // 重置按钮禁用
          vm.fApi.resetBtn.disabled()
          // 按钮进入可点击状态
          //                    $f.btn.finish();
        },
        mounted: function() {
          vm.fApi.setValue({ 'name': 'fdsfdsfd' })
        },
        form: {
          inline: false,
          labelPosition: 'right',
          labelSuffix: undefined,
          hideRequiredAsterisk: false,
          labelWidth: '80px',
          showMessage: true,
          inlineMessage: false,
          statusIcon: false,
          validateOnRuleChange: true,
          disabled: false,
          size: 'small' // medium / small / mini
        },
        submitBtn: {
          type: undefined,
          size: 'small',
          plain: true,
          round: false,
          circle: false,
          loading: false,
          disabled: false,
          // icon: 'el-icon-upload',
          icon: '',
          // width: '40%',
          autofocus: false,
          nativeType: 'button',
          innerText: '更新配置',
          show: true,
          col: undefined,
          click: undefined
        }
      }
    }
  },
  computed: {
  },
  methods: {
    change: function(...arg) {
      console.log(arg)
    }
  }
}
</script>

<style lang="scss">

.node-settings {
  .form-create {
    padding: 8px;
  }
}
</style>

<style lang="scss" scoped>
</style>
