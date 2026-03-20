# FlexiEdge Docker on LXD 構築ガイド (修正版 v2) / FlexiEdge Docker on LXD Setup Guide (Revised v2)

> [!WARNING]
> **WSL2 上の LXD でのネスト利用について**:
> WSL2 内の LXD コンテナ上で Docker を動かし、さらにその中で `systemd` を必要とする `flexiwan-router` を動かす構成は、環境により `systemd` (PID 1) の初期化エラーが発生しやすく、**WSL2 環境では非推奨**です。
> WSL2 でのシミュレーションには [LXD 構築ガイド](file:///home/hitoshi/src/fleximanage-ui/flexiedge_lxd_custom_setup.ja.md) の使用を強く推奨します。

本ガイドは、標準的な Linux (Bare Metal/VM) で LXD コンテナを使用した検証を行う場合のリファレンスとして残されています。

## 1. LXD コンテナの準備 / LXD Container Prep

LXD 側で Docker のネストと特権実行を許可します。

### プロファイル設定
```bash
lxc profile create docker
lxc profile edit docker
```

設定内容：
```yaml
config:
  security.nesting: "true"
  security.privileged: "true"
  linux.kernel_modules: overlay,nf_nat,br_netfilter
devices:
  eth0:
    name: eth0
    network: lxdbr0
    type: nic
```

### コンテナ起動
```bash
lxc launch ubuntu:24.04 my-edge-host --profile default --profile docker
```

## 2. Docker のインストールと準備 / Docker Setup

LXD コンテナ内で Docker を起動します。

```bash
lxc exec my-edge-host -- bash
# (コンテナ内)
apt update && apt install -y docker.io
```

## 3. FlexiEdge 用 Dockerfile / FlexiEdge Dockerfile

インストール時の `systemd` 関連エラーを回避するため、`policy-rc.d` を使用してビルド中のサービス起動を抑制します。

### Dockerfile の作成
```dockerfile
FROM ubuntu:20.04

# インストール時のサービス起動を抑制 (Error 1 防止)
RUN printf '#!/bin/sh\nexit 101' > /usr/sbin/policy-rc.d && \
    chmod +x /usr/sbin/policy-rc.d

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    software-properties-common \
    curl \
    gnupg2 \
    systemd \
    rsyslog \
    iproute2 \
    dbus

# flexiWAN リポジトリの追加とインストール
RUN curl -sL https://deb.flexiwan.com/setup | bash - && \
    apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y flexiwan-router

# インストール制限を解除
RUN rm /usr/sbin/policy-rc.d

# systemd の不要なユニットを削除 (オプション)
RUN find /etc/systemd/system/lib/systemd/system/ -path '*/sysinit.target.wants/*' -delete

STOPSIGNAL SIGRTMIN+3

# systemd を PID 1 として起動
ENTRYPOINT ["/lib/systemd/systemd"]
```

## 4. コンテナのビルドと起動 / Build & Run

### ビルド
```bash
docker build -t flexiedge-focal .
```

### 起動 (重要フラグ)
`systemd` を動作させるため、`--privileged` フラグと `/sys/fs/cgroup` の読み取り専用マウント（環境により不要な場合もありますが推奨）を付与します。

```bash
# Hub
docker run -d --name edge-hub --privileged \
    -v /lib/modules:/lib/modules:ro \
    flexiedge-focal

# Spoke
docker run -d --name edge-spoke1 --privileged \
    -v /lib/modules:/lib/modules:ro \
    flexiedge-focal
```

## 5. デバッグと確認 / Debugging

起動後、コンテナに入ってステータスを確認します。

```bash
docker exec -it edge-hub bash
# (コンテナ内)
systemctl status flexiwan-router
fwan-mgmt agent setup
```

---
> [!TIP]
> **Failed to connect to bus** エラーが出る場合は、host側（LXD）で `dbus` が動作しているか、または `docker run` 時に `-v /run/dbus:/run/dbus` を試してください。
