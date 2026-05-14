<!-- Part of FAE Power — Android TV FAE 工作流助手 -->

# Log Advisor — 日志收集指导（7 问题类型 + ADB 命令）

当 FAE 工程师需要日志收集指导时，根据问题类型提供具体的日志收集方案和 ADB 命令。

## 问题类型识别

根据问题描述或用户明确指定，识别以下7种问题类型：

| 问题类型 | 触发关键词 |
|----------|-----------|
| 视频播放 (video-playback) | 播放、视频卡顿、花屏、黑屏播放、DRM、Widevine、codec |
| 开机故障 (boot-failure) | 无法开机、卡logo、bootloop、brick、开机慢、recovery |
| 遥控器 (remote-control) | 遥控器、按键、配对、IR、蓝牙遥控、语音遥控 |
| 网络 (network) | WiFi、蓝牙连接、以太网、断网、网速慢、DNS |
| 显示/画质 (display-pq) | 显示异常、画质、HDR、闪屏、分辨率、HDMI显示 |
| 音频 (audio) | 无声、杂音、音量、Dolby、DTS、ARC、音频输出 |
| App崩溃/ANR (app-crash-anr) | 崩溃、ANR、闪退、无响应、crash、tombstone |

## 日志收集方案

### 1. 视频播放 (video-playback)

```markdown
## 日志收集指南: 视频播放问题

### 必须收集的日志
| # | 日志类型 | 命令 | 优先级 |
|---|----------|------|--------|
| 1 | Logcat (全量) | `adb logcat -v threadtime > logcat.txt` | 必须 |
| 2 | Kernel log (dmesg) | `adb shell dmesg > dmesg.txt` | 必须 |
| 3 | Bugreport | `adb bugreport > bugreport.zip` | 必须 |
| 4 | DRM 相关日志 | `adb logcat -v threadtime -s DrmHal:* MediaDrm:* CryptoHal:* > drm_log.txt` | 必须(DRM内容) |

### 可选日志
| # | 日志类型 | 命令 | 说明 |
|---|----------|------|------|
| 1 | 播放时间线 | `adb logcat -v threadtime -s NuPlayer:* MediaCodec:* > playback_timeline.txt` | 分析播放卡顿时有用 |
| 2 | MediaCodec 信息 | `adb shell dumpsys media.codec` | 查看 codec 实例状态 |
| 3 | 视频解码器状态 | `adb shell cat /sys/class/video/frame_info` | 平台相关，查看解码帧信息 |
```

### 2. 开机故障 (boot-failure)

```markdown
## 日志收集指南: 开机故障

### 必须收集的日志
| # | 日志类型 | 命令 | 优先级 |
|---|----------|------|--------|
| 1 | Serial log (串口日志) | 通过串口工具(如 minicom/putty)连接 UART 端口抓取 | 必须 |
| 2 | Kernel log | `adb shell dmesg > kernel_log.txt` (如能进入adb) | 必须 |
| 3 | Bootloader log | 串口日志中 bootloader 阶段输出 | 必须 |
| 4 | Last kmsg / pstore | `adb shell cat /sys/fs/pstore/console-ramoops-0 > last_kmsg.txt` 或 `adb shell cat /proc/last_kmsg > last_kmsg.txt` | 必须 |

### 可选日志
| # | 日志类型 | 命令 | 说明 |
|---|----------|------|------|
| 1 | 开机视频录制 | 手机录制开机全过程 | 记录卡在哪个阶段 |
| 2 | Recovery log | `adb shell cat /cache/recovery/last_log` | 如果涉及 recovery 模式 |
| 3 | Boot reason | `adb shell cat /proc/cmdline` | 查看启动参数 |
```

### 3. 遥控器 (remote-control)

```markdown
## 日志收集指南: 遥控器问题

### 必须收集的日志
| # | 日志类型 | 命令 | 优先级 |
|---|----------|------|--------|
| 1 | Input event | `adb shell getevent -lt > getevent.txt` | 必须 |
| 2 | BT HCI log | `adb shell settings put secure bluetooth_hci_log 1` 然后重现问题后 `adb pull /data/misc/bluetooth/logs/` | 必须(蓝牙遥控) |
| 3 | IR 信号捕获 | `adb logcat -v threadtime -s IRReceiver:* remote:* > ir_log.txt` | 必须(IR遥控) |
| 4 | Input 系统日志 | `adb logcat -v threadtime -s InputReader:* InputDispatcher:* > input_log.txt` | 必须 |

### 可选日志
| # | 日志类型 | 命令 | 说明 |
|---|----------|------|------|
| 1 | 配对过程视频 | 手机录制配对操作全过程 | 蓝牙配对问题时有用 |
| 2 | BT 状态 | `adb shell dumpsys bluetooth_manager` | 查看蓝牙连接状态 |
| 3 | Key layout | `adb shell cat /system/usr/keylayout/*.kl` | 确认按键映射 |
```

### 4. 网络 (network)

```markdown
## 日志收集指南: 网络问题

### 必须收集的日志
| # | 日志类型 | 命令 | 优先级 |
|---|----------|------|--------|
| 1 | Logcat (connectivity) | `adb logcat -v threadtime -s WifiService:* ConnectivityService:* NetworkAgent:* > net_logcat.txt` | 必须 |
| 2 | Connectivity dump | `adb shell dumpsys connectivity > connectivity_dump.txt` | 必须 |
| 3 | Wi-Fi scan 结果 | `adb shell cmd wifi list-scan-results > wifi_scan.txt` | 必须 |
| 4 | 网络配置 | `adb shell dumpsys netd > netd_dump.txt` 和 `adb shell ifconfig > ifconfig.txt` | 必须 |

### 可选日志
| # | 日志类型 | 命令 | 说明 |
|---|----------|------|------|
| 1 | Wi-Fi 详细状态 | `adb shell dumpsys wifi > wifi_dump.txt` | 查看 Wi-Fi 详细连接信息 |
| 2 | DNS 解析测试 | `adb shell nslookup www.google.com` | 验证 DNS 是否正常 |
| 3 | Ping 测试 | `adb shell ping -c 10 8.8.8.8` | 验证网络连通性 |
```

### 5. 显示/画质 (display-pq)

```markdown
## 日志收集指南: 显示/画质问题

### 必须收集的日志
| # | 日志类型 | 命令 | 优先级 |
|---|----------|------|--------|
| 1 | Logcat | `adb logcat -v threadtime > logcat.txt` | 必须 |
| 2 | Kernel log (dmesg) | `adb shell dmesg > dmesg.txt` | 必须 |
| 3 | Display dump | `adb shell dumpsys display > display_dump.txt` | 必须 |
| 4 | HDMI 信号信息 | `adb shell cat /sys/class/amhdmitx/amhdmitx0/attr` 和 `adb shell cat /sys/class/amhdmitx/amhdmitx0/disp_cap` | 必须(外接显示) |

### 可选日志
| # | 日志类型 | 命令 | 说明 |
|---|----------|------|------|
| 1 | 问题截图/照片 | `adb shell screencap /sdcard/screenshot.png && adb pull /sdcard/screenshot.png` | 记录显示异常现象 |
| 2 | SurfaceFlinger | `adb shell dumpsys SurfaceFlinger > sf_dump.txt` | 查看图层合成信息 |
| 3 | HDR 状态 | `adb shell cat /sys/class/amhdmitx/amhdmitx0/hdr_cap` | 查看 HDR 能力和状态 |
```

### 6. 音频 (audio)

```markdown
## 日志收集指南: 音频问题

### 必须收集的日志
| # | 日志类型 | 命令 | 优先级 |
|---|----------|------|--------|
| 1 | Logcat (audio) | `adb logcat -v threadtime -s AudioFlinger:* AudioPolicyManager:* AudioHAL:* > audio_logcat.txt` | 必须 |
| 2 | Audio dump | `adb shell dumpsys audio > audio_dump.txt` | 必须 |
| 3 | Audio routing | `adb shell dumpsys audio_policy > audio_policy_dump.txt` | 必须 |
| 4 | HDMI ARC/eARC 状态 | `adb shell cat /sys/class/amhdmitx/amhdmitx0/aud_cap` 和 `adb shell tinymix` | 必须(外接音频设备) |

### 可选日志
| # | 日志类型 | 命令 | 说明 |
|---|----------|------|------|
| 1 | Dolby/DTS 状态 | `adb shell getprop | grep -i dolby` 和 `adb shell getprop | grep -i dts` | Dolby/DTS 相关问题 |
| 2 | Audio HAL 信息 | `adb shell dumpsys media.audio_flinger` | 查看底层音频状态 |
| 3 | HDMI EDID | `adb shell cat /sys/class/amhdmitx/amhdmitx0/edid` | 查看接收端音频能力 |
```

### 7. App崩溃/ANR (app-crash-anr)

```markdown
## 日志收集指南: App崩溃/ANR

### 必须收集的日志
| # | 日志类型 | 命令 | 优先级 |
|---|----------|------|--------|
| 1 | Bugreport | `adb bugreport > bugreport.zip` | 必须 |
| 2 | Tombstone 文件 | `adb pull /data/tombstones/` | 必须(Native crash) |
| 3 | ANR traces | `adb pull /data/anr/` | 必须(ANR) |
| 4 | App 版本信息 | `adb shell dumpsys package [package_name] | grep -i version` | 必须 |

### 可选日志
| # | 日志类型 | 命令 | 说明 |
|---|----------|------|------|
| 1 | 内存信息 | `adb shell dumpsys meminfo [package_name]` | 怀疑 OOM 时 |
| 2 | CPU 使用率 | `adb shell top -n 3 > cpu_usage.txt` | 怀疑 CPU 占用过高时 |
| 3 | App 运行日志 | `adb logcat -v threadtime --pid=$(adb shell pidof [package_name]) > app_log.txt` | 获取特定 app 日志 |
```

## 日志收集通用规则

1. **时间同步**: 收集日志前建议先执行 `adb shell date` 记录设备时间，确保日志时间戳可对照
2. **复现时收集**: 建议在复现问题的过程中同步抓取日志，而非事后抓取
3. **完整性**: 必须级别的日志缺失时，应提醒客户补充
4. **命令适配**: 部分命令路径可能因平台/芯片方案不同而有差异，如遇到 "file not found" 需要根据具体平台调整路径
5. **隐私注意**: bugreport 中可能包含用户隐私数据，提醒客户在分享前确认

## 输出规则

1. 根据问题类型选择对应的日志收集方案
2. 如果问题涉及多个类型（如"播放视频时崩溃"），合并相关方案的必须日志
3. 条件性日志（如"必须(DRM内容)"）根据具体场景判断是否包含
4. 所有命令必须是可直接复制执行的格式
5. 对于平台特定的命令，标注适用平台或提供替代命令
