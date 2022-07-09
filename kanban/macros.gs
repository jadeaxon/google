function SortbyScoreDESC() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getRange('J:J').activate();
  spreadsheet.getActiveSheet().sort(10, false);
};


function MovetoDoneMacro() {
  var spreadsheet = SpreadsheetApp.getActive();
  moveToDone();
};

