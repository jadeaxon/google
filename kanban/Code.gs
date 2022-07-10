function compactColumns() {
  // Personal Kanban
  var spreadsheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1zXpRv6WFdb9eX9YDerTTCE7L3N6InYxJ-FYec9ok79I/edit');
  var sheet = spreadsheet.getSheetByName('Backlog');
  var data = sheet.getDataRange().getValues();
 
  for (var ci = 0; ci < sheet.getMaxColumns(); ci++) {
    // Compact values in this column.  Remove all blanks.  Preserve order.
    for (var ri = 1; ri < data.length; ri++) {
      var value = data[ri][ci];
      if (value == '') {
        Logger.log('Blank: ' + (ri + 1));
        for (var ri2 = ri + 1; ri2 < data.length; ri2++) {
          var value2 = data[ri2][ci];
          if (value2 != '') {
            Logger.log('Value: ' + (ri2 + 1));
            var blankCell = sheet.getRange(ri + 1, ci + 1);
            var valueCell = sheet.getRange(ri2 + 1, ci + 1);
            blankCell.setValue(value2);
            valueCell.clearContent();
            // Changing the cells does not change the initial data array we fetched.
            // Changing the data array does not change the cells (they are not bound).
            data[ri][ci] = value2;
            data[ri2][ci] = '';
            break;
          }
        } // next potentially non-blank value
      } // value is blank
      
    } // next potentially blank value
  } // next column
} // compactColumns()

function moveToDone() {
  function replacer(match, p1, p2, offset, string) {
    var episode = Number(p2) + 1;
    return "\ns" + p1 + "e" + episode;
  }

  // Personal Kanban
  var spreadsheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1zXpRv6WFdb9eX9YDerTTCE7L3N6InYxJ-FYec9ok79I/edit');
  var sheet = spreadsheet.getSheetByName('Kanban');
  var data = sheet.getDataRange().getValues();

  var currentCell = SpreadsheetApp.getActiveSheet().getActiveCell();
  var currentValue = currentCell.getValue();
  var doneColumn = 4; // Base 0.

  // Scan each row of Done column for a blank.
  // Copy to first blank cell then stop.
  for (var ri = 1; ri < data.length; ri++) {
    var v = data[ri][doneColumn];
    Logger.log(v);
    if (v == '') {
      // I guess the data array is base 0 while the cell numbering is base 1.
      var blankCell = sheet.getRange(ri + 1, doneColumn + 1);
      blankCell.setValue(currentValue);
      if (currentCell.getColumn() != 1) {
        currentCell.setValue('');
      }
      else { // We are in the first column (progressive tasks).
        // Shows are tracked with s1e1 for season 1, episode 1.  Bump the episode.
        if (currentValue.match(/\ns\d+e\d+/m)) {
          currentValue = currentValue.replace(/\ns(\d+)e(\d+)/m, replacer);
          currentCell.setValue(currentValue);
        }
      }
      break;
    }
  } // next row of Done column
} // moveToDone()

