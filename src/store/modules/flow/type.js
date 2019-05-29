import { getGroups } from '@/api/flow'

const state = {
  groups: []
}

const mutations = {
  SET_GROUPS: (state, groups) => {
    state.groups = groups
  }
}

const actions = {
  async getGroups({ dispatch, commit }) {
    try {
      commit('SET_GROUPS', await getGroups())
    } catch (error) {
      console.warn(error)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
