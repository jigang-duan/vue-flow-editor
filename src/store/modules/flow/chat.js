import {
  fetchProcessGroup,
  createProcessor,
  updateProcessors,
  deleteProcessors,
  createConnection,
  deleteConnections,
  clone,
  addGroup,
  deleteContent,
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
  SET_LINKS: (state, links) => {
    state.links = links
  },
  ADD_LINKS: (state, links) => {
    state.links = [...state.links, ...links]
  },
  SET_GROUPS: (state, groups) => {
    state.groups = groups
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
    const { processors = [], links = [], groups = [] } = await fetchProcessGroup()
    commit('SET_PROCESSORS', processors)
    commit('SET_LINKS', links)
    commit('SET_GROUPS', groups)
  },
  async newProcessor({ dispatch, commit }, { typeId, x, y, maxX, maxY }) {
    const { processors = [], links = [], groups = [] } = await createProcessor(typeId, { x, y, maxX, maxY })
    commit('SET_PROCESSORS', processors)
    commit('SET_LINKS', links)
    commit('SET_GROUPS', groups)
  },
  async updateProcessors({ dispatch, commit }, ps) {
    const { processors = [], links = [], groups = [] } = await updateProcessors(ps)
    commit('SET_PROCESSORS', processors)
    commit('SET_LINKS', links)
    commit('SET_GROUPS', groups)
  },
  async newConnection({ dispatch, commit }, link) {
    const { processors = [], links = [], groups = [] } = await createConnection(link)
    commit('SET_PROCESSORS', processors)
    commit('SET_LINKS', links)
    commit('SET_GROUPS', groups)
  },
  async removeLinks({ dispatch, commit }, lines) {
    const { processors = [], links = [], groups = [] } = await deleteConnections(lines)
    commit('SET_PROCESSORS', processors)
    commit('SET_LINKS', links)
    commit('SET_GROUPS', groups)
  },
  async removeProcessors({ dispatch, commit }, ps) {
    const { processors = [], links = [], groups = [] } = await deleteProcessors(ps)
    commit('SET_PROCESSORS', processors)
    commit('SET_LINKS', links)
    commit('SET_GROUPS', groups)
  },
  async clone({ dispatch, state, commit }, { processors, links }) {
    const { processors: oldPs = [] } = state
    const { processors: ps = [], links: ls = [], groups = [] } = await clone({ processors, links })
    commit('SET_PROCESSORS', ps)
    commit('SET_LINKS', ls)
    commit('SET_GROUPS', groups)
    const oldids = oldPs.map(p => p.id)
    return ps.filter(p => !oldids.includes(p.id))
  },
  async addGroup({ dispatch, commit }, { processors, links }) {
    const { processors: ps = [], links: ls = [], groups = [] } = await addGroup({ processors, links })
    commit('SET_PROCESSORS', ps)
    commit('SET_LINKS', ls)
    commit('SET_GROUPS', groups)
  },
  async deleteContent({ dispatch, commit }, { processors, links, groups }) {
    const { processors: ps = [], links: ls = [], groups: gs = [] } = await deleteContent({ processors, links, groups })
    commit('SET_PROCESSORS', ps)
    commit('SET_LINKS', ls)
    commit('SET_GROUPS', gs)
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
