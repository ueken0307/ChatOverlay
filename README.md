# ChatOverlay(**beta**)
----

## 概要
![](chatoverlay.gif)  
discordのチャットをニコニコ風に**オーバーレイ表示**するやつ

## 使用方法
1. [discordのMyApplicationsページ](https://discordapp.com/developers/applications/)に行く
1. `Create an application`をクリック
1. `NAME`を`ChatOverlay`にする（任意)
1. `BOT`に移動し、`Add Bot`を実行
1. `USERNAME`を`ChatOverlay`にする（任意)
1. `OAuth2`に移動し、`OAUTH2 URL GENERATOR`で`bot`と`Read Message History`にチェックを入れURLをコピーする
1. コピーしたURLにアクセスし、ボットを任意のサーバーに追加する
1. 再び`BOT`に移動し、`PUBLIC BOT`をオフにする（任意）
1. `COPY`をクリックし、tokenをコピーする
1. [Releaseページ](https://github.com/ueken0307/ChatOverlay/releases/)で該当するプラットフォームのものをダウンロードして解凍
1. `settings.json`ファイル内の`botToken`にコピーしたトークンを貼り付ける
1. `settings.json`ファイル内の`observeChannel`に監視したいチャンネル名を設定
1. `chatoverlay.exe`を実行

## 使用ライブラリ・フレームワーク
- [electron](https://electronjs.org/)
- [electron-packager](https://github.com/electron-userland/electron-packager)
- [discord.js](https://discord.js.org/#/)

## 設定
- `botToken` 使用するbotのtokenを指定する
- `observeChannel` 監視するチャンネル名を指定する
- `Color` 使用するHTMLカラーネームを指定する

```JSON
{
  "botToken":"abcdefghijklmnopqrstuvwxyz",
  "observeChannel":"general",
  "color":[
    "white",
    "black",
    "red",
    "blue",
    "green",
    "orange",
    "cyan",
    "brown",
    "yellow",
    "yellowgreen",
    "skyblue",
    "purple",
    "navy",
    "lime",
    "pink",
    "deeppink",
    "deepskyblue"
  ]
}

```
