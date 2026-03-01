const SHEET_NAME = "Orders";
const FOLDER_ID = "1mZlZFm4W8KDFvWyznYYLACGpVkthbAhW";
const ADMIN_PASSWORD = "1669";

function doGet(e) {
  let page = e.parameter.page || "shop";
  return HtmlService.createHtmlOutputFromFile(page);
}

/* ===== SAVE ORDER ===== */

function saveOrder(name,items,total,links,fileData,fileName){
  let orderId="ORD"+Math.floor(Math.random()*999999);

  let folder=DriveApp.getFolderById(FOLDER_ID);
  let blob=Utilities.newBlob(Utilities.base64Decode(fileData),"image/png",fileName);
  let file=folder.createFile(blob);

  SpreadsheetApp.getActiveSpreadsheet()
  .getSheetByName(SHEET_NAME)
  .appendRow([orderId,new Date(),name,items,total,"รออนุมัติ",links,file.getUrl()]);

  return orderId;
}

/* ===== CHECK ORDER ===== */

function checkOrder(id){
  let sheet=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  let data=sheet.getDataRange().getValues();
  for(let i=1;i<data.length;i++){
    if(data[i][0]==id){
      return {status:data[i][5],links:data[i][6]};
    }
  }
  return null;
}

/* ===== ADMIN ===== */

function getOrders(){
  return SpreadsheetApp.getActiveSpreadsheet()
  .getSheetByName(SHEET_NAME)
  .getDataRange().getValues();
}

function approve(row){
  SpreadsheetApp.getActiveSpreadsheet()
  .getSheetByName(SHEET_NAME)
  .getRange(row,6).setValue("อนุมัติแล้ว");
}
