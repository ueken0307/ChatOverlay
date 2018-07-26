var ipcRenderer = require('electron').ipcRenderer;
var colors;

window.onload = ()=>{
  setInterval(()=>{
    let root = document.getElementById('root');
    let messages = document.getElementsByClassName('Message');
    let del =[];
    for(let i=0;i<messages.length;++i){
      let rect =messages[i].getBoundingClientRect();
      if(rect.left + rect.width < 0){
        del.push(i);
      }
      messages[i].style.left = (rect.left - 2)+'px';
    }

    for(let i=del.length;i>0;--i){
      root.removeChild(messages[del[i-1]]);
    }

  }, 1);
}

ipcRenderer.on('setting',(event,color)=>{
  colors = '(';
  for(let i=0;i<color.length;++i){
    colors += color[i] + '|';
  }
});

ipcRenderer.on('recieve-message',(event,message)=>{
  let root = document.getElementById('root');

  let messages = document.getElementsByClassName('Message');
  if(messages.length>=10){
    root.removeChild(messages[0]);
  }

  let div = document.createElement('div');
  div.className = 'Message';
  let textContent = '';

  //色指定の読み取り
  let regColor = new RegExp(colors + '#[0-9a-fA-F]{3}|#[0-9a-fA-F]{6})( |　)((.|\n)*)');
  if(regColor.test(message.content)){
    let match = message.content.match(regColor);
    div.style.color = match[1];
    textContent = match[3];
  }else{
    //デフォルトの文字色→白
    div.style.color = '#FFFFFF';
    textContent = message.content;
  }

  //カスタム絵文字の読み取り
  let outText ='';
  let regEmoji = new RegExp('<:.*:([0-9]+)>');
  while(textContent.indexOf("<:")>=0 && textContent.indexOf(">",textContent.indexOf("<:"))>=0){
    let start = textContent.indexOf("<:");
    let end = textContent.indexOf(">",textContent.indexOf("<:"));
    let match =  textContent.substring(start,end+1).match(regEmoji);
    
    //カスタム絵文字前のテキストspan
    outText += '<span>' + textContent.substring(0,start) + '</span>';
    //カスタム絵文字のURLを錬成してimg
    outText += '<img src ="' + 'https://cdn.discordapp.com/emojis/' + match[1] + '.png' + '">';
    //カスタム絵文字後の文字列をtextContentに上書き
    textContent = textContent.substring(end+1,textContent.length);
  }
  //最後の余り文字列
  outText += '<span>' + textContent + '</span>';

  div.innerHTML = outText;

  if(outText.indexOf("\n")!==-1 || outText.indexOf("\r")!==-1){
    //改行があるときは一番上に持ってくるようにする
    div.style.top = '0px';
  }else{
    //~~ランダム~~で高さ決める
    div.style.top = Math.floor( Math.random() * (window.parent.screen.height - 200) )+'px';
  }

  //画面右端から
  div.style.left = window.parent.screen.width+'px';
  //scriptタグ
  if(outText.indexOf("script")==-1){
    root.appendChild(div);
  }
});
