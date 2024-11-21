function saveGmailAttachmentsToDrive() {
  // Settings
  var senderEmail = '<YouPersonalid@gmail.com>'; // Replace with the sender's email address
  var folderId = '<>'; // Replace with your Google Drive folder ID
  var sheetId = '<>'; // Replace with your Google Sheet ID
  var sheetName = 'Action Items List from Notes'; // Replace with your desired sheet name

  const inboxThreads = GmailApp.search('is:unread subject:"New Email from Amazon" From:' + senderEmail);

  for(const thread of inboxThreads) {
      const messages = thread.getMessages();

      //check for unread messages
      for (const message of messages){
        Logger.log(message.getFrom())
        var attachments = message.getAttachments();

        // Iterate through attachments
        for (var k = 0; k < attachments.length; k ++) {
          var attachment = attachments[k];
          var originalName = attachment.getName();
          if(originalName.includes(".pdf")){
             var newName =  originalName.replace(/%20/g, ' ').replace(/-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}\.pdf$/, '.pdf');
          } else if (originalName.includes(".txt")){
              var newName =  originalName.replace(/%20/g, ' ').replace(/-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}\.txt$/, '.txt');
              var textcontents = attachment.getDataAsString();
              /*
              var actionDetails = extractActionDetails(textcontents);
              if (actionDetails) {
                Logger.log('Action Item: ' + actionDetails.actionItem);
                Logger.log('Assigned Person: ' + actionDetails.assignedPerson);
              } else {
                Logger.log('No action line found.');
              }
              */

              var actionDetailsList = extractAllActionDetails(textcontents);
              actionDetailsList.forEach(function(details) {
                Logger.log('Action Item: ' + details.actionItem);
                Logger.log('Assigned Person: ' + details.assignedPerson);
              });
              addTasksToGoogleSheet(sheetId, sheetName, actionDetailsList,newName);
          }
         
          try {
            // Save attachment to Google Drive
            //DriveApp.getFolderById(folderId).createFile(attachment).setName(newName);
            writefile(newName,attachment,folderId)
          } catch (e) {
            Logger.log('Error saving attachment: ' + e.message);
          }
        }
      }
      thread.markRead();
  }
}

function writefile(filename, fileblob, folderId) {
  var Iterator = DriveApp.getFilesByName(filename)
  
  if (Iterator.hasNext()) {
    var file = Iterator.next();
    if(filename.includes(".pdf")){
        //file.setContent(fileblob);
         Drive.Files.update({
          title: file.getName(), mimeType: file.getMimeType()
        }, file.getId(), fileblob);
    } else if (filename.includes(".txt"))
    {
      file.setContent(fileblob.getDataAsString());
    }    
  }
  else{
    DriveApp.getFolderById(folderId).createFile(fileblob).setName(filename);
  }

}


function extractActionDetails(text) {
  var regex = /^.*Action.*?[\|\/]\s*(.*)$/gm;
    var match = text.match(regex);
    if (match) {
      var actionLine = match[0];
      var parts = actionLine.split(/[\|\/]/);
      var actionItem = parts[0].trim();
      var assignedPerson = parts[1].trim();
      return { actionItem: actionItem, assignedPerson: assignedPerson };
    }
    return null;
}

function extractAllActionDetails(text) {
  var regex = /^.*Action.*?[\|\/]\s*(.*)\n$/gm;
  var matches;
  var actionDetailsList = [];

  while ((matches = regex.exec(text)) !== null) {
    var actionLine = matches[0];
    var parts = actionLine.split(/[\|\/]/);
    var actionItem = parts[0].trim();
    var assignedPerson = parts[1].trim();
    actionDetailsList.push({ actionItem: actionItem, assignedPerson: assignedPerson });
  }

  return actionDetailsList;
}

//Add action items to sheet
function addTasksToGoogleSheet(sheetId, sheetName, actionDetailsList,filename) {
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  if (!sheet) {
    sheet = SpreadsheetApp.openById(sheetId).insertSheet(sheetName);
  }

  // Add headers if the sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Action Item', 'Assigned Person','Filename']);
  }

  var lastRow = sheet.getLastRow();
  var existingTasks = [];
  if (lastRow > 1) {
    existingTasks = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  }

  //var existingTasks = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  var existingTasksSet = new Set(existingTasks.map(row => row[0] + '|' + row[1]));

  actionDetailsList.forEach(function(details) {
    var taskKey = details.actionItem + '|' + details.assignedPerson + '|' + filename;
    if (!existingTasksSet.has(taskKey)) {
      sheet.appendRow([details.actionItem, details.assignedPerson,filename]);
    }
  });
}