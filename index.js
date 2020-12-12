const { writeFileSync } = require("fs");
const { execSync } = require("child_process");
const { convert } = require("encoding-japanese");

const exec = (code) =>
  convert(execSync(code), {
    from: "SJIS",
    to: "UNICODE",
    type: "string",
  });

const run = () => {
  const log = [
    "-- CPU Temperature --",
    exec(
      "wmic /namespace:\\\\root\\wmi PATH MSAcpi_ThermalZoneTemperature get CurrentTemperature"
    ),
    "-- CPU Usage --",
    exec("wmic CPU get loadpercentage"),
    "-- GPU --",
    exec("nvidia-smi"),
    "-- Tasks --",
    exec("tasklist -v"),
  ].join("\n");
  writeFileSync("./onetime.log", log);
};

console.log("START!");
run();
setInterval(run, 5000);
