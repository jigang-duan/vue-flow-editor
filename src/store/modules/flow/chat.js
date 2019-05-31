import {
  fetchProcessGroup,
  createProcessor,
  updateProcessors,
  deleteProcessors,
  createConnection,
  deleteConnections,
  clone,
  addGroup,
  ungroup
} from '@/api/flow'

const state = {
  processors: [],
  links: [],
  groups: []
}

const mutations = {
  SET_PROCESSORS: (state, processors) => {
    state.processors = processors
  },
  ADD_PROCESSOR: (state, processor) => {
    state.processors = [...state.processors, processor]
  },
  ADD_PROCESSORS: (state, processors) => {
    state.processors = [...state.processors, ...processors]
  },
  REMOVE_PROCESSORS: (state, processors) => {
    state.processors = state.processors.filter(p => !processors.map(it => it.id).includes(p.id))
  },
  SET_LINKS: (state, links) => {
    state.links = links
  },
  ADD_LINKS: (state, links) => {
    state.links = [...state.links, ...links]
  },
  REMOVE_LINKS: (state, links) => {
    state.links = state.links.filter(p => !links.map(it => it.id).includes(p.id))
  },
  ADD_GROUPS: (state, group) => {
    state.groups = [...state.groups, group]
  },
  REMOVE_GROUPS: (state, groups) => {
    state.groups = state.groups.filter(p => !groups.map(it => it.id).includes(p.id))
  }
}

const actions = {
  async getProcessGroup({ dispatch, commit }) {
    const { processors = [], links = [] } = await fetchProcessGroup()
    commit('SET_PROCESSORS', processors)
    commit('SET_LINKS', links)
  },
  async newProcessor({ dispatch, commit }, { typeId, x, y, maxX, maxY }) {
    const { processors = [], links = [] } = await createProcessor(typeId, { x, y, maxX, maxY })
    commit('SET_PROCESSORS', processors)
    commit('SET_LINKS', links)
  },
  async updateProcessors({ dispatch, commit }, ps) {
    const { processors = [], links = [] } = await updateProcessors(ps)
    commit('SET_PROCESSORS', processors)
    commit('SET_LINKS', links)
  },
  async newConnection({ dispatch, commit }, link) {
    const { processors = [], links = [] } = await createConnection(link)
    commit('SET_PROCESSORS', processors)
    commit('SET_LINKS', links)
  },
  async removeLinks({ dispatch, commit }, lines) {
    const { processors = [], links = [] } = await deleteConnections(lines)
    commit('SET_PROCESSORS', processors)
    commit('SET_LINKS', links)
  },
  async removeProcessors({ dispatch, commit }, ps) {
    const { processors = [], links = [] } = await deleteProcessors(ps)
    commit('SET_PROCESSORS', processors)
    commit('SET_LINKS', links)
  },
  async clone({ dispatch, state, commit }, { processors, links }) {
    const { processors: oldPs = [] } = state
    const { processors: ps = [], links: ls = [] } = await clone({ processors, links })
    commit('SET_PROCESSORS', ps)
    commit('SET_LINKS', ls)
    const oldids = oldPs.map(p => p.id)
    return ps.filter(p => !oldids.includes(p.id))
  },

  async addGroup({ dispatch, commit }, { nodes, links }) {
    const group = await addGroup({ nodes, links })
    commit('ADD_GROUPS', group)
    commit('REMOVE_PROCESSORS', nodes)
    commit('REMOVE_LINKS', links)
  },
  async ungroup({ dispatch, commit }, groups) {
    const { nodes, links } = await ungroup(groups)
    commit('REMOVE_GROUPS', groups)
    commit('ADD_PROCESSORS', nodes)
    commit('ADD_LINKS', links)
  },
  removeGroups({ dispatch, commit }, groups) {
    commit('REMOVE_GROUPS', groups)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
