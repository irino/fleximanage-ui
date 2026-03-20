# 本ワークスペースのプログラムの目的
- このワークスペースのプログラムでは、Flexiwan(https://gitlab.com/flexiwangroup)のFlexiManage(https://gitlab.com/flexiwangroup/fleximanage)のFrontendとなるWeb User Interfaceを作成することを目的としています。参考となるURLは以下です。
  - https://gitlab.com/flexiwangroup
  - https://gitlab.com/flexiwangroup/fleximanage
- UIの参考となるのは以下のマニュアルです 
  - https://docs.flexiwan.com/6.3.3/
- BackendコードとなるFlexiManage(https://gitlab.com/flexiwangroup/fleximanage)はLocalhostでDockerを用いて動作することを前提としています。localhostのポート番号は3443を使用します。また、オリジナルのbackendコードの動作ホスト名はlocal.flexiwan.comというホスト名になっていますが、このプログラムにおけるbackendの動作ホストはlocalhostを前提にしています。
- 上記の変更により、APIのURLはhttps://localhost:3443/apiになります。また、証明書エラーが出るため、証明書を無視して通信するようにしてください。
- デプロイ環境によってbackendを動作させるホスト名は異なるため、APIのベースURLは環境変数で設定可能にしてソースコードには埋め込まないようにしてください。

# 実装方針
- React+Viteを使用(当初ChatGPTで推奨された結果)
- TypeScriptを使用
- AIがソースコード探索できるように本ワークスペース以下のreferenceディレクトリの下記ディレクトリに参考となるFlexiManageのコードならびにDockerで動作するためのコードを配置しています。このreferenceディレクトリ以下は編集しないようにしてください。
- reference/fleximanage
- reference/fleximanage-docker/
- src/pagesディレクトリは、画面表示に関わるコードを配置するディレクトリです。
- src/apiディレクトリは、Fleximanage backendに対してOpenAPI/SwaggerベースのREST APIを用いて通信するためのコードを配置するディレクトリです。
- UI定義に関わるCSSはソースコード(tsx)内に直接記載せず、外部CSSファイルとして定義してください。外部CSSは共通化し、統一されたデザインを表示してください。
- デバッグコードとして、REST API発行時に、同等のcurlコマンドをブラウザのdebug consoleに表示出来るようにしてください。
- 多言語実装としてください。少なくとも日本語と英語の画面表示が必要です。日本語と英語のの切り替えはUIからリスト選択式としてください。
- OSSとしてgithub(またはgitlab)の公開を計画しています。ライセンスはMIT, BSD2条項またはBSD3条項, Apache2.0のいずれかのCopy right Licenseとしようと思うのでGPLなどのCopyleft licenseが混じらないソースコードとしてください。
- OpenAPI/SwaggerのREST APIの元となる情報は、 reference/fleximanage/backend/api/openapi.yaml に存在します。
- 以下の手法で`src/api/schema.ts`と`src/api/client.ts`を生成しています。(ChatGPT推奨方法)
```
npx openapi-typescript openapi.yaml -o src/api/schema.ts
npx openapi-typescript-fetch openapi.yaml -o src/api/client.ts
```

# ドキュメントの作成方針
- Artifacts(Walkthrough, Implementation Plan, Task)は英語と日本語の両方で生成(または併記)してください
- github(またはgitlab)にアップロードする手段を日本語でドキュメント化してください。reference以下と、.agent及びnpmでインストールしたmodule類はアップロードせず、あくまで今回作成されたファイルのみをアップロード予定です。このgithubへのアップロードのドキュメントもアップロード除外対象です
- 一方で動作に必要な環境構築コマンド(インストールすべきパッケージとそのインストール方法)はREADME.mdに記載してください。README.mdの日本語版はREADME.ja.mdとしてください。README.mdやREADME.ja.mdはアップロード予定です。
- 現在この環境はWSL2(Ubuntu24.04)上でlxdを動かし、lxd container imageとしてUnuntu25.10を使い、そのUbuntu 25.10のlxd container上で、reference/fleximanage-dockerのコードの通りflexiManageをDockerで動作させたうえで、Ubuntu 25.10のlxd container上で、UIを開発しています。
- しかしながらDeviceの試験をするためにはFlexiEdgeを最低3台(Hub1台、Spoke2台)作成する必要があり、かつFlexiEdgeは https://docs.flexiwan.com/6.3.3/installation/download.html によると、IOSやKVM/QEMU imageによる提供になります。WSL2上でKVMを用いて動作させる方法をドキュメント化してください。その際立ち上げるVMは、flexiManage(及び本プロジェクトのflexiManage-UI)が1台、FlexiEdgeが3台の想定です。
- https://hub.docker.com/r/flexiwan/flexiedge にはFlexiedge docker imageがあるようですので、同様に、Deviceの試験をするためにはFlexiEdgeを最低3台(Hub1台、Spoke2台)作成するドキュメントを作成してください。その場合私の環境想定はUbuntu 25.10のlxd container上でのDockerで動作させることをイメージしています。
- 加えて、将来的にflexiEdge自身の拡張を想定しています。全てWSL2上のlxdでコンテナで実現する方法もドキュメント化してほしいです。即ち、https://gitlab.com/flexiwangroup に存在する、flexiRouter, flexiRouterSB, flexiAgent, flexiRouterVPPを組み合わせることを意味します。flexiRouterVPPの代わりに通常のVPP(fd.ioのVPP)を組合す手段もあるかと考えています。 

# 実装するUI画面
- ログイン画面
  - 参考となる画面構成は https://docs.flexiwan.com/6.3.3/management/management-login.html になります。
  - https://gitlab.com/flexiwangroup/fleximanageに記載のログイン手順が参考手順となり、以下と同等のREST APIを用いて通信します。但し以下例ではbackendはlocalhost:3443で動作することを想定しているため、local.flexiwan.comはlocalhostに変更済みです。(ホスト名、ポート名はデプロイ状況に応じて変更してください)
```curl -X POST -sD - -k "https://localhost:3443/api/users/login" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"username\":\"user@example.com\",\"password\":\"xxxxxxxx\",\"captcha\":\"\"}"``` 
    - 但し、最初のログインではユーザ・アカウントが存在しないため、ユーザ作成画面に遷移できるようにしてください。
- ユーザ作成画面
  - 参考となる画面構成は https://docs.flexiwan.com/6.3.3/management/management-login.html になります。
  - https://gitlab.com/flexiwangroup/fleximanageに記載のユーザ作成の手順が参考手順となり、以下と同等のREST APIを用いて通信します。但し以下例ではbackendはlocalhost:3443で動作することを想定しているため、local.flexiwan.comはlocalhostに変更済みです。(ホスト名、ポート名はデプロイ状況に応じて変更してください)
```curl -X POST -k "https://localhost:3443/api/users/register" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"accountName\":\"account\",\"userFirstName\":\"user\",\"userLastName\":\"lastname\",\"email\":\"user@example.com\",\"password\":\"xxxxxxxx\",\"userJobTitle\":\"eng\",\"userPhoneNumber\":\"\",\"country\":\"US\",\"companySize\":\"0-10\",\"serviceType\":\"Provider\",\"numberSites\":\"10\",\"companyType\":\"\",\"companyDesc\":\"\",\"captcha\":\"\"}"``` 
    - この処理の後メール送信されますが、現在のbackendのDocker環境だとメール送信ができないため、以下のユーザ検証画面に遷移できるようにしてください。
- ユーザ検証画面
  - https://gitlab.com/flexiwangroup/fleximanageに記載のユーザ検証手順が参考手順となり、以下と同等のREST APIを用いて通信します。但し以下例ではbackendはlocalhost:3443で動作することを想定しているため、local.flexiwan.comはlocalhostに変更済みです。(ホスト名、ポート名はデプロイ状況に応じて変更してください)
```curl -X POST -k "https://localhost:3443/api/users/verify-account" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"id\":\"<id parameter in the verification link>\",\"token\":\"<token parameter in the verification link>\"}"```

- ログイン後は以下の画面構成としてください。左側にサイドメニューが存在し、上部の右から順に、ログアウトボタン・ログイン中のユーザ名表示・言語選択リストを表示します。ログイン直後はHome画面が表示されています。
  - Home (ホーム)
    - 参考となる画面は https://docs.flexiwan.com/6.3.3/management/management-login.html に記載の画面です。
    - DeviceとしてConnected, Not Connected, Approved, Not Approved, Warningに相当する情報を表示してください
      - Connectedはapi/devicesをGETし、"isConnected": trueとなっている数を表示してください。
      - Not Connectedはapi/devicesをGETし、"isConnected": falseとなっている数または、総数からConnectedの数を減算した数を表示してください。
      - Approvedはapi/devicesをGETし、"isApproved": trueとなっている数を表示してください。
      - Not Approvedはapi/devicesをGETし、"isApproved": falseとなっている数または、総数からApprovedの数を減算した数を表示してください。
    - TunnelsとしてConnected, Not Connected, Pending, Unknwonをに相当する情報を示してください
      - Connectedはapi/tunnelsをGETし、"tunnelStatus": "Connected"となっている数を表示してください。
      - Not Connectedはapi/tunnelsをGETし、"tunnelStatus": "Not Connected"となっている数を表示してください。
      - Pendingはapi/tunnelsをGETし、"tunnelStatus": "Pending"となっている数を表示してください。
      - Unknownはapi/tunnelsをGETし、"tunnelStatus": "Unknown"となっている数を表示してください。
  - Accounts (アカウント)
  　　- api/accountsからGETし取得できる以下の情報を表示してください。また、上部にアカウント作成ボタン(api/accountsをPOSTする動作)及び検索フィールド・検索ボタンを具備してください
      　- "_id", "name", "country", "companyType", "companyDesc", "isSubscriptionValid", "trial_end", "forceMfa"
      　- "name"はリンクとして、クリックするとAccount詳細画面に遷移するようにしてください。詳細画面で編集できるようにしてください。api/accounts/{id}をPUTする動作をしてください。
      　- "isSubscriptionValid"はtrueの場合、緑色のチェックマークを表示してください。
      　- "trial_end"はUNIX timestampで表示されているため、可読性のある時間表記に変換して表示してください。
      　- "forceMfa"はtrueの場合、緑色のチェックマークを表示してください。
  - Organizations (組織)
  　　- api/organizationsからGETし取得できる以下の情報を表示してください。また、上部に組織作成ボタン(api/organizationsをPOSTする動作)及び検索フィールド・検索ボタンを具備してください
      　- "name", "description", "_id", "account", "group", "encryptionMethod", "vxlanPort", "tunnelRange"
      　- "name"はリンクとして、クリックすると組織詳細画面に遷移するようにしてください。詳細画面で編集できるようにしてください。api/organizations/{id}をPUTする動作をしてください。
  - Members (メンバ)
  　　- api/membersからGETし取得できる以下の情報を表示してください。また、上部にメンバ作成ボタン(api/membersをPOSTする動作)及び検索フィールド・検索ボタンを具備してください
      　- "user_email",　"role",　"user__id",　"user_name",　"account_name",　"_id",　"to",　"organization_name",　"account__id",　"group",　"organization__id"
      　- "user_name"はリンクとして、クリックするとメンバ詳細画面に遷移するようにしてください。詳細画面で編集できるようにしてください。api/members/{id}をPUTする動作をしてください。
  - Notifications (通知)
  　　- api/notificationsConf/defaultからGETし取得できる以下の情報を表示してください。設定するAccountをリストで設定できるようにしてください。
      - 以下のデフォルト値を内部的に持ってください。GETして情報が無い場合、この値を表示して、Create(作成)ボタンを表示してください。Create(作成)ボタンを押すとapi/notificationsConf/defaultにPUTしてください。api/notificationsConf/defaultからGETして情報がある場合は、取得した値を表示して、Update(更新)ボタンを表示してください。Update(更新)ボタンを押すとapi/notificationsConf/defaultにPUTしてください。
  ```
      "Device connection": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": null,
        "severity": "critical",
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "device"
    },
    "Running router": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": null,
        "severity": "critical",
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "device"
    },
    "Link/Tunnel round trip time": {
        "warningThreshold": 300,
        "criticalThreshold": 600,
        "thresholdUnit": "ms",
        "severity": null,
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "tunnel"
    },
    "Link/Tunnel default drop rate": {
        "warningThreshold": 5,
        "criticalThreshold": 20,
        "thresholdUnit": "%",
        "severity": null,
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "tunnel"
    },
    "Device memory usage": {
        "warningThreshold": 85,
        "criticalThreshold": 95,
        "thresholdUnit": "%",
        "severity": null,
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "device"
    },
    "Hard drive usage": {
        "warningThreshold": 85,
        "criticalThreshold": 95,
        "thresholdUnit": "%",
        "severity": null,
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "device"
    },
    "Temperature": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": "C°",
        "severity": "critical",
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "device"
    },
    "Software update": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": null,
        "severity": "warning",
        "immediateEmail": false,
        "resolvedAlert": null,
        "sendWebHook": false,
        "type": "device"
    },
    "Internet connection": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": null,
        "severity": "critical",
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "interface"
    },
    "Link status": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": null,
        "severity": "critical",
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "interface"
    },
    "Missing interface ip": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": null,
        "severity": "critical",
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "interface"
    },
    "Pending tunnel": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": null,
        "severity": "critical",
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "tunnel"
    },
    "Tunnel connection": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": null,
        "severity": "critical",
        "immediateEmail": false,
        "resolvedAlert": false,
        "sendWebHook": false,
        "type": "tunnel"
    },
    "Failed self-healing": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": null,
        "severity": "critical",
        "immediateEmail": false,
        "resolvedAlert": null,
        "sendWebHook": false,
        "type": "device"
    },
    "Static route state": {
        "warningThreshold": null,
        "criticalThreshold": null,
        "thresholdUnit": null,
        "severity": "critical",
        "immediateEmail": false,
        "resolvedAlert": null,
        "sendWebHook": false,
        "type": "device"
    }
  ```
  - Devices (デバイス)
    - api/devicesからGETし取得できる以下の情報を表示してください。以下はサンプルです。また、検索フィールド・検索ボタンを具備してください。
```
[
  {
    "interfaces": [
      {
        "IPv6": "IPv6",
        "PublicIP": "PublicIP",
        "PublicPort": "PublicPort",
        "NatType": "NatType",
        "useStun": true,
        "useFixedPublicPort": false,
        "monitorInternet": true,
        "internetAccess": "yes",
        "linkStatus": "up",
        "IPv4": "IPv4",
        "type": "WAN",
        "gateway": "gateway",
        "metric": 0,
        "mtu": 1500,
        "MAC": "MAC",
        "dhcp": "no",
        "routing": "OSPF",
        "IPv6Mask": "64",
        "isAssigned": true,
        "driver": "driver",
        "IPv4Mask": "24",
        "name": "name",
        "devId": "devId",
        "_id": "_id",
        "pathlabels": "path labels list"
      },
      {
        "IPv6": "IPv6",
        "PublicIP": "PublicIP",
        "PublicPort": "PublicPort",
        "NatType": "NatType",
        "useStun": true,
        "useFixedPublicPort": false,
        "monitorInternet": true,
        "internetAccess": "no",
        "linkStatus": "down",
        "IPv4": "IPv4",
        "type": "WAN",
        "gateway": "gateway",
        "metric": 0,
        "mtu": 1500,
        "MAC": "MAC",
        "dhcp": "no",
        "routing": "OSPF",
        "IPv6Mask": "64",
        "isAssigned": true,
        "driver": "driver",
        "IPv4Mask": "24",
        "name": "name",
        "devId": "devId",
        "_id": "_id",
        "pathlabels": "path labels list"
      }
    ],
    "org": "org",
    "isConnected": true,
    "upgradeSchedule": {
      "jobQueued": true,
      "_id": "_id",
      "time": "2019-12-19T12:10:01.667Z"
    },
    "description": "description",
    "deviceStatus": "deviceStatus",
    "deviceToken": "deviceToken",
    "labels": [
      "labels",
      "labels"
    ],
    "machineId": "machineId",
    "site": "site",
    "hostname": "host01",
    "versions": {
      "agent": "agent",
      "router": "router",
      "device": "device",
      "vpp": "vpp",
      "frr": "frr"
    },
    "name": "name",
    "_id": "_id",
    "isApproved": true,
    "applications": [
      {
        "app": "app",
        "status": "status"
      }
    ],
    "staticroutes": [
      {
        "id": 1,
        "destination": "20.20.0.0",
        "gateway": "20.20.0.1",
        "interface": "eth0"
      },
      {
        "id": 2,
        "destination": "10.10.0.0",
        "gateway": "10.10.0.1",
        "interface": "eth1"
      }
    ],
    "deviceSpecificRulesEnabled": true,
    "firewallRules": [
      {
        "description": "description",
        "direction": "outbound",
        "enabled": true,
        "action": "allow"
      },
      {
        "description": "description",
        "direction": "inbound",
        "enabled": false,
        "action": "deny"
      }
    ],
    "fromToken": "fromToken",
    "account": "account",
    "ipList": "ipList",
    "dhcp": "dhcp list",
    "coords": [
      40.4,
      5.7
    ],
    "sync": "device sync status",
    "routingFilters": [
      "routingFilter"
    ]
  }
]
```
    - "name"はリンクとして、クリックするとdevice詳細画面に遷移するようにしてください。詳細画面で編集できるようにしてください。api/devices/{id}をPUTする動作をしてください。また削除ボタンを詳細画面で表示してください。削除ボタンをクリックすると/devices/{id}をDELETEする動作をしてください。
  - Tokens (トークン)
    - api/tokensからGETし取得できる以下の情報を表示してください。表示する際にトークン名には”name”及び"_id"を表示しますが開業して表示してください。"org"はIDで戻るためorganization nameを表示し、改行してorgのIDを表示してください。tokenは初期状態では省略してよいですが、展開ボタンにより全部表示してください。またコピーボタンを具備してください。
      - "_id", "org", "name", "token"
    - また、画面上部にトークン作成ボタン(api/tokensをPOSTする動作)及び検索フィールド・検索ボタンを具備してください
      - POSTするときは"name"が必要となります。

