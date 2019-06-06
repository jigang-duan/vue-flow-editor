import request from '@/utils/request'

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

const mapProcessGroup = processGroup => {
  const { id, processors, connections, processGroups } = processGroup || {}
  const ps = processors && processors.map(mapProcessor) || []
  const links = connections || []
  const groups = processGroups && processGroups.map(g => ({ ...g, count: g.processors && g.processors.length || 0 })) || []
  return {
    processors: ps,
    links,
    groups,
    id
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

export const UpdateSnippet = async({ processors, groups }, groupId = 'root') => {
  const processGroup = await request({
    url: `${BaseURL}/process-groups/${groupId}/snippet`,
    method: 'put',
    data: {
      processors,
      processGroups: groups
    }
  })
  return mapProcessGroup(processGroup)
}

export const createConnection = async({ source, sourcePort, target }, groupId = 'root') => {
  const processGroup = await request({
    url: `${BaseURL}/process-groups/${groupId}/connections`,
    method: 'post',
    data: {
      source: source.id,
      sourcePort,
      target: target.id
    }
  })
  return mapProcessGroup(processGroup)
}

export const cloneSnippet = async({ processors, links }, groupId = 'root') => {
  const processGroup = await request({
    url: `${BaseURL}/process-groups/${groupId}/snippet`,
    method: 'post',
    data: {
      processors,
      connections: links
    }
  })
  return mapProcessGroup(processGroup)
}

export const addGroup = async({ processors, links }, groupId = 'root') => {
  const processGroup = await request({
    url: `${BaseURL}/process-groups/${groupId}/process-groups`,
    method: 'post',
    data: {
      processors,
      connections: links
    }
  })
  return mapProcessGroup(processGroup)
}

export const deleteSnippet = async({ processors, links, groups }, groupId = 'root') => {
  const processGroup = await request({
    url: `${BaseURL}/process-groups/${groupId}/snippet`,
    method: 'delete',
    data: {
      processors,
      connections: links,
      processGroups: groups
    }
  })
  return mapProcessGroup(processGroup)
}

export async function ungroup(groupId, parentID = 'root') {
  const processGroup = await request({
    url: `${BaseURL}/process-groups/${groupId}/ungroup`,
    method: 'put',
    params: {
      parentID
    }
  })
  return mapProcessGroup(processGroup)
}
