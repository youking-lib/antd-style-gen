const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

const target = "./theme";
const backup = "./backup";
const source = "./antd-source";
const componentsPath = path.resolve(source, "./components");

genTheme(target, source);
genTheme(backup, source);

function genTheme(target, source) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, {
      recursive: true,
    });
  }

  fs.mkdirSync(target);

  const components = fs.readdirSync(componentsPath).filter(item => {
    return !["__tests__", "_util", "index.tsx"].includes(item);
  });

  let indexLessContent = "";

  components.forEach(component => {
    const src = `${source}/components/${component}/style`;
    const dist = `${target}/${component}/style`;

    // 部分 component 没有样式 locale, overview, style
    if (!fs.existsSync(src)) return;

    fs.mkdirSync(`${target}/${component}`);
    copyTo(src, dist);

    if (fs.existsSync(`${src}/index.less`)) {
      indexLessContent += `@import './${component}/style/index.less';\n`;
    }
  });

  copyTo(`${source}/components/style`, `./${target}/style`);

  fs.writeFileSync(`./${target}/index.less`, indexLessContent, {
    encoding: "utf8",
  });
}

function copyTo(src, dist) {
  child_process.spawn("cp", ["-r", src, dist]);
}
