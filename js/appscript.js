const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('All');
const NTHU = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('NTHU');
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
    }
    else{
      //sheet.appendRow([data[i]['name_tw'],data[i]['empty_spaces'],data[i]['available_spaces']]);
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
function updateNTHU(){
  try{
    clearData();
    var data =updateData();
    initialInsert();
  }catch(e){
    initialInsert();
  }
}
// clear
function clearData(){
  NTHU.getDataRange().clearContent();
}
function clearAllData(){
  sheet.getDataRange().clearContent();
  NTHU.getDataRange().clearContent();
}

// send
function sendMessage(){
  var content='<table style="border: 1px sold gray; width: 350px; text-align: center" rules="all"><tr><td colspan="3">清華大學</td></tr><tr><td colspan="3">'+new Date()+'</td></tr><tr><td>地點</td><td>空位</td><td>可借</td></tr>';
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
function sendToUBIKE(){
  var flag=0;
  var content='<table style="border: 1px sold gray; width: 350px; text-align: center" rules="all"><tr><td colspan="3">清華大學</td></tr><tr><td colspan="3">'+new Date()+'</td></tr><tr><td>地點</td><td>空位</td><td>可借</td></tr>';
  var data = NTHU.getDataRange().getValues();
  for(var i=0;i<data.length;i++){
    content+='<tr><td>'+data[i][1]+'</td><td>'+data[i][2]+'</td><td>'+data[i][3]+'</td></tr>';
    if(data[i][3]==0) flag++;
  }
  content+='</table>';
  if(flag){
    MailApp.sendEmail("service-hccg@youbike.com.tw","UBIKE NTHU 請即時補充車輛(狀態如下)","",{
        noReply:true,
        htmlBody:content
    })
  }
}
