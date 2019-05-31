import {
  fetchProcessGroup,
  createProcessor,
  updateContent,
  createConnection,
  clone,
  addGroup,
  deleteContent
  // ungroup
} from '@/api/flow'

const state = {
  processors: [],
  links: [],
  groups: []
}

const mutations = {
  SET_PROCESS_GROUP: (state, { processors, links, groups }) => {
    state.processors = processors
    state.links = links
    state.groups = groups
  }
}

const actions = {
  async getProcessGroup({ commit }) {
    commit('SET_PROCESS_GROUP', await fetchProcessGroup())
  },
  async newProcessor({ commit }, { typeId, x, y, maxX, maxY }) {
    const updated = await createProcessor(typeId, { x, y, maxX, maxY })
    commit('SET_PROCESS_GROUP', updated)
  },
  async updateContent({ state, commit }, payload) {
    const processors = state.processors.filter(p => payload.processors.includes(p.id))
    const groups = state.groups.filter(p => payload.groups.includes(p.id))
    const updated = await updateContent({ processors, groups })
    commit('SET_PROCESS_GROUP', updated)
  },
  async newConnection({ commit }, link) {
    const updated = await createConnection(link)
    commit('SET_PROCESS_GROUP', updated)
  },
  async clone({ state, commit }, payload) {
    const oldids = state.processors.map(p => p.id)
    const processors = state.processors.filter(p => payload.processors.includes(p.id))
    const links = state.links.filter(l => payload.links.includes(l.id))
    const updated = await clone({ processors, links })
    commit('SET_PROCESS_GROUP', updated)
    return updated.processors.filter(p => !oldids.includes(p.id)).map(p => p.id)
  },
  async addGroup({ commit }, payload) {
    const processors = state.processors.filter(p => payload.processors.includes(p.id))
    const links = state.links.filter(link => payload.links.includes(link.id))
    const updated = await addGroup({ processors, links })
    commit('SET_PROCESS_GROUP', updated)
  },
  async remvoeContent({ commit }, { processors, links, groups }) {
    const updated = await deleteContent({ processors, links, groups })
    commit('SET_PROCESS_GROUP', updated)
  },

  async ungroup({ dispatch, commit }, groups) {
    // const { nodes, links } = await ungroup(groups)
    // commit('REMOVE_GROUPS', groups)
    // commit('ADD_PROCESSORS', nodes)
    // commit('ADD_LINKS', links)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
