import cloneDeep from 'lodash/cloneDeep'

export const Groups = [
  {
    'id': 'fdCD6BD6-C5Bb-ECdb-6647-b8FDfe8eBa64',
    'title': '连接器',
    'name': 'Connector',
    'nodes': [
      {
        'id': '76DA30b6-61BF-75AF-AfFc-d2FdB9AdC874',
        'name': 'MySQL',
        'icon': 'icons/node-red/db.png',
        'iconOnRight': false,
        'style': {
          'height': '28px',
          'background-color': '#79f299'
        },
        'hasInput': false,
        'hasOutput': true
      },
      {
        'id': 'EAb1dda2-2B17-79CF-820B-a7D28587De7d',
        'name': 'CSV',
        'icon': 'icons/node-red/parser-csv.png',
        'iconOnRight': false,
        'style': {
          'height': '28px',
          'background-color': '#f2797c'
        },
        'hasInput': false,
        'hasOutput': true
      },
      {
        'id': '6f7F4b9b-8ef4-Ee72-9F8C-faC65DeBd78b',
        'name': 'Redis',
        'icon': 'icons/node-red/redis.png',
        'iconOnRight': true,
        'style': {
          'height': '28px',
          'background-color': '#799ff2'
        },
        'hasInput': true,
        'hasOutput': false
      }
    ]
  },
  {
    'id': '18Ed9dB5-F3B1-6c83-4de6-d7BcBbA2c84c',
    'title': '转换器',
    'name': 'Converter',
    'nodes': [
      {
        'id': '871155A1-e8EE-D3Fc-CFcC-E2c83BB98B31',
        'name': 'sort',
        'icon': 'icons/node-red/sort.png',
        'iconOnRight': false,
        'style': {
          'height': '28px',
          'background-color': '#f2b779'
        },
        'hasInput': true,
        'hasOutput': true
      },
      {
        'id': 'fA1Be6A1-1335-9a0e-5a7D-7b5cdBbbcfE3',
        'name': 'split',
        'icon': 'icons/node-red/split.png',
        'iconOnRight': false,
        'style': {
          'height': '28px',
          'background-color': '#9479f2'
        },
        'hasInput': true,
        'hasOutput': true
      }
    ]
  },
  {
    'id': 'F163FeC2-8189-DC1c-bFB5-c7b5eabCF604',
    'title': '格式转换器',
    'name': 'Converter',
    'nodes': [
      {
        'id': 'ccBE4edc-06ab-6Ab1-A54a-22Ff1A9a5aD0',
        'name': 'Yaml',
        'icon': 'icons/node-red/parser-yaml.png',
        'iconOnRight': false,
        'style': {
          'height': '28px',
          'background-color': '#c3f279'
        },
        'hasInput': true,
        'hasOutput': true
      },
      {
        'id': '8b19F27B-DbAF-c59d-22F4-f9f141b73Ee6',
        'name': 'Json',
        'icon': 'icons/node-red/parser-json.png',
        'iconOnRight': false,
        'style': {
          'height': '28px',
          'background-color': '#f279e6'
        },
        'hasInput': true,
        'hasOutput': true
      },
      {
        'id': '0DCfA336-C02A-fA38-3beC-2F3db5ef3cF8',
        'name': 'Xml',
        'icon': 'icons/node-red/parser-xml.png',
        'iconOnRight': false,
        'style': {
          'height': '28px',
          'background-color': '#d4f2da'
        },
        'hasInput': true,
        'hasOutput': true
      }
    ]
  }
]

const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const cloneNodes = (nodes) => {
  const ns = cloneDeep(nodes)
  return ns.map(n => ({ ...n, id: guid(), cloneId: n.id, rect: { ...n.rect, x: n.rect.x + 10, y: n.rect.y + 10 }}))
}

export const generateNodeByType = (typeId, x, y, maxX, maxY) => {
  const width = 140
  const height = 30
  const minx = width / 2 + 5
  const miny = height / 2 + 5
  const maxx = maxX - width / 2 - 5
  const maxy = maxY - height / 2 - 5
  let cx = x
  let cy = y
  if (x < minx) cx = minx
  else if (x > maxx) cx = maxx
  if (y < miny) cy = miny
  else if (y > maxy) cy = maxy
  let type
  Groups.forEach(group => {
    group.nodes.forEach(n => {
      if (n.id === typeId) {
        type = n
      }
    })
  })
  return {
    id: guid(),
    'label': type.name,
    'hasInput': type.hasInput,
    'hasOutput': type.hasOutput,
    iconOnRight: type.iconOnRight,
    'error': false,
    'changed': false,
    'status': {
      'show': false,
      'label': 'ad reprehenderit dolore'
    },
    'rect': {
      'x': cx,
      'y': cy,
      'h': height,
      'w': width
    },
    'icon': type.icon,
    'style': {
      'color': type.style['background-color']
    },
    'port': {
      'outputActive': false,
      'inputActive': false
    }
  }
}

export const generateGroup = ({ nodes, links }) => {
  const minX = Math.min(...nodes.map(n => n.rect.x))
  const minY = Math.min(...nodes.map(n => n.rect.y))
  return {
    id: guid(),
    label: '新建分组',
    content: {
      nodes,
      links
    },
    error: false,
    changed: false,
    status: {
      show: false,
      label: ''
    },
    rect: {
      x: minX,
      y: minY,
      w: 140,
      h: 70
    },
    icon: 'icons/node-red/folder.png',
    style: {
      color: 'RGBA(242, 244, 245, 1.00)'
    }
  }
}
