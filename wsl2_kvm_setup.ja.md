# WSL2/KVM 4-VM クラスタ構築ガイド / WSL2/KVM 4-VM Cluster Setup Guide

WSL2 (Ubuntu 24.04/25.10) 上の KVM を使用し、flexiManage と 3台の FlexiEdge による検証環境を構築する手順です。

## 1. 推奨リソース割り当て / Resource Allocation

4台の VM を同時に動作させるため、ホスト側には最低 **16GB-32GB の RAM** を推奨します。

| VM Name | Role | CPU | RAM | Disk | OS |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `fleximanage` | Management | 2 | 4GB | 40GB | Ubuntu 22.04 |
| `edge-hub` | FlexiEdge (Hub) | 2 | 2GB | 20GB | flexiWAN ISO |
| `edge-spoke1` | FlexiEdge (Spoke) | 2 | 2GB | 20GB | flexiWAN ISO |
| `edge-spoke2` | FlexiEdge (Spoke) | 2 | 2GB | 20GB | flexiWAN ISO |

## 2. ネットワーク構築 / Networking

### 仮想ブリッジの作成
各 VM 間およびホストとの通信用にブリッジを作成します。

```bash
# 管理用ネットワーク (virbr0) はデフォルトで使用。
# 必要に応じて、データ通信用の内部ブリッジを追加作成します。
sudo ip link add name br-data type bridge
sudo ip link set br-data up
```

## 3. flexiManage (Backend) の設置

`virt-install` を使用して Ubuntu VM を作成し、その中で flexiManage (Docker またはソース) を動かします。

```bash
virt-install \
  --name fleximanage \
  --ram 4096 \
  --vcpus 2 \
  --disk size=40 \
  --os-variant ubuntu22.04 \
  --network bridge=virbr0 \
  --graphics none \
  --console pty,target_type=serial \
  --location 'http://archive.ubuntu.com/ubuntu/dists/jammy/main/installer-amd64/' \
  --extra-args 'console=ttyS0,115200n8 serial'
```

## 4. FlexiEdge (3台) の一括セットアップ

ISO から起動し、シリアルコンソール経由でインストールを進めます。

```bash
# Hub
virt-install --name edge-hub --ram 2048 --vcpus 2 --disk size=20 --network bridge=virbr0 --cdrom /path/to/flexiWAN.iso --graphics none --console pty,target_type=serial
# Spoke 1
virt-install --name edge-spoke1 --ram 2048 --vcpus 2 --disk size=20 --network bridge=virbr0 --cdrom /path/to/flexiWAN.iso --graphics none --console pty,target_type=serial
# Spoke 2
virt-install --name edge-spoke2 --ram 2048 --vcpus 2 --disk size=20 --network bridge=virbr0 --cdrom /path/to/flexiWAN.iso --graphics none --console pty,target_type=serial
```

## 5. 管理画面との紐付け

1. ブラウザから `fleximanage` VM の IP アドレス（または本 UI プロジェクト）にアクセス。
2. インベントリからトークンを取得。
3. 各 Edge VM のコンソールで以下を実行：
   ```bash
   sudo fwan-mgmt agent setup
   # 表示に従い、manageのURLとトークンを入力
   ```

---
> [!TIP]
> `virsh start <name>` で各 VM を起動後、`virsh console <name>` で操作可能です。
