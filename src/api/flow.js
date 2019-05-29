// import request from '@/utils/request'
import { Groups, generateNodeByType, cloneNodes, generateGroup } from './flow.mock'

// const BaseURL = 'http://192.168.10.235:3000/mock/34/flow'

// export async function getGroups() {
//   return request({
//     url: `${BaseURL}/node/type/groups`,
//     method: 'get'
//   })
// }

export async function getGroups() {
  // return new Promise((resolve, reject) => {
  //   resolve(Groups)
  // })
  return Promise.resolve(Groups)
}

// export async function getProcessors() {
//   return request({
//     url: `${BaseURL}/nodes`,
//     method: 'get'
//   })
// }

export async function getProcessors() {
  return Promise.resolve([])
}

export async function newProcessor(typeId, x, y, maxX, maxY) {
  return Promise.resolve(generateNodeByType(typeId, x, y, maxX, maxY))
}

export async function cloneProcessors(processors) {
  return Promise.resolve(cloneNodes(processors))
}

export async function addGroup({ nodes, links }) {
  return Promise.resolve(generateGroup({ nodes, links }))
}

export async function ungroup(groups) {
  const nodes = groups.flatMap(g => g.content && g.content.nodes).filter(n => n)
  const links = groups.flatMap(g => g.content && g.content.links).filter(l => l)
  return Promise.resolve({ nodes, links })
}
