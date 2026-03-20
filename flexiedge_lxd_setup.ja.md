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
    nictype: p2p
    type: nic
  mem:
    path: /dev/mem
    type: unix-char
  root:
    path: /
    pool: default
    type: disk
```

## 2. コンテナの起動とインストール / Launch & Install

Ubuntu 20.04 を使用します（`flexiwan-router` パッケージの対応状況に合わせます）。

```bash
# Ubuntu 20.04 コンテナの起動
lxc launch ubuntu:20.04 edge01 --profile flexiedge

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

## 4. 注意事項 / Notes

- **Systemd**: LXD コンテナはシステムコンテナであるため、コンテナ起動時に `systemd` が PID 1 として正しく初期化されます。Docker (特にネスト環境) で発生しやすい起動エラーを回避できます。
- **2つのNIC**: FlexiWAN のヘルスチェック機能を正常に動作させるため、少なくとも2つのネットワークインターフェース（WAN用とLAN用など）が必要です。
- **管理側の疎通**: LXD コンテナ内から、同一 WSL2 ホスト上の flexiManage の IP アドレスへ通信できることを確認してください。

---
> [!TIP]
> インストール完了後、以下のコマンドを実行してデバイスを登録してください。
> ```bash
> fwan-device register -t <TOKEN> -m <MANAGE_IP_OR_URL>
> ```
