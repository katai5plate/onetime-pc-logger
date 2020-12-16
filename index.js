const { writeFileSync } = require("fs");
const { execSync } = require("child_process");
const { convert } = require("encoding-japanese");
const { parse } = require("papaparse");

const exec = (code) =>
  convert(execSync(code), {
    from: "SJIS",
    to: "UNICODE",
    type: "string",
  });

const EMPTY = "<<< EMPTY >>>";
let log = (prelog = EMPTY);
const run = () => {
  prelog = log;
  log = [
    "-- CPU Temperature --",
    exec(
      "wmic /namespace:\\\\root\\wmi PATH MSAcpi_ThermalZoneTemperature get CurrentTemperature"
    ),
    "-- CPU Usage --",
    exec('typeperf -sc 1 "\\processor(_Total)\\% Processor Time"'),
    "-- GPU --",
    exec("nvidia-smi"),
    "-- Tasks --",
    (() => {
      const { data } = parse(exec("tasklist -v -fo csv"));
      const [label, ...rest] = data;
      return JSON.stringify(
        rest
          .filter((x) => x.length === label.length)
          .map((x) => x.reduce((p, c, i) => ({ ...p, [label[i]]: c }), {}))
          .map((x) => ({
            ...x,
            "セッション#": Number(x["セッション#"]),
            メモリ使用量: Number(
              x["メモリ使用量"].replace(/,/, "").replace(/\D+/, "")
            ),
          }))
          .sort((a, b) => b["メモリ使用量"] - a["メモリ使用量"]),
        null,
        2
      );
    })(),
  ].join("\n");
  writeFileSync("./onetime.log", log);
  writeFileSync("./onetime.prev.log", prelog);
};

console.log("START!");
run();
const i = setInterval(() => {
  try {
    run();
  } catch (error) {
    writeFileSync("./onetime.preerror.log", log);
    writeFileSync("./onetime.error.log", `${new Date()}\n${error}`);
    clearInterval(i);
  }
}, 3000);
