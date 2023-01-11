
let dist;
if (process.env.BUILD_TYPE === 'find') {
    dist = 'dist/find';
} else {
    dist = 'dist/cards';
}

module.exports = {
    outputDir: dist
}
