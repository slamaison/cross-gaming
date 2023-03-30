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


let dataJson = JSON.parse(fs.readFileSync("data.json"));

const broughtGames = dataJson.setup.map(e => e.game);

broughtGames.forEach(e => {
  let game = dataJson.games.find(g => g.name === e)
  if(!game){
    console.error("Game " + e + " not found !")
  }
});

let games = dataJson.games.filter(g => broughtGames.includes(g.name))
games.sort((g1,g2) => g1.name > g2.name ? 1 : -1);
games.forEach(g => {
  g.person = dataJson.setup.find(e => e.game == g.name).person
});


const cfg = JSON.parse('{"pretty":true}');
cfg.games = games;

let html = pug.renderFile("index.pug",cfg); 
fs.outputFileSync("docs/index.html",html);
