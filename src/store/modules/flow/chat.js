import { getProcessors, newProcessor, cloneProcessors, addGroup, ungroup } from '@/api/flow'

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
  async getProcessors({ dispatch, commit }) {
    try {
      commit('SET_PROCESSORS', await getProcessors())
    } catch (error) {
      console.warn(error)
    }
  },
  setProcessors({ dispatch, commit }, processors) {
    commit('SET_PROCESSORS', processors)
  },
  async newProcessor({ dispatch, commit }, { typeId, x, y, maxX, maxY }) {
    try {
      commit('ADD_PROCESSOR', await newProcessor(typeId, x, y, maxX, maxY))
    } catch (error) {
      console.warn(error)
    }
  },
  removeProcessors({ dispatch, commit }, processors) {
    commit('REMOVE_PROCESSORS', processors)
  },
  async cloneProcessors({ dispatch, commit }, processors) {
    const clones = await cloneProcessors(processors)
    commit('ADD_PROCESSORS', clones)
    return clones
  },
  setRemoteLinks({ dispatch, commit }, links) {
    commit('SET_LINKS', links)
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
