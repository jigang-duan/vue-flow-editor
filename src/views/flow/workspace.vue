<template>
  <div class="flow-workspace">
    <header>
      <tarbar :actives="tarbarEnabled" @tarbar-action="tarbarAction" />
      <div>...</div>
    </header>
    <div ref="chart" class="chart" @drop="drop" @dragover.prevent>
      <svg
        ref="outer"
        :width="spaceWidth"
        :height="spaceHeight"
        pointer-events="all"
        style="cursor: crosshair;"
      >
        <g>
          <g
            ref="vis"
            class="innerCanvas"
            :transform="`scale(${scale})`"
            @mousemove="canvasMouseMove"
            @mousedown="canvasMouseDown"
            @mouseup="canvasMouseUp"
          >
            <rect class="outer_background" :width="spaceWidth" :height="spaceHeight" fill="#fff" />
            <flow-grid :spaceSize="spaceWidth" :gridSize="gridSize" />
            <g class="connections" pointer-events="stroke">
              <g
                v-for="line in lines"
                :key="line.id"
                class="link"
                :class="{ 'link_selected': selectedLink === line.id }"
              >
                <path
                  class="link_background link_path"
                  :d="line | LinkPath"
                  @mousedown.stop="linkMousedown($event, line)"
                  @mouseup.stop="linkMouseup($event, line)"
                />
                <path class="link_outline link_path" :d="line | LinkPath" />
                <path class="link_line link_path" :d="line | LinkPath" />
              </g>
            </g>
            <g class="processors" pointer-events="all">
              <flow-node
                v-for="processor in processors"
                :key="processor.id"
                :value="processor"
                :selected="isSelected(processor)"
                @portMouseOver="portMouseOver"
                @portMouseOut="portMouseOut"
                @nodeMouseDown="nodeMouseDown"
                @nodeMouseUp="nodeMouseUp"
                @portMouseDown="portMouseDown"
                @portMouseUp="portMouseUp"
              />
            </g>
            <g class="process-groups" pointer-events="all">
              <flow-group
                v-for="group in groups"
                :key="group.id"
                :value="group"
                :selected="isSelected(group, true)"
                @groupMouseDown="groupMouseDown"
                @groupMouseUp="groupMouseUp"
              />
            </g>
            <rect
              v-if="lasso.show"
              class="lasso"
              :ox="lasso.ox"
              :oy="lasso.oy"
              rx="1"
              ry="1"
              :x="lasso.x"
              :y="lasso.y"
              :width="lasso.width"
              :height="lasso.height"
            />
            <g ref="dragGroup">
              <path v-if="!!dragLine" class="drag_line" :d="dragLine.d" />
            </g>
          </g>
        </g>
      </svg>
    </div>
    <footer>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item v-for="breadcrumb in breadcrumbs" :key="breadcrumb" :to="{ path: `/flow?id=${breadcrumb}` }">{{ breadcrumb }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="footer-buttons">
        <el-button class="mini" icon="el-icon-zoom-out" @click="scale -= 0.1" />
        <el-button class="mini" icon="el-icon-rank" @click="scale = 1.0" />
        <el-button class="mini" icon="el-icon-zoom-in" @click="scale += 0.1" />
        <el-button class="mini" icon="el-icon-news" />
        &nbsp;
      </div>
    </footer>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import {
  nodeInfoByEvent,
  calcMousePosition,
  mouseAtNode,
  generateLinkPath,
  getAllFlowNodes,
  computeLine
} from './utils'
import { FlowGrid, FlowNode, FlowGroup, Tarbar } from './components'

const { mapState, mapActions } = createNamespacedHelpers('flow/chat')

export default {
  name: 'FlowWorkspace',
  components: {
    FlowGrid,
    FlowNode,
    FlowGroup,
    Tarbar
  },
  filters: {
    LinkPath: function({ source, target }) {
      const sc = 1
      const origX = source.rect.x + sc * source.rect.w / 2
      const origY = source.rect.y
      const destX = target.rect.x - sc * target.rect.w / 2
      const destY = target.rect.y
      return generateLinkPath(origX, origY, destX, destY, sc)
    }
  },
  data() {
    return {
      spaceWidth: 5000,
      spaceHeight: 5000,
      scale: 1.0,
      gridSize: 20,
      mouseMode: this.FLOW.state.DEFAULT,
      movingSet: [],
      selectedLink: null,
      dragLine: null,
      lasso: {
        show: false,
        ox: 0,
        oy: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0
      },
      copySet: []
    }
  },
  computed: {
    ...mapState({
      processors: state => state.processors,
      links: state => state.links,
      groups: state => state.groups,
      breadcrumbs: state => state.flowGroupIDs
    }),
    lines() {
      return computeLine(this.links, this.processors)
    },
    movingGroups() {
      return this.movingSet.filter(s => s.g)
    },
    movingNodes() {
      return this.movingSet.filter(s => s.n)
    },
    tarbarEnabled() {
      const canDelete = !!this.selectedLink || !!(this.movingSet && this.movingSet.length)
      const canCopy = !!(this.movingSet && this.movingNodes.length)
      const canPaste = !!(this.copySet && this.copySet.length)
      const addGroup = this.canAddGroup()
      const ungroup = !!(this.movingSet && (this.movingGroups.length === 1))
      return {
        copy: canCopy,
        paste: canPaste,
        delete: canDelete,
        addGroup,
        ungroup,
        enterGroup: ungroup
      }
    },
    dragLineNode() {
      return this.dragLine && this.processors.find(p => p.id === this.dragLine.node)
    }
  },
  watch: {
    '$route.query': function(to, from) {
      this.enterGroup(to.id)
    },
    'selectedLink': function(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        console.info(newValue)
      }
    },
    'movingSet': function(newValue, oldValue) {
      if (newValue && (newValue.length === 1) && newValue !== oldValue) {
        if (newValue[0].n) {
          console.info(newValue[0].n)
        } else if (newValue[0].g) {
          console.info(newValue[0].g)
        }
      }
    }
  },
  mounted() {
    this.getProcessGroup()
    this.mousedownPortType = null
    this.quickAddLink = null
    this.mousedownNode = null
  },
  methods: {
    ...mapActions({
      getProcessGroup: 'getProcessGroup',
      newProcessor: 'newProcessor',
      UpdateSnippet: 'UpdateSnippet',
      newConnection: 'newConnection',
      cloneSnippet: 'cloneSnippet',
      remvoeSnippet: 'remvoeSnippet',
      addGroup: 'addGroup',
      ungroup: 'ungroup',
      enterGroup: 'enterGroup'
    }),
    drop(event) {
      const { typeId, x, y } = nodeInfoByEvent(event)
      if (typeId) {
        const maxX = this.spaceWidth
        const maxY = this.spaceHeight
        this.newProcessor({ typeId, x, y, maxX, maxY })
      }
    },
    async tarbarAction(name) {
      if (name === 'delete') {
        if (this.selectedLink) {
          this.remvoeSnippet({ links: [this.selectedLink] })
          this.selectedLink = null
          return
        }
        let links = []
        let processors = []
        let groups = []
        if (this.movingNodes && this.movingNodes.length) {
          const ids = this.movingNodes.map(s => s.n)
          links = this.links.filter(l => ids.includes(l.source) || ids.includes(l.target)).map(l => l.id)
          processors = ids
          this.movingSet = []
          this.copySet = []
        }
        if (this.movingSet && this.movingSet.length) {
          groups = this.movingGroups.map(s => s.g)
        }
        this.remvoeSnippet({ processors, links, groups })
      } else if (name === 'copy') {
        this.copySet = this.movingNodes.map(it => it.n)
      } else if (name === 'paste') {
        await this.cloneNodes()
      } else if (name === 'addGroup') {
        const ids = this.movingNodes.map(it => it.n)
        const links = this.links
          .filter(line => ids.includes(line.source) && ids.includes(line.target))
          .map(l => l.id)
        this.addGroup({ processors: ids, links })
        this.movingSet = []
      } else if (name === 'ungroup') {
        this.ungroup(this.movingGroups[0].g)
      } else if (name === 'enterGroup') {
        const id = this.movingGroups[0].g
        this.resetMouseVars()
        this.movingSet = []
        this.copySet = []
        this.selectedLink = null
        // this.enterGroup(id)
        this.$router.push({ path: '/flow', query: { id }})
      }
    },
    linkMousedown(event, line) {
      this.mousedownLink = line
      this.clearSelection()
      this.selectedLink = line.id
    },
    linkMouseup(event, line) {
    },
    canvasMouseMove(event) {
      if (this.mouseMode === this.FLOW.state.PANNING) {
        console.debug('DTDO')
        return
      }
      this.mousePosition = calcMousePosition(event, this.$refs.vis, this.scale)

      if (this.lasso.show) {
        const ox = this.lasso.ox
        const oy = this.lasso.oy
        let x = this.lasso.x
        let y = this.lasso.y
        let w, h
        if (this.mousePosition.x < ox) {
          x = this.mousePosition.x
          w = ox - x
        } else {
          w = this.mousePosition.x - x
        }
        if (this.mousePosition.y < oy) {
          y = this.mousePosition.y
          h = oy - y
        } else {
          h = this.mousePosition.y - y
        }
        this.lasso.x = x
        this.lasso.y = y
        this.lasso.width = w
        this.lasso.height = h
        return
      }

      let mousePos
      if (this.mouseMode === this.FLOW.state.JOINING ||
        this.mouseMode === this.FLOW.state.QUICK_JOINING) {
        if (!this.dragLine && this.mousedownPortType !== null) {
          if (event.shiftKey) {
            console.info('DTDO')
          } else if (this.mousedownNode && !this.quickAddLink) {
            this.dragLine = {
              node: this.mousedownNode.id,
              portType: this.mousedownPortType,
              port: this.mousedownPortIndex
            }
          }
          this.selectedLink = null
        }
        if (this.dragLine) {
          mousePos = this.mousePosition
          const d = this.calculateDragePath(this.dragLine, this.dragLineNode, mousePos)
          this.dragLine = { ...this.dragLine, d }
        }
        event.preventDefault()
      } else if (this.mouseMode === this.FLOW.state.MOVING) {
        mousePos = calcMousePosition(event, document.body, this.scale)
        const d = (this.mouseOffset.x - mousePos.x) * (this.mouseOffset.x - mousePos.x) + (this.mouseOffset.y - mousePos.y) * (this.mouseOffset.y - mousePos.y)
        if (d > 3) {
          this.mouseMode = this.FLOW.state.MOVING_ACTIVE
        }
      } else if (this.mouseMode === this.FLOW.state.MOVING_ACTIVE || this.mouseMode === this.FLOW.state.IMPORT_DRAGGING) {
        mousePos = this.mousePosition
        this.moveNode(mousePos)
        this.moveNode(mousePos, true)
      }
    },
    calculateDragePath(dragline, node, mousePos) {
      const numOutputs = (dragline.portType === this.FLOW.VIEW.PORT_TYPE_OUTPUT) ? (node.outputs || 1) : 1
      const sourcePort = dragline.port
      const portY = -((numOutputs - 1) / 2) * 13 + 13 * sourcePort

      const sc = (dragline.portType === this.FLOW.VIEW.PORT_TYPE_OUTPUT) ? 1 : -1
      const origX = node.rect.x + sc * node.rect.w / 2
      const origY = node.rect.y + portY
      const d = generateLinkPath(origX, origY, mousePos.x, mousePos.y, sc)
      return d
    },
    moveNode(mousePos, isGroup = false) {
      const attr = isGroup ? 'g' : 'n'
      const nodes = isGroup ? this.groups : this.processors
      let minX = 0
      let minY = 0
      let maxX = this.spaceWidth
      let maxY = this.spaceHeight
      const movingNodes = this.movingSet.filter(s => s[attr])
      movingNodes.forEach(node => {
        // if (event.shiftKey) {
        //   node[attr].ox = node[attr].x
        //   node[attr].oy = node[attr].y
        // }
        const n = nodes.find(it => it.id === node[attr])
        if (n) {
          n.rect.x = mousePos.x + node.dx
          n.rect.y = mousePos.y + node.dy
          minX = Math.min(n.rect.x - n.rect.w / 2 - 5, minX)
          minY = Math.min(n.rect.y - n.rect.h / 2 - 5, minY)
          maxX = Math.max(n.rect.x + n.rect.w / 2 + 5, maxX)
          maxY = Math.max(n.rect.y + n.rect.h / 2 + 5, maxY)
        }
      })
      if (minX !== 0 || minY !== 0) {
        movingNodes.forEach(node => {
          const n = nodes.find(it => it.id === node[attr])
          if (n) {
            n.rect.x -= minX
            n.rect.y -= minY
          }
        })
      }
      if (maxX !== this.spaceWidth || maxY !== this.spaceHeight) {
        movingNodes.forEach(node => {
          const n = nodes.find(it => it.id === node[attr])
          if (n) {
            n.rect.x -= maxX - this.spaceWidth
            n.rect.y -= maxY - this.spaceHeight
          }
        })
      }
    },
    canvasMouseDown(event) {
      let point

      if (event.button === 2) {
        console.debug('DTDO')
        event.preventDefault()
        event.stopPropagation()
        return
      }
      if (!this.mousedownNode && !this.mousedownLink) {
        console.debug('DTDO')
      }
      if (this.mouseMode === this.FLOW.state.DEFAULT) {
        this.lasso.show = false
      }
      if (this.mouseMode === this.FLOW.state.DEFAULT ||
        this.mouseMode === this.FLOW.state.QUICK_JOINING) {
        console.debug('DTDO')
      }
      if (this.mouseMode === this.FLOW.state.DEFAULT && !(event.metaKey || event.ctrlKey)) {
        if (!this.touchStartTime) {
          point = calcMousePosition(event, this.$refs.vis, this.scale)
          this.lasso.ox = point.x
          this.lasso.oy = point.y
          this.lasso.x = point.x
          this.lasso.y = point.y
          this.lasso.width = 0
          this.lasso.height = 0
          this.lasso.show = true
          event.preventDefault()
        }
      }
    },
    canvasMouseUp(event) {
      if (this.mouseMode === this.FLOW.state.PANNING) {
        this.resetMouseVars()
        return
      }
      if (this.mouseMode === this.FLOW.state.QUICK_JOINING) {
        return
      }
      if (this.mousedownNode && this.mouseMode === this.FLOW.state.JOINING) {
        this.dragLine = null
      }
      if (this.lasso.show) {
        const x = this.lasso.x
        const y = this.lasso.y
        const x2 = this.lasso.x + this.lasso.width
        const y2 = this.lasso.y + this.lasso.height
        if (!event.ctrlKey) {
          this.clearSelection()
        }
        this.processors.forEach(n => {
          if (this.isSelected(n)) {
            return
          }
          const selected = (n.rect.x > x && n.rect.x < x2 && n.rect.y > y && n.rect.y < y2)
          if (selected) {
            this.movingSet.push({ n: n.id })
          }
        })
        this.groups.forEach(g => {
          if (this.isSelected(g, true)) {
            return
          }
          const selected = (g.rect.x > x && g.rect.x < x2 && g.rect.y > y && g.rect.y < y2)
          if (selected) {
            this.movingSet.push({ g: g.id })
          }
        })
        this.copySet = []
        this.lasso.show = false
      } else if (this.mouseMode === this.FLOW.state.DEFAULT) {
        this.clearSelection()
      }

      if (this.mouseMode === this.FLOW.state.MOVING_ACTIVE) {
        if (this.movingSet.length > 0) {
          console.info('DOTO')
        }
      }
      if (this.mouseMode === this.FLOW.state.MOVING ||
        this.mouseMode === this.FLOW.state.MOVING_ACTIVE) {
        this.movingSet.forEach(node => {
          delete node.ox
          delete node.oy
        })
      }

      this.resetMouseVars()
    },
    portMouseOver({ event, portType, d, portIndex }) {
      if (this.mouseMode === this.FLOW.state.JOINING ||
        this.mouseMode === this.FLOW.state.QUICK_JOINING) {
        if (this.dragLine) {
          if (portType === this.dragLine.portType || d.id === this.dragLine.node) {
            event.stopPropagation()
            event.preventDefault()
            return
          }
        }
      }

      if (this.FLOW.VIEW.PORT_TYPE_OUTPUT === portType) {
        d.port.outputActive = true
      } else if (this.FLOW.VIEW.PORT_TYPE_INPUT === portType) {
        d.port.inputActive = true
      }

      event.stopPropagation()
      event.preventDefault()
    },
    portMouseOut({ event, portType, d, portIndex }) {
      if (this.FLOW.VIEW.PORT_TYPE_OUTPUT === portType) {
        if (d.port.outputActive) {
          d.port.outputActive = false
        }
      } else if (this.FLOW.VIEW.PORT_TYPE_INPUT === portType) {
        if (d.port.inputActive) {
          d.port.inputActive = false
        }
      }
      event.stopPropagation()
      event.preventDefault()
    },
    portMouseDown({ event, portType, d, portIndex }) {
      if (event.button === 1) {
        return
      }

      this.mousedownNode = d
      this.mousedownPortType = portType
      this.mousedownPortIndex = portIndex || 0
      if (this.mouseMode !== this.FLOW.state.QUICK_JOINING) {
        this.mouseMode = this.FLOW.state.JOINING
        if (event.ctrlKey || event.metaKey) {
          console.info('DOTO')
        }
      }
      event.stopPropagation()
      event.preventDefault()
    },
    portMouseUp({ event, portType, d, portIndex }) {
      if (this.mouseMode === this.FLOW.state.QUICK_JOINING && this.dragLine) {
        console.info('DOTO')
      }

      if (this.mouseMode === this.FLOW.state.JOINING ||
        this.mouseMode === this.FLOW.state.QUICK_JOINING) {
        if (typeof TouchEvent !== 'undefined' && event instanceof TouchEvent) {
          console.info('DOTO')
        } else {
          this.mouseupNode = d
        }

        let addedLinks = []

        if (this.dragLine) {
          if (portType !== this.dragLine.portType && this.mouseupNode.id !== this.dragLine.node) {
            let src, dst, srcPort
            if (this.dragLine.portType === this.FLOW.VIEW.PORT_TYPE_OUTPUT) {
              src = this.dragLineNode
              srcPort = this.dragLine.port
              dst = this.mouseupNode
            } else if (this.dragLine.portType === this.FLOW.VIEW.PORT_TYPE_INPUT) {
              src = this.mouseupNode
              dst = this.dragLineNode
              srcPort = portIndex
            }
            const linkId = `${src.id}:${srcPort}:${dst.id}`
            const link = { id: linkId, source: src, sourcePort: srcPort, target: dst }
            if (this.dragLine.virtualLink) {
              console.info('DOTO')
            } else {
              if (this.links.findIndex(line => line.id === link.id) === -1) {
                addedLinks = [...addedLinks, link]
              }
            }
          }
        }
        if (addedLinks.length > 0) {
          this.newConnection(addedLinks[0])
        }
      }

      this.resetMouseVars()
      this.dragLine = null
      event.preventDefault()
    },
    nodeMouseUp({ event, d }) {
      if (d.id === this.mousedownNode.id) {
        if (this.mouseMode === this.FLOW.state.MOVING_ACTIVE) {
          if (this.movingNodes.length > 0) {
            const processors = this.movingNodes.map(n => n.n)
            const groups = this.movingGroups.map(n => n.g)
            this.UpdateSnippet({ processors, groups })
          }
        }
        this.mouseMode = this.FLOW.state.DEFAULT
        event.stopPropagation()
        return
      }
    },
    nodeMouseDown({ event, d }) {
      this.mousedownNode = d

      if (this.isSelected(d) && (event.ctrlKey || event.metaKey)) {
        this.movingSet = this.movingSet.filter(n => n.n !== d.id)
        this.copySet = []
      } else {
        if (event.shiftKey) {
          this.clearSelection()
          const condes = getAllFlowNodes(d, this.links, this.processors)
          condes.forEach(n => {
            this.movingSet.push({ n: n.id })
          })
        } else if (!this.isSelected(d)) {
          if (!event.ctrlKey && !event.metaKey) {
            this.clearSelection()
          }
          this.movingSet.push({ n: d.id })
        }
        this.copySet = []
        this.selectedLink = null
        if (event.button !== 2) {
          this.mouseMode = this.FLOW.state.MOVING
          const mouse = mouseAtNode(event, this.scale)
          mouse.x = mouse.x + d.rect.x - d.rect.w / 2
          mouse.y = mouse.y + d.rect.y - d.rect.h / 2
          this.movingSet.forEach(m => {
            const id = m.n || m.g
            const nodes = (m.n && this.processors) || (m.g && this.groups)
            const node = nodes.find(it => it.id === id)
            if (id) {
              m.ox = node.rect.x
              m.oy = node.rect.y
              m.dx = node.rect.x - mouse.x
              m.dy = node.rect.y - mouse.y
            }
          })
          this.mouseOffset = calcMousePosition(event, document.body, this.scale)
        }
      }

      event.stopPropagation()
    },
    groupMouseUp({ event, g }) {
      if (g.id === this.mousedownGroup.id) {
        if (this.mouseMode === this.FLOW.state.MOVING_ACTIVE) {
          if (this.movingGroups.length > 0) {
            const processors = this.movingNodes.map(n => n.n)
            const groups = this.movingGroups.map(n => n.g)
            this.UpdateSnippet({ processors, groups })
          }
        }
        this.mouseMode = this.FLOW.state.DEFAULT
        event.stopPropagation()
        return
      }
    },
    groupMouseDown({ event, g }) {
      this.mousedownGroup = g

      const isSelected = group => this.isSelected(group, true)
      if (isSelected(g) && (event.ctrlKey || event.metaKey)) {
        this.movingSet = this.movingSet.filter(n => n.g !== g.id)
      } else {
        if (!isSelected(g)) {
          if (!event.ctrlKey && !event.metaKey) {
            this.clearSelection()
          }
          this.movingSet.push({ g: g.id })
        }
        this.copySet = []
        this.selectedLink = null
        if (event.button !== 2) {
          this.mouseMode = this.FLOW.state.MOVING
          const mouse = mouseAtNode(event, this.scale)
          mouse.x = mouse.x + g.rect.x - g.rect.w / 2
          mouse.y = mouse.y + g.rect.y - g.rect.h / 2
          this.movingSet.forEach(m => {
            const id = m.n || m.g
            const nodes = (m.n && this.processors) || (m.g && this.groups)
            const node = nodes.find(it => it.id === id)
            if (id) {
              m.ox = node.rect.x
              m.oy = node.rect.y
              m.dx = node.rect.x - mouse.x
              m.dy = node.rect.y - mouse.y
            }
          })
          this.mouseOffset = calcMousePosition(event, document.body, this.scale)
        }
      }

      event.stopPropagation()
    },
    clearSelection() {
      this.movingSet = []
      this.selectedLink = null
    },
    resetMouseVars() {
      this.mousedownNode = null
      this.mousedownGroup = null
      this.mouseupNode = null
      this.mousedownLink = null
      this.mouseMode = this.FLOW.state.DEFAULT
      this.mousedownPortType = null
      this.activeSpliceLink = null
      this.spliceActive = false
    },
    isSelected(node, isGroup = false) {
      const attr = isGroup ? 'g' : 'n'
      return this.movingSet.filter(s => s[attr]).map(it => it[attr]).includes(node.id)
    },
    async cloneNodes() {
      const ids = this.copySet
      const links = this.links.filter(line => ids.includes(line.source) && ids.includes(line.target)).map(l => l.id)
      const clones = await this.cloneSnippet({ processors: ids, links })
      this.movingSet = clones.map(it => ({ n: it }))
      this.copySet = []
    },
    canAddGroup() {
      if (this.movingSet) {
        const ids = this.movingNodes.map(it => it.n)
        if (ids.length) {
          const links = this.links.filter(line => {
            const a = ids.includes(line.source)
            const b = ids.includes(line.target)
            return (a && !b) || (!a && b)
          })
          if (links.length === 0) {
            return true
          }
        }
      }
      return false
    }
  }
}

</script>

<style lang="scss" scoped>
  @import "@flow/styles/index.scss";

  .flow {
    &-workspace {
      width: 100%;
      height: 100%;

      header {
        height: 35px;
        background-color: #fff;
        border-bottom: 1px solid #aabbc3;
        box-shadow: 0 1px 6px rgba(0,0,0,0.25);
        z-index: 3;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      footer {
        @include component-footer;
        display: flex;
        justify-content: space-between;
        .footer-buttons {
          .mini {
            padding: 2px 2px;
            margin-left: 0;
          }
        }
        .breadcrumb {
          line-height: 24px;
        }
      }

      .chart {
        overflow: auto;
        background: #e3e3e3;
        position: absolute;
        bottom: 25px;
        top: 35px;
        left: 0px;
        right: 0px;
        box-sizing:border-box;
        transition: right 0.2s ease;
      }

      .lasso {
        stroke-width: 1px;
        stroke: #ff7f0e;
        fill: rgba(20,125,255,0.1);
        stroke-dasharray: 10 5;
      }

      .drag_line {
        stroke: $node-selected-color;
        stroke-width: 3;
        fill: none;
        pointer-events: none;
      }

      .link_line {
        stroke: $link-color;
        stroke-width: 3;
        fill: none;
        pointer-events: none;
      }

      .link_outline {
        stroke: #fff;
        stroke-width: 5;
        cursor: crosshair;
        fill: none;
        pointer-events: none;
      }
      .link_background {
        stroke: #fff;
        opacity: 0;
        stroke-width: 20;
        cursor: crosshair;
        fill: none;
      }

      g.link_selected path.link_line {
        stroke: $node-selected-color;
      }
    }
  }
</style>
