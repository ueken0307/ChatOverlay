'use strict';

//electron
var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;
var Tray = electron.Tray;
//discord.js
var Discord = require('discord.js');
//File System
var fs = require('fs');

var mainWindow = null;
var client = null;
var tray = null;

var observeChannel;
var token;

app.on('window-all-closed', ()=>{
  if (process.platform != 'darwin'){
    app.quit();
  }
});

app.on('ready',()=>{
  //透過,フレームレス,サイズ変更不可,非表示,タスクバーに表示しない
  mainWindow = new BrowserWindow(
    {
      transparent: true, frame: false, resizable:false,show: false,skipTaskbar:true
    }
  );
  
  //画面最大化
  mainWindow.maximize();
  //常に最前面
  mainWindow.setAlwaysOnTop(true);

  mainWindow.loadURL('file://' + __dirname + '/index.html');
  
  //全てのディスプレイ情報取得
  let displays = electron.screen.getAllDisplays();
  //ディスプレイ情報からメニュー用アイテム作成
  let submenuDisplay=[];
  for(let i=0;i<displays.length;i++){
    submenuDisplay.push({label:('サイズ:'+ displays[i].bounds.width +','+ displays[i].bounds.height +
    ' 位置:'+ displays[i].bounds.x +','+ displays[i].bounds.y),type:'radio',
    click () {console.log(i);}});
  }
  //トレイに格納
  tray = new Tray('./icon.ico');
  let contextMenu = Menu.buildFromTemplate([
    {label:'表示ディスプレイ',submenu:submenuDisplay},
    {label:'終了',role:'quit'}
  ]);
  tray.setContextMenu(contextMenu);
  
  mainWindow.on('closed',()=>{
    mainWindow = null;
  });
  
  //設定ファイル読み込み
  let settings = JSON.parse(fs.readFileSync('./settings.json','utf8'));
  try{
    if(settings.botToken.length == 0){
      throw "Can't read botToken";
    }
    if(settings.observeChannel.length == 0){
      throw "Can't read observeChannel";
    }
    
    token = settings.botToken;
    observeChannel = settings.observeChannel;
    
  }catch(e){
    console.log(e);
    app.exit();
  }
  
  //読み込み終了時に色設定を設定させる
  mainWindow.once('ready-to-show',()=>{
    mainWindow.webContents.send('setting',settings.color);
    //ウィンドウの表示
    mainWindow.show();
    //マウス入力なし
    mainWindow.setIgnoreMouseEvents(true);
  });
  
  //discordクライアントの作成
  client = new Discord.Client();
  
  //メッセージ受信処理
  client.on('message', message => {
    if(message.channel.name === observeChannel){
      console.log(message.author.username + ':' + message.content);
      mainWindow.webContents.send('recieve-message',message);
    }
  });

  //ログイン
  client.login(token);
});

//'#'+(parseInt(message.author.id, 10)%16581375).toString(16)
