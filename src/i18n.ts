
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            // Common
            "Home": "Home",
            "Inventory": "Inventory",
            "Devices": "Devices",
            "Members": "Members(Users)",
            "Account": "Account",
            "Settings": "Settings",
            "Logout": "Logout",
            "Cancel": "Cancel",
            "Save Changes": "Save Changes",
            "Filter": "Filter",
            "Search": "Search",
            "Details": "Details",
            "Online": "ONLINE",
            "Offline": "OFFLINE",
            "Dashboard": "Dashboard",
            "Search users...": "Search users...",
            "Search accounts...": "Search accounts...",
            "Search devices...": "Search devices...",
            "Loading...": "Loading...",
            "Example": "Example",
            "Status": "Status",
            "Interface": "Interface",
            "IPv4 Address": "IPv4 Address",
            "Public IP": "Public IP",
            "MAC Address": "MAC Address",
            "Delete Device": "Delete Device",

            // Login
            "Login": "Login",
            "Username (Email)": "Username (Email Address)",
            "Password": "Password",
            "Login Success": "Login successful!",
            "Logging in...": "Logging in...",
            "Login Failed": "Login failed. Please check your credentials.",
            "Don't have an account?": "Don't have an account?",
            "Create Account Here": "Create Account Here",

            // Home / Dashboard
            "System Overview": "System Overview",
            "Running Devices": "Running Devices",
            "Not Running": "Not Running",
            "Connected Devices": "Connected Devices",
            "Not Connected": "Not Connected",
            "Not Approved": "Not Approved",
            "Warnings": "Warnings",
            "Fetch Failed": "Failed to fetch information",

            // Members
            "Create Member": "Create Member",
            "Edit Member": "Edit Member",
            "Member Description": "Manage organization members and their access levels.",

            // Accounts
            "Create Account": "Create Account",
            "Account Description": "Manage organization accounts and global settings.",

            // Devices
            "Create Dummy Device": "Create Dummy Device",
            "Device Description": "Manage your FlexiEdge devices and inventory.",
            "Dummy Device Test": "Dummy Device Registration Test",
            "About this page": "About this page",
            "Dummy device info": "You can register a dummy Edge device for development/testing to fleximanage via WebSocket. It mimics the actual flexiAgent behavior.",
            "Connection Status": "Connection Status",
            "Connected": "Connected",
            "Disconnected": "Disconnected",
            "Registered": "Registered",
            "Approved": "Approved",
            "Org Token Help": "Enter the Organization Token generated in fleximanage",
            "Device Info": "Device Information",
            "Hostname": "Hostname",
            "Machine ID Help": "Automatically generated UUID (changeable)",
            "Version": "Version",
            "Network Interfaces": "Network Interfaces",
            "Delete": "Delete",
            "Interface Name": "Interface Name",
            "Type": "Type",
            "IP Address": "IP Address",
            "Add Interface": "Add Interface",
            "Connect & Register": "Connect & Register",
            "Send Heartbeat": "Send Heartbeat",
            "Disconnect": "Disconnect",
            "Comm Log": "Communication Log",
            "Clear": "Clear",
            "No logs": "No logs",

            // Device Detail
            "Device Overview": "Device Overview",
            "Model/Type": "Model/Type",
            "Site": "Site",
            "Approval Status": "Approval Status",
            "Pending Approval": "Pending Approval",
            "Sync Status": "Sync Status",
            "Synced": "Synced",
            "Software Versions": "Software Versions",
            "Agent Version": "Agent Version",
            "Router Version": "Router Version",
            "Device Version": "Device Version",
            "VPP Version": "VPP Version",
            "Notification Rules": "Notification Rules",
            "Organizations": "Organizations",

            // Detail Pages
            "System Information": "System Information",
            "Basic Information": "Basic Information",
            "Access & Permissions": "Access & Permissions",
            "General Information": "General Information",
            "Security & Access": "Security & Access",

            // Register Account
            "Create Account Header": "Create Account",
            "Account registration info": "Usually, one account is created per company. You can add each customer as an organization later.",
            "Account Name": "Account Name",
            "Company or Org Name": "Company or Organization Name",
            "First Name": "First Name",
            "Last Name": "Last Name",
            "First Name Placeholder": "John",
            "Last Name Placeholder": "Doe",
            "Email": "Email Address",
            "Job Title": "Job Title",
            "Job Title Placeholder": "e.g. Network Admin",
            "Password Placeholder": "Enter password",
            "Creating...": "Creating...",
            "Important Notes": "Important Notes",
            "Success Registration": "Account created successfully! Please check your email for verification.",
            "Verify Account Button": "Click 'Verify Account' in the mail to activate.",
            "Already have an account?": "Already have an account?",
            "Login Here": "Login Here",
            "Need to activate your account?": "Need to activate your account?",
            "Activation Manual Info": "If you cannot activate by email, you can verify here:",
            "Verify Account Link": "Verify Account",
            "Delete Account": "Delete Account",
            "Delete Member": "Delete Member",
            "Delete Confirmation Title": "Are you sure?",
            "Delete Account Confirmation": "This will permanently delete the account and all associated data. This action cannot be undone.",
            "Delete Member Confirmation": "This will permanently remove the member from the organization. This action cannot be undone.",
            "Deleting...": "Deleting...",

            // Verify Account
            "Verify Account": "Verify Account",
            "ID": "ID",
            "Token": "Token",
            "Verify": "Verify",
            "Verification Success": "Account verified successfully! You can now login.",

            // Tokens
            "Tokens": "Tokens",
            "Create Token": "Create Token",
            "Token Name": "Token Name",
            "Created At": "Created At",
            "Action": "Action",
            "Copy": "Copy",
            "Token Description": "Registration tokens are used to register FlexiEdge devices to flexiManage.",
            "Delete Token": "Delete Token",
            "Delete Token Confirmation": "Are you sure you want to delete this token? This will prevent new devices from registering with it."
        }
    },
    ja: {
        translation: {
            // Common
            "Home": "ホーム",
            "Inventory": "インベントリ",
            "Devices": "デバイス",
            "Members": "メンバー(ユーザー)",
            "Account": "アカウント",
            "Settings": "設定",
            "Logout": "ログアウト",
            "Cancel": "キャンセル",
            "Save Changes": "変更を保存",
            "Filter": "フィルター",
            "Search": "検索",
            "Details": "詳細",
            "Online": "オンライン",
            "Offline": "オフライン",
            "Dashboard": "ダッシュボード",
            "Search users...": "ユーザーを検索...",
            "Search accounts...": "アカウントを検索...",
            "Search devices...": "デバイスを検索...",
            "Loading...": "読み込み中...",
            "Example": "例",
            "Status": "ステータス",
            "Interface": "インターフェース",
            "IPv4 Address": "IPv4アドレス",
            "Public IP": "パブリックIP",
            "MAC Address": "MACアドレス",
            "Delete Device": "デバイスを削除",

            // Login
            "Login": "ログイン",
            "Username (Email)": "ユーザー名（メールアドレス）",
            "Password": "パスワード",
            "Login Success": "ログインに成功しました！",
            "Logging in...": "ログイン中...",
            "Login Failed": "ログインに失敗しました。認証情報を確認してください。",
            "Don't have an account?": "アカウントをお持ちでない場合",
            "Create Account Here": "アカウントを作成する",

            // Home / Dashboard
            "System Overview": "システム概要",
            "Running Devices": "稼働中のデバイス",
            "Not Running": "停止中",
            "Connected Devices": "接続中のデバイス",
            "Not Connected": "未接続",
            "Not Approved": "未承認",
            "Warnings": "警告",
            "Fetch Failed": "情報の取得に失敗しました",

            // Members
            "Create Member": "メンバー作成",
            "Edit Member": "メンバー編集",
            "Member Description": "組織メンバーとアクセスレベルを管理します。",

            // Accounts
            "Create Account": "アカウント作成",
            "Account Description": "組織アカウントとグローバル設定を管理します。",

            // Devices
            "Create Dummy Device": "ダミーデバイス作成",
            "Device Description": "FlexiEdgeデバイスとインベントリを管理します。",
            "Dummy Device Test": "ダミーデバイス登録テスト",
            "About this page": "このページについて",
            "Dummy device info": "開発・テスト用のダミーEdgeデバイスをWebSocket経由でfleximanageに登録できます。実際のflexiAgentの動作を模倣しています。",
            "Connection Status": "接続状態",
            "Connected": "接続済み",
            "Disconnected": "未接続",
            "Registered": "登録済み",
            "Approved": "承認済み",
            "Org Token Help": "fleximanageで生成したOrganization Tokenを入力してください",
            "Device Info": "デバイス情報",
            "Hostname": "ホスト名",
            "Machine ID Help": "自動生成されたUUID（変更可能）",
            "Version": "バージョン",
            "Network Interfaces": "ネットワークインターフェース",
            "Delete": "削除",
            "Interface Name": "インターフェース名",
            "Type": "タイプ",
            "IP Address": "IPアドレス",
            "Add Interface": "インターフェースを追加",
            "Connect & Register": "接続 & 登録",
            "Send Heartbeat": "ハートビート送信",
            "Disconnect": "切断",
            "Comm Log": "通信ログ",
            "Clear": "クリア",
            "No logs": "ログなし",

            // Device Detail
            "Device Overview": "デバイス概要",
            "Model/Type": "モデル/タイプ",
            "Site": "サイト",
            "Approval Status": "承認状況",
            "Pending Approval": "承認待ち",
            "Sync Status": "同期ステータス",
            "Synced": "同期済み",
            "Software Versions": "ソフトウェアバージョン",
            "Agent Version": "Agentバージョン",
            "Router Version": "Routerバージョン",
            "Device Version": "Deviceバージョン",
            "VPP Version": "VPPバージョン",
            "Notification Rules": "通知ルール",
            "Organizations": "組織",

            // Detail Pages
            "System Information": "システム情報",
            "Basic Information": "基本情報",
            "Access & Permissions": "アクセス権限",
            "General Information": "一般情報",
            "Security & Access": "セキュリティとアクセス",

            // Register Account
            "Create Account Header": "アカウント作成",
            "Account registration info": "通常、1つの会社につき1つのアカウントを作成します。顧客にサービスを提供する場合は、各顧客を組織として追加できます。",
            "Account Name": "アカウント名",
            "Company or Org Name": "会社名または組織名",
            "First Name": "名（First Name）",
            "Last Name": "姓（Last Name）",
            "First Name Placeholder": "太郎",
            "Last Name Placeholder": "山田",
            "Email": "メールアドレス",
            "Job Title": "役職",
            "Job Title Placeholder": "例: ネットワーク管理者",
            "Password Placeholder": "パスワードを入力",
            "Creating...": "作成中...",
            "Important Notes": "重要な注意事項",
            "Success Registration": "アカウントが作成されました！登録したメールアドレスに確認メールが送信されました。",
            "Verify Account Button": "メール内の「Verify Account」ボタンをクリックしてアカウントを有効化してください。",
            "Already have an account?": "既にアカウントをお持ちの場合",
            "Login Here": "ログイン画面へ",
            "Need to activate your account?": "アカウントの有効化が必要な場合",
            "Activation Manual Info": "メールから有効化できない場合は、こちらから有効化してください：",
            "Verify Account Link": "アカウント有効化画面へ",
            "Delete Account": "アカウント削除",
            "Delete Member": "メンバー削除",
            "Delete Confirmation Title": "本当に削除しますか？",
            "Delete Account Confirmation": "このアカウントと関連するすべてのデータが永久に削除されます。この操作は取り消せません。",
            "Delete Member Confirmation": "このメンバーは組織から永久に削除されます。この操作は取り消せません。",
            "Deleting...": "削除中...",

            // Verify Account
            "Verify Account": "アカウント有効化",
            "ID": "ID",
            "Token": "トークン",
            "Verify": "有効化する",
            "Verification Success": "アカウントの有効化に成功しました！ログインしてください。",

            // Tokens
            "Tokens": "トークン",
            "Create Token": "トークン作成",
            "Token Name": "トークン名",
            "Created At": "作成日",
            "Action": "操作",
            "Copy": "コピー",
            "Token Description": "登録トークンは、FlexiEdgeデバイスをflexiManageに登録するために使用されます。",
            "Delete Token": "トークン削除",
            "Delete Token Confirmation": "このトークンを削除してもよろしいですか？これにより、このトークンを使用した新しいデバイスの登録ができなくなります。"
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
