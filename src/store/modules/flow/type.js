import { fetchProcessorTypes } from '@/api/flow'

const state = {
  types: []
}

const mutations = {
  SET_TYPES: (state, types) => {
    state.types = types
  }
}

const actions = {
  async getTypes({ dispatch, commit }) {
    try {
      commit('SET_TYPES', await fetchProcessorTypes())
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
