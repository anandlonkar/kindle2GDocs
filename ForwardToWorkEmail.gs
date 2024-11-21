function checkForAmazonEmails() {
  // Define the target email address
  const targetEmail = "Amazon Kindle <do-not-reply@amazon.com>";
  
  // Define the recipient address for notifications
  const recipient = "<WORKEMAIL>";
  
  // Get all inbox threads
  // const inboxThreads = GmailApp.getInboxThreads();
  const inboxThreads =  GmailApp.search('is:unread');
  
  Logger.log(inboxThreads);

  // Loop through inbox threads
  for (const thread of inboxThreads) {
    const messages = thread.getMessages();
    
    // Check for unread messages
    for (const message of messages) {
      Logger.log(message.getFrom());
      if (message.isUnread() && message.getFrom() === targetEmail) {
        //Logger.log(message.getSubject());
        const subject = message.getSubject();
        //const body = "You have a new email from Amazon. Subject: " + subject;

      
        const body2 = message.getRawContent();
        var htmlstring = body2.split("Content-Type: text/html;")[1]

        var removeequals = htmlstring.replace(/=\r\n/g,'')
        var remove3D = removeequals.replace(/=3D/g,'=')

        var PdfUrl = extractPdfURL(remove3D);
        var TextUrl = extractTextURL(remove3D);
        if (PdfUrl) {
          const pdfresponse = UrlFetchApp.fetch(PdfUrl);
          const pdfBlob = pdfresponse.getBlob();

          const textresponse = UrlFetchApp.fetch(TextUrl);
          const textBlob = textresponse.getBlob();
          
          // Send notification email with the attachment
          GmailApp.sendEmail(recipient, "New Email from Amazon: " + subject, "You have a new email from Amazon. Subject: " + subject, {
            attachments: [pdfBlob,textBlob]
          });
          
          Logger.log("Email Sent");
        }

        // Mark the original email as read (optional)
        thread.markRead();
        break; // Exit loop after finding the first Amazon email
      }
    }
  }
}





function extractPdfURL(emailbody) {
  var removeequals = emailbody.replace(/=\n/g,'')
  var remove3D = removeequals.replace(/=3D/g,'=')
  //var htmlstring = remove3D.toLowerCase().split('searchable')

  var regex =  /<a[^>]*href="([^"]*)"[^>]*>Download Searchable PDF<\/a>/i;

  var match = remove3D.match(regex);

  var pdfUrl = match[1];
  Logger.log('PDF URL: ' + pdfUrl);

  // Decode the URL
  pdfUrl = decodeURIComponent(pdfUrl.split('&U=')[1].split('&')[0]);

  return pdfUrl;
}


function extractTextURL(emailbody) {
  var removeequals = emailbody.replace(/=\n/g,'')
  var remove3D = removeequals.replace(/=3D/g,'=')
  //var htmlstring = remove3D.toLowerCase().split('searchable')

  var regex =  /<a[^>]*href="([^"]*)"[^>]*>Download text file<\/a>/i;

  var match = remove3D.match(regex);

  var textUrl = match[1];
  Logger.log('Text URL: ' + textUrl);

  // Decode the URL
  textUrl = decodeURIComponent(textUrl.split('&U=')[1].split('&')[0]);

  return textUrl;
}

