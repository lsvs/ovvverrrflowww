const DURATION = 1000

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max))
}

const nodes = figma.currentPage.selection

const options = ['yes', 'no']

figma.parameters.on('input', ({ result, query }: ParameterInputEvent) => {
  result.setSuggestions(options.filter((el) => el.startsWith(query.toLowerCase())))
})

figma.on('run', ({ parameters }: RunEvent) => {
  // Get configuration
  const position = parameters?.position === 'no' ? false : true
  const rotation = parameters?.rotation === 'no' ? false : true
  const index = parameters?.index === 'no' ? false : true

  const nodeTimeput = DURATION / nodes.length
  let runned = false
  let i = 0

  while (i < nodes.length) {
    const node = nodes[i]

    if (!node || !('children' in node) || !node.children.length) {
      i++
      continue
    }

    runned = true

    const timeout = nodeTimeput / node.children.length
    const width = node.width
    const height = node.height

    const children = []
    for (const child of node.children) {
      child.visible = false
      children.push(child)
    }

    // Random index
    if (index) children.sort(() => getRandomInt(3) - 1)

    children.forEach((child, j) => {
      setTimeout(() => {
        node.appendChild(child)

        // Random position
        if (position) {
          child.x = getRandomInt(width)
          child.y = getRandomInt(height)
        }

        // Random rotation
        if (rotation && 'rotation' in child) {
          child.visible = true
          const group = figma.group([child], node)

          const cx = group.x + group.width / 2
          const cy = group.y + group.height / 2
          const x = group.x
          const y = group.y

          const angle = getRandomInt(360) * (Math.PI / 180)
          const cos = Math.cos(angle)
          const sin = Math.sin(angle)

          const newx = cos * (x - cx) + sin * (y - cy) + cx
          const newy = -sin * (x - cx) + cos * (y - cy) + cy

          group.relativeTransform = [
            [cos, sin, newx],
            [-sin, cos, newy],
          ]

          figma.ungroup(group)
        }

        child.visible = true
      }, i * nodeTimeput + j * timeout)
    })
    i++
  }

  if (!runned) {
    figma.notify('Please first select at least one frame containing child elements.')
    figma.closePlugin()
  } else {
    setTimeout(() => {
      figma.closePlugin()
    }, DURATION + 1)
  }
})
