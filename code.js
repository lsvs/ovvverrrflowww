function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const node = figma.currentPage.selection[0];
if (node && "children" in node && node.children.length) {
    const timeout = 1000 / node.children.length;
    const width = node.width;
    const height = node.height;
    for (const child of node.children) {
        child.visible = false;
    }
    node.children.forEach((child, i) => {
        setTimeout(() => {
            child.x = getRandomInt(width);
            child.y = getRandomInt(height);
            child.rotation = getRandomInt(360);
            child.visible = true;
        }, i * timeout);
    });
    setTimeout(() => {
        figma.closePlugin();
    }, node.children.length * timeout + 1);
}
else {
    figma.notify("Please first select a frame with children elements");
    figma.closePlugin();
}
