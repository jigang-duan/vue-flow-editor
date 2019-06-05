import type from './type'
import chat from './chat'
import info from './info'
import settings from './settings'

export default {
  namespaced: true,
  modules: {
    type,
    chat,
    info,
    settings
  }
}
