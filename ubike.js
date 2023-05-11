const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('All');
const NTHU = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('NTHU');
function doGet(){
  var output = JSON.stringify(updateNTHU("GET"));
  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);
}
function initialInsert(){
  var data = queryData();
  for(var i=0;i<data.length;i++){
    var name=data[i]['name_tw'];
    if(name.indexOf('清華大學')!=-1 ||name.indexOf('十八尖山')!=-1){
      NTHU.appendRow([i,data[i]['name_tw'],data[i]['empty_spaces'],data[i]['available_spaces']]);
    }
    else{
      sheet.appendRow([data[i]['name_tw'],data[i]['empty_spaces'],data[i]['available_spaces']]);
    }
  }
}
function getIndex(){
  return NTHU.getRange(1,1,NTHU.getLastRow(),1).getValues();
}
function updateNTHU(method){
  var index = getIndex();
  clearAllData();
  var data =queryData();
  var newData=[];
  for(var i=0;i<index.length;i++){
    newData.push(data[index[i][0]])
    NTHU.appendRow([index[i][0],data[index[i][0]]['name_tw'],data[index[i][0]]['empty_spaces'],data[index[i][0]]['available_spaces']]);
  }
  if(method=="GET") return newData;
  else sendMessage();
}
function queryData() {
  clearAllData();
  const url =UrlFetchApp.fetch('https://apis.youbike.com.tw/json/station-yb2.json').getContentText();
  const $ = Cheerio.load(url);
  var data = JSON.parse($.text());
  return data;
}
function clearAllData(){
  sheet.getDataRange().clearContent();
  NTHU.getDataRange().clearContent();
}
function sendMessage(){
  var content='<table style="border: 1px sold gray; width: 350px; text-align: center" rules="all"><tr><td colspan="3">清華大學</td></tr><tr><td>地點</td><td>空位</td><td>可借</td></tr>';
  var data = NTHU.getDataRange().getValues();
  for(var i=0;i<data.length;i++){
    content+='<tr><td>'+data[i][1]+'</td><td>'+data[i][2]+'</td><td>'+data[i][3]+'</td></tr>';
  }
  content+='</table>';
  MailApp.sendEmail("your email","UBIKE NTHU即時資訊","",{
    noReply:true,
    htmlBody:content
  })
}
