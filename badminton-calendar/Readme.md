# 羽球場地預約系統

給球友群組用的簡易預約行事曆:新增/刪除時段,資料存在 Google Sheet,前端放 GitHub Pages,只有知道密碼的人可以使用。

## 架構

```
GitHub Pages (index.html)  →  Google Apps Script Web App  →  Google Sheet
        前端                        後端 + 密碼驗證              資料庫
```

前端是純靜態頁面,所以完全不會有任何金鑰或密碼寫死在程式碼裡外流——密碼驗證邏輯全部在 Apps Script(伺服器端)進行,前端只是把使用者輸入的密碼當作 token 傳過去比對。

## 部署步驟

### 1. 建立 Google Sheet

1. 到 [Google Sheets](https://sheets.google.com) 新增一個空白試算表,取名例如「羽球預約」。
2. 不用手動建欄位,第一次呼叫時 `Code.gs` 會自動建立 `Bookings` 分頁與欄位。

### 2. 設定 Apps Script

1. 在該試算表點選 **擴充功能 → Apps Script**。
2. 把 `Code.gs` 的內容整個貼進去(取代預設的 `myFunction`)。
3. 把 `setPassword()` 函式裡的 `'請改成你們的密碼'` 改成你們要用的通關密碼。
4. 在編輯器上方選取函式下拉選單,選擇 `setPassword`,按執行(▶),**只需要執行這一次**,用來把密碼存進 Script Properties。
   - 第一次執行會要求授權,按「允許」即可。
5. 點右上角 **部署 → 新增部署作業**:
   - 類型選「網頁應用程式」
   - 執行身分:**我 (你的帳號)**
   - 誰可以存取:**任何人**(這裡選「任何人」是因為要讓前端能呼叫 API,實際的存取控制是靠密碼,不是靠這個選項)
6. 部署後會得到一個網址,長得像:
   `https://script.google.com/macros/s/AKfycb.../exec`
   這個就是你的 API URL。

> 之後如果修改了 `Code.gs`,記得要「管理部署作業 → 編輯 → 新版本」重新部署,網址才會套用新程式碼。

### 3. 設定前端

打開 `index.html`,找到這一行:

```js
const API_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
```

換成你剛剛拿到的網址。

### 4. 放上 GitHub Pages

1. 把 `index.html` 放進你的 GitHub repo。
2. Repo 設定裡開啟 GitHub Pages,指到放 `index.html` 的分支/資料夾。
3. 之後大家打開這個網址,輸入密碼就能用了。

## 使用方式

- 打開網站 → 輸入密碼 → 看到「新增預約」表單與「已預約時段」列表。
- 新增時段時,系統會自動檢查同一天、同一場地是否有時間重疊,重疊會擋掉不給新增。
- 每筆時段都可以直接按刪除。
- 密碼會記在瀏覽器 `localStorage`,同一台裝置/瀏覽器下次不用重新輸入。

## 之後可以再加的功能(先不做,列給你參考)

- 每個人自己的名字綁一個小 token,刪除時只能刪自己約的(目前設計是任何知道密碼的人都能刪任何時段,適合熟人群組)。
- 用 Google 帳號登入(OAuth)+ email 白名單,取代共用密碼,可以看出是誰操作的。
- LINE Bot 整合,約好之後自動推播提醒。
