import {
  fetchProcessGroup,
  createProcessor,
  UpdateSnippet,
  createConnection,
  cloneSnippet,
  addGroup,
  deleteSnippet,
  ungroup
} from '@/api/flow'

const state = {
  processors: [],
  links: [],
  groups: [],
  flowGroupIDs: ['root']
}

const getters = {
  flowGroupId: state => {
    const { flowGroupIDs } = state
    return flowGroupIDs[flowGroupIDs.length - 1]
  }
}

const mutations = {
  SET_PROCESS_GROUP: (state, { processors, links, groups }) => {
    state.processors = processors
    state.links = links
    state.groups = groups
  },
  SET_CUR_GROUP: (state, id) => {
    state.flowGroupIDs = id
  }
}

const actions = {
  async getProcessGroup({ commit, getters }) {
    const { flowGroupId } = getters
    commit('SET_PROCESS_GROUP', await fetchProcessGroup(flowGroupId))
  },
  async newProcessor({ commit, getters }, { typeId, x, y, maxX, maxY }) {
    const { flowGroupId } = getters
    const updated = await createProcessor(typeId, { x, y, maxX, maxY }, flowGroupId)
    commit('SET_PROCESS_GROUP', updated)
  },
  async UpdateSnippet({ getters, commit, state }, payload) {
    const { flowGroupId } = getters
    const processors = state.processors.filter(p => payload.processors.includes(p.id))
    const groups = state.groups.filter(p => payload.groups.includes(p.id))
    const updated = await UpdateSnippet({ processors, groups }, flowGroupId)
    commit('SET_PROCESS_GROUP', updated)
  },
  async newConnection({ commit, getters }, link) {
    const { flowGroupId } = getters
    const updated = await createConnection(link, flowGroupId)
    commit('SET_PROCESS_GROUP', updated)
  },
  async cloneSnippet({ state, commit, getters }, payload) {
    const { flowGroupId } = getters
    const oldids = state.processors.map(p => p.id)
    const processors = state.processors.filter(p => payload.processors.includes(p.id))
    const links = state.links.filter(l => payload.links.includes(l.id))
    const updated = await cloneSnippet({ processors, links }, flowGroupId)
    commit('SET_PROCESS_GROUP', updated)
    return updated.processors.filter(p => !oldids.includes(p.id)).map(p => p.id)
  },
  async addGroup({ commit, state, getters }, payload) {
    const { flowGroupId } = getters
    const processors = state.processors.filter(p => payload.processors.includes(p.id))
    const links = state.links.filter(link => payload.links.includes(link.id))
    const updated = await addGroup({ processors, links }, flowGroupId)
    commit('SET_PROCESS_GROUP', updated)
  },
  async remvoeSnippet({ commit, getters }, { processors, links, groups }) {
    const { flowGroupId } = getters
    const updated = await deleteSnippet({ processors, links, groups }, flowGroupId)
    commit('SET_PROCESS_GROUP', updated)
  },
  async ungroup({ dispatch, commit, getters }, groupID) {
    const { flowGroupId } = getters
    const updated = await ungroup(groupID, flowGroupId)
    commit('SET_PROCESS_GROUP', updated)
  },
  async enterGroup({ dispatch, commit, state }, groupID) {
    const { flowGroupIDs } = state
    const index = flowGroupIDs.findIndex(id => id === groupID)
    if (index < 0) {
      commit('SET_CUR_GROUP', [...flowGroupIDs, groupID])
    } else {
      commit('SET_CUR_GROUP', flowGroupIDs.slice(0, index + 1))
    }
    dispatch('getProcessGroup')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
