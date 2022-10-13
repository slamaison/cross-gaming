const pug = require('pug');
const fs = require('fs-extra');
const sass = require('dart-sass');
const autoprefixer = require('autoprefixer')
const postcss = require('postcss')
const merge = require('deepmerge')

//Build SASS
const sassResult = sass.renderSync({file: 'sass/style.scss',outputStyle:'compressed',sourceMap:'auto'});
postcss([ autoprefixer ]).process(sassResult.css, { from: undefined}).then(result => {
    result.warnings().forEach(warn => {
      console.warn(warn.toString())
    })
    fs.createWriteStream('docs/css/style.min.css').write(Buffer.from(result.css) + "\r\n" + "/*# sourceMappingURL=./styles.min.css.map*/");
    fs.createWriteStream('docs/css/style.min.css.map').write(Buffer.from(sassResult.map));
});

const pugOptions = JSON.parse('{"pretty":true}');
let dataJson = JSON.parse(fs.readFileSync("data.json"));
dataJson.games.sort((a,b) => a.name > b.name ? 1 : -1);

let computedJson = merge(pugOptions,dataJson);

let html = pug.renderFile("index.pug",computedJson); 
fs.outputFileSync("docs/index.html",html);