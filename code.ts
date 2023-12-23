function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max))
}

const node = figma.currentPage.selection[0]
const options = ['yes', 'no']

figma.parameters.on('input', ({ result, query }: ParameterInputEvent) => {
  result.setSuggestions(options.filter((el) => el.startsWith(query.toLowerCase())))
})
figma.on('run', ({ parameters }: RunEvent) => {
  const position = parameters?.position === 'no' ? false : true
  const rotation = parameters?.rotation === 'no' ? false : true
  const index = parameters?.index === 'no' ? false : true

  if (node && 'children' in node && node.children.length) {
    const timeout = 1000 / node.children.length
    const width = node.width
    const height = node.height
    const children = []
    for (const child of node.children) {
      child.visible = false
      children.push(child)
    }
    if (index) children.sort(() => getRandomInt(3) - 1)
    children.forEach((child, i) => {
      setTimeout(() => {
        node.appendChild(child)
        if (position) {
          child.x = getRandomInt(width)
          child.y = getRandomInt(height)
        }
        if (rotation && 'rotation' in child) child.rotation = getRandomInt(360)
        child.visible = true
      }, i * timeout)
    })
    setTimeout(() => {
      figma.closePlugin()
    }, node.children.length * timeout + 1)
  } else {
    figma.notify('Please first select a frame with children elements')
    figma.closePlugin()
  }
})
