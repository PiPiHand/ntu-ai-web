# react-web-app-with-openai

# [https://bit.ly/ntu-ai-web-4](https://bit.ly/ntu-ai-web-4)

安裝所需套件

```
npm i
```

啟動開發伺服器

```
npm run dev
```

## 環境變數範例

.env

```
OPENAI_API_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
```

## 安裝 Git

1. 至 [Git 官方網站](https://www.git-scm.com/) 下載並且安裝 Git
2. 設定使用者名稱與 Email

```
git config --global user.name "你的使用者名稱"
git config --global user.email 你的EMAIL
```

## 更新至 Github

```
git add .
git commit -m "這次所執行的變更"
git push origin main
```

## 第一次推送的Ｇ ithub

git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/PiPiHand/ntu-ai-web.git
git push -u origin main

## 檢視目前所在非之相關資訊

git status

## 切換分支

git checkout

## 切換到 main 分支

git ch3ckout main

## 切換到 feature/add-firebase 分支 e.g. git checkout feature/add-tts-widget-ui

git checkout feature/add-firebase

## 想要新增分支 e.g. git checkout -b feature/add-tts-widget-ui。＊分支名稱不能有空格

git checkout -b

## 列出所有分支

git branch a

## 當工作成果完成後把分支推到 github

git push origin HEAD (HEAD 代表目前的 feature branch
