const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('All');
const NTHU = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('NTHU');
const INDEX = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('index');
function doGet(){
  var data =NTHU.getDataRange().getValues();
  var output = JSON.stringify(data);
  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);
}
// initial
function queryData() {
  clearAllData();
  const url =UrlFetchApp.fetch('https://apis.youbike.com.tw/json/station-yb2.json').getContentText();
  const $ = Cheerio.load(url);
  var data = JSON.parse($.text());
  return data;
}
function initialInsert(){
  var data = queryData();
  for(var i=1000;i<1300;i++){
    var name=data[i]['name_tw'];
    if(name.indexOf('清華大學')!=-1 ||name.indexOf('十八尖山')!=-1){
      NTHU.appendRow([i,data[i]['name_tw'],data[i]['empty_spaces'],data[i]['available_spaces']]);
      INDEX.appendRow([i]);
    }
    else{
      sheet.appendRow([data[i]['name_tw'],data[i]['empty_spaces'],data[i]['available_spaces']]);
    }
  }
}

// update
function updateData(){
  const url =UrlFetchApp.fetch('https://apis.youbike.com.tw/json/station-yb2.json').getContentText();
  const $ = Cheerio.load(url);
  var data = JSON.parse($.text());
  return data;
}
function getIndex(){
  return INDEX.getRange(1,1,NTHU.getLastRow(),1).getValues();
}
function updateNTHU(){
  try{
    var index = getIndex();
    clearData();
    var data =updateData();
    var newData=[];
    for(var i=0;i<index.length;i++){
      newData.push(data[index[i][0]])
      NTHU.appendRow([index[i][0],data[index[i][0]]['name_tw'],data[index[i][0]]['empty_spaces'],data[index[i][0]]['available_spaces']]);
    }
  }catch(e){
    initialInsert();
  }
}


// clear
function clearData(){
  NTHU.getDataRange().clearContent();
}
function clearPartialData(){
  sheet.getDataRange().clearContent();
  NTHU.getDataRange().clearContent();
}
function clearAllData(){
  sheet.getDataRange().clearContent();
  NTHU.getDataRange().clearContent();
  INDEX.getDataRange().clearContent();
}

// send
function sendMessage(){
  var content='<table style="border: 1px sold gray; width: 350px; text-align: center" rules="all"><tr><td colspan="3">清華大學</td></tr><tr><td>地點</td><td>空位</td><td>可借</td></tr>';
  var data = NTHU.getDataRange().getValues();
  for(var i=0;i<data.length;i++){
    content+='<tr><td>'+data[i][1]+'</td><td>'+data[i][2]+'</td><td>'+data[i][3]+'</td></tr>';
  }
  content+='</table>';
  MailApp.sendEmail("","UBIKE NTHU即時資訊","",{
    noReply:true,
    htmlBody:content
  })
}
