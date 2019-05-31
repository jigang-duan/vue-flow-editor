import request from '@/utils/request'
import flatMap from 'lodash/flatMap'

// const BaseURL = 'http://192.168.10.235:3000/mock/32/flow'
const BaseURL = 'http://localhost:8080/flow'

const mapTypeGoups = (group) => {
  return {
    ...group,
    items: group.items.map(it => ({
      ...it,
      style: {
        height: '28px',
        'background-color': it.color
      }
    }))
  }
}

const mapProcessor = (p) => {
  return {
    ...p,
    port: {
      outputActive: false,
      inputActive: false
    }
  }
}

const mapConnection = (c, processors) => {
  const source = processors.find(p => p.id === c.sourceId)
  const target = processors.find(p => p.id === c.targetId)
  return {
    id: c.id,
    source,
    sourcePort: c.sourcePort,
    target
  }
}

const mapProcessGroup = processGroup => {
  const { processors, connections, processGroups } = processGroup || {}
  const ps = processors && processors.map(mapProcessor) || []
  const links = connections && connections.map(c => mapConnection(c, ps)) || []
  const groups = processGroups && processGroups.map(g => ({ ...g, count: g.processors && g.processors.length || 0 })) || []
  return {
    processors: ps,
    links,
    groups
  }
}

export const fetchProcessorTypes = async() => {
  const typeGoups = await request({
    url: `${BaseURL}/dataflow/processor-types`,
    method: 'get'
  })
  return typeGoups.map(mapTypeGoups)
}

export const fetchProcessGroup = async(id = 'root') => {
  const processGroup = await request({
    url: `${BaseURL}/dataflow/process-groups/${id}`,
    method: 'get'
  })
  return mapProcessGroup(processGroup)
}

export const createProcessor = async(typeId, { x, y, maxX, maxY }, groupId = 'root') => {
  const processGroup = await request({
    url: `${BaseURL}/process-groups/${groupId}/processors`,
    method: 'post',
    data: {
      typeId,
      rect: {
        x, y,
        maxX, maxY
      }
    }
  })
  return mapProcessGroup(processGroup)
}

export const updateProcessors = async(processors, groupId = 'root') => {
  const processGroup = await request({
    url: `${BaseURL}/process-groups/${groupId}/processors`,
    method: 'put',
    data: processors
  })
  return mapProcessGroup(processGroup)
}

export const deleteProcessors = async(processors, groupId = 'root') => {
  const ids = processors.map(p => p.id)
  const processGroup = await request({
    url: `${BaseURL}/process-groups/${groupId}/processors`,
    method: 'delete',
    data: ids
  })
  return mapProcessGroup(processGroup)
}

export const createConnection = async({ source, sourcePort, target }, groupId = 'root') => {
  const processGroup = await request({
    url: `${BaseURL}/process-groups/${groupId}/connections`,
    method: 'post',
    data: {
      sourceId: source.id,
      sourcePort: sourcePort,
      targetId: target.id
    }
  })
  return mapProcessGroup(processGroup)
}

export const deleteConnections = async(links, groupId = 'root') => {
  const linkIds = links.map(l => l.id)
  const processGroup = await request({
    url: `${BaseURL}/process-groups/${groupId}/connections`,
    method: 'delete',
    data: linkIds
  })
  return mapProcessGroup(processGroup)
}

export const clone = async({ processors, links }, groupId = 'root') => {
  const connections = links.map(({ id, source, sourcePort, target }) => {
    return {
      id: id,
      sourceId: source.id,
      sourcePort: sourcePort,
      targetId: target.id
    }
  })
  const processGroup = await request({
    url: `${BaseURL}/process-groups/${groupId}/clone`,
    method: 'put',
    data: {
      processors,
      connections
    }
  })
  return mapProcessGroup(processGroup)
}

export const addGroup = async({ processors, links }, groupId = 'root') => {
  const connections = links.map(({ id, source, sourcePort, target }) => {
    return {
      id: id,
      sourceId: source.id,
      sourcePort: sourcePort,
      targetId: target.id
    }
  })
  const processGroup = await request({
    url: `${BaseURL}/process-groups/${groupId}/process-groups`,
    method: 'post',
    data: {
      processors,
      connections
    }
  })
  return mapProcessGroup(processGroup)
}

export const deleteContent = async({ processors, links, groups }, groupId = 'root') => {
  const pids = processors && processors.map(p => p.id) || []
  const lids = links && links.map(l => l.id) || []
  const gids = groups && groups.map(g => g.id) || []
  const processGroup = await request({
    url: `${BaseURL}/process-groups/${groupId}/content`,
    method: 'delete',
    data: {
      processors: pids,
      connections: lids,
      processGroups: gids
    }
  })
  return mapProcessGroup(processGroup)
}

export async function ungroup(groups) {
  const nodes = flatMap(groups, g => g.content && g.content.nodes).filter(n => n)
  const links = flatMap(groups, g => g.content && g.content.links).filter(l => l)
  return Promise.resolve({ nodes, links })
}
