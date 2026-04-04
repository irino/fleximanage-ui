# FlexiEdge LXD 構築ガイド (標準インストール) / FlexiEdge LXD Setup Guide (Standard Install)

WSL2 上の LXD コンテナを使用して、Ubuntu 20.04 (Focal) コンテナに `flexiwan-router` apt パッケージを直接インストールするためのガイドです。

## 1. LXD プロファイルの作成 / Creating LXD Profile

flexiEdge が `systemd` や `VPP` を正常に動作させるために必要な特権を付与したプロファイルを作成します。

```bash
lxc profile create flexiedge
lxc profile edit flexiedge
```

設定内容（YAML）：
```yaml
name: flexiedge
description: Profile for flexiedge
config:
  linux.kernel_modules: overlay,nf_nat,br_netfilter
  raw.lxc: lxc.cap.keep=
  security.nesting: "true"
  security.privileged: "true"
devices:
  eth0:
    name: eth0
    network: lxdbr0
    type: nic
  eth1:
    name: eth1
    nictype: macvlan
    parent: enp7s0
    type: nic
  mem:
    path: /dev/mem
    type: unix-char
  root:
    path: /
    pool: default
    type: disk
used_by:
- /1.0/instances/edge01
project: default
```

## 2. コンテナの起動とインストール / Launch & Install

Ubuntu 20.04 を使用します（`flexiwan-router` パッケージの対応状況に合わせます）。

```bash
# Ubuntu 20.04 コンテナの起動
lxc launch ubuntu:20.04 edge01 --profile flexiedge
```

```bash
# Dockerが動作している場合のiptablesの設定
iptables -I DOCKER-USER -i lxdbr0 -j ACCEPT
iptables -I DOCKER-USER -o lxdbr0 -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
```

```bash
# コンテナ内でのインストール
lxc exec edge01 -- bash
# (コンテナ内)
curl -sL https://deb.flexiwan.com/setup | bash -
apt-get update && apt-get install -y flexiwan-router
```

## 3. 構成例 (01 Hub, 02&03 Spoke) / Example Configuration

```bash
lxc launch ubuntu:20.04 edge01 --profile flexiedge

lxc launch ubuntu:20.04 edge02 --profile flexiedge

lxc launch ubuntu:20.04 edge03 --profile flexiedge
```

## 4. flexiedgeの最低限の設定
`fwsystem_checker `を実行する。`2  - configure system silently`を選択して、自動修正して`CRITICAL`が`PASSED`になるようにする。

## 5. fleximanageとの接続
コンテナの`/etc/hosts`にfleximanageのIPアドレスを追加する。以下はサンプル。
```bash
[IP_ADDRESS] fleximanage.localdomain
```

`/etc/flexiwan/agent/agent.yaml`を編集する。以下はサンプルで変更点は以下
- server: fleximanageのIPアドレスに変更
- bypass_certificate: trueに変更

```yaml
agent:
  server: https://fleximanage.localdomain:3443  # default: https://app.flexiwan.com:443
  token: /etc/flexiwan/agent/token.txt  # default: /etc/flexiwan/agent/token.txt
  bypass_certificate: true             # default: false
  monitor_wan:
    monitor_unassigned_interfaces: true # default: true
    servers: [1.1.1.1, 8.8.8.8]         # default: [1.1.1.1, 8.8.8.8]
    probe_timeout: 1000                 # default: 1000 msec
  debug: true                           # default: true
  daemon_socket: 127.0.0.1:9090         # default: 127.0.0.1:9090
  watchdog:
    deadlock:
      enabled: true                     # default: true
    connection:
      enabled: true                     # default: true
      router_cfg_window: 240            # default: 240 sec, if 0 - disabled
  message_transmission:
    # sets the delay between long-message chunk transmissions
    delay_between_chunks: 10            # default: 10 milliseconds
  uuid: 8D2B8034-24F3-11F1-B6F7-8D4302196935
edgeui:
  enabled: true                         # default or omit: true
```
fleximanageのtoken(/api/tokens)を取得して、`/etc/flexiwan/agent/token.txt`に保存する。

## 6. 注意事項 / Notes

- **Systemd**: LXD コンテナはシステムコンテナであるため、コンテナ起動時に `systemd` が PID 1 として正しく初期化されます。Docker (特にネスト環境) で発生しやすい起動エラーを回避できます。
- **2つのNIC**: FlexiWAN のヘルスチェック機能を正常に動作させるため、少なくとも2つのネットワークインターフェース（WAN用とLAN用など）が必要です。
- **管理側の疎通**: LXD コンテナ内から、同一 WSL2 ホスト上の flexiManage の IP アドレスへ通信できることを確認してください。

---
> [!TIP]
> インストール完了後、以下のコマンドを実行してデバイスを登録してください。
> ```bash
> fwan-device register -t <TOKEN> -m <MANAGE_IP_OR_URL>
> ```
