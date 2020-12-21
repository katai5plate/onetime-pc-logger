# onetime-pc-logger

数秒ごとに PC の状況ログを上書きする PC ロガー

## why?

最近よく謎のフリーズをするが、原因がよくわからんため。

熱暴走を疑ってる。

## usage

`node .` or `start.bat`

- `npm i` を忘れずに
- ログは `onetime.log` に吐き出される
- 3 秒ごとに更新
- CPU温度を度数に直す場合: `CPU温度 / 10 - 273.15`

## concept

5 秒ごとに以下の情報を取得し、ログファイルを上書きする。

- CPU 温度
  - `wmic /namespace:\\root\wmi PATH MSAcpi_ThermalZoneTemperature get CurrentTemperature`
- CPU 使用率
  - ~~`wmic CPU get loadpercentage`~~
  - `typeperf -sc 1 "\processor(_Total)\% Processor Time"`
- GPU 状況
  - `nvidia-smi`
- タスクリスト
  - `tasklist -v`
