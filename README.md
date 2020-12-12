# onetime-pc-logger

数秒ごとにPCの状況ログを上書きするPCロガー

## why?

最近よく謎のフリーズをするが、原因がよくわからんため。

熱暴走を疑ってる。

## concept

5 秒ごとに以下の情報を取得し、ログファイルを上書きする。
- CPU温度
  - `wmic /namespace:\\root\wmi PATH MSAcpi_ThermalZoneTemperature get CurrentTemperature`
- CPU使用率
  - `wmic CPU get loadpercentage`
- GPU状況
  - `nvidia-smi`
- タスクリスト
  - `tasklist -v`
