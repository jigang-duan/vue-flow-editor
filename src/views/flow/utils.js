
const onlyPositive = (num) => num > 0 ? num : 0

export const nodeInfoByEvent = (event) => {
  const id = event.dataTransfer.getData('node_id')
  const touchX = event.dataTransfer.getData('node_touch_x')
  const touchY = event.dataTransfer.getData('node_touch_y')
  const x = onlyPositive(event.offsetX - touchX)
  const y = onlyPositive(event.offsetY - touchY)
  return {
    typeId: id, x, y
  }
}

export const calcMousePosition = (event, svgElement, scale = 1.0) => {
  const x = (event.pageX - svgElement.getBoundingClientRect().x) / scale
  const y = (event.pageY - svgElement.getBoundingClientRect().y) / scale
  return {
    x, y
  }
}

export const mouseAtNode = (event, scale = 1.0) => calcMousePosition(event, event.target.parentElement, scale)

const node_width = 100
const node_height = 30
const lineCurveScale = 0.75

export const generateLinkPath = (origX, origY, destX, destY, sc) => {
  const dy = destY - origY
  const dx = destX - origX
  const delta = Math.sqrt(dy * dy + dx * dx)
  let scale = lineCurveScale
  const scaleY = 0
  if (dx * sc > 0) {
    if (delta < node_width) {
      scale = 0.75 - 0.75 * ((node_width - delta) / node_width)
      // scale += 2*(Math.min(5*node_width,Math.abs(dx))/(5*node_width));
      // if (Math.abs(dy) < 3*node_height) {
      //     scaleY = ((dy>0)?0.5:-0.5)*(((3*node_height)-Math.abs(dy))/(3*node_height))*(Math.min(node_width,Math.abs(dx))/(node_width)) ;
      // }
    }
  } else {
    scale = 0.4 - 0.2 * (Math.max(0, (node_width - Math.min(Math.abs(dx), Math.abs(dy))) / node_width))
  }
  if (dx * sc > 0) {
    return 'M ' + origX + ' ' + origY +
          ' C ' + (origX + sc * (node_width * scale)) + ' ' + (origY + scaleY * node_height) + ' ' +
          (destX - sc * (scale) * node_width) + ' ' + (destY - scaleY * node_height) + ' ' +
          destX + ' ' + destY
  } else {
    const midX = Math.floor(destX - dx / 2)
    let midY = Math.floor(destY - dy / 2)
    //
    if (dy === 0) {
      midY = destY + node_height
    }
    const cp_height = node_height / 2
    const y1 = (destY + midY) / 2
    const topX = origX + sc * node_width * scale
    const topY = dy > 0 ? Math.min(y1 - dy / 2, origY + cp_height) : Math.max(y1 - dy / 2, origY - cp_height)
    const bottomX = destX - sc * node_width * scale
    const bottomY = dy > 0 ? Math.max(y1, destY - cp_height) : Math.min(y1, destY + cp_height)
    const x1 = (origX + topX) / 2
    const scy = dy > 0 ? 1 : -1
    const cp = [
      // Orig -> Top
      [x1, origY],
      [topX, dy > 0 ? Math.max(origY, topY - cp_height) : Math.min(origY, topY + cp_height)],
      // Top -> Mid
      // [Mirror previous cp]
      [x1, dy > 0 ? Math.min(midY, topY + cp_height) : Math.max(midY, topY - cp_height)],
      // Mid -> Bottom
      // [Mirror previous cp]
      [bottomX, dy > 0 ? Math.max(midY, bottomY - cp_height) : Math.min(midY, bottomY + cp_height)],
      // Bottom -> Dest
      // [Mirror previous cp]
      [(destX + bottomX) / 2, destY]
    ]
    if (cp[2][1] === topY + scy * cp_height) {
      if (Math.abs(dy) < cp_height * 10) {
        cp[1][1] = topY - scy * cp_height / 2
        cp[3][1] = bottomY - scy * cp_height / 2
      }
      cp[2][0] = topX
    }
    return 'M ' + origX + ' ' + origY +
          ' C ' +
             cp[0][0] + ' ' + cp[0][1] + ' ' +
             cp[1][0] + ' ' + cp[1][1] + ' ' +
             topX + ' ' + topY +
          ' S ' +
             cp[2][0] + ' ' + cp[2][1] + ' ' +
             midX + ' ' + midY +
         ' S ' +
            cp[3][0] + ' ' + cp[3][1] + ' ' +
            bottomX + ' ' + bottomY +
          ' S ' +
              cp[4][0] + ' ' + cp[4][1] + ' ' +
              destX + ' ' + destY
  }
}

export const getAllFlowNodes = (node, links) => {
  const visited = {}
  visited[node.id] = true
  const nns = [node]
  const stack = [node]
  while (stack.length !== 0) {
    const n = stack.shift()
    const childLinks = links.filter(d => (d.source.id === n.id) || (d.target.id === n.id))
    childLinks.forEach(childLink => {
      const child = (childLink.source.id === n.id) ? childLink.target : childLink.source
      let id = child.id
      if (!id) {
        id = `${child.source.id}:${child.sourcePort}:${child.target.id}`
      }
      if (!visited[id]) {
        visited[id] = true
        nns.push(child)
        stack.push(child)
      }
    })
  }
  return nns
}
