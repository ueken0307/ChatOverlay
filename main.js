'use strict';

//electron
var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
//discord.js
var Discord = require('discord.js');
//File System
var fs = require('fs');

var mainWindow = null;
var client = null;

var observeChannel;
var token;

app.on('window-all-closed', ()=>{
  if (process.platform != 'darwin'){
    app.quit();
  }
});

app.on('ready',()=>{
  //透過,フレームレス,サイズ変更不可,非表示
  mainWindow = new BrowserWindow(
    {
      transparent: true, frame: false, resizable:false,show: false
    }
  );
  
  //マウス入力なし
  mainWindow.setIgnoreMouseEvents(true);
  //画面最大化
  mainWindow.maximize();
  //常に最前面
  mainWindow.setAlwaysOnTop(true);

  mainWindow.loadURL('file://' + __dirname + '/index.html');

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
