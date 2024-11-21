# kindle2GDocs

Getting notes written on Kindle Scribe to Google Drive and forwarding them to your work Gmail.

## Prerequisites

- A Google account
- Access to Google Drive and Google Sheets
- Kindle Scribe device

## Setup Instructions

### Step 1: Open Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/).
2. Click on the `New project` button.

### Step 2: Create and Paste the Scripts

#### Personal Account (Kindle Scribe)

1. In your personal Google account, create a new Google Apps Script project.
2. Create a script file named `ForwardToWorkEmail.gs`.
3. Copy the contents of `ForwardToWorkEmail.gs` from this repository and paste it into the script file.

#### Work Account

1. In your work Google account, create a new Google Apps Script project.
2. Create a script file named `SaveToGDrive.gs`.
3. Copy the contents of `SaveToGDrive.gs` from this repository and paste it into the script file.

### Step 3: Update the Scripts

#### Personal Account (Kindle Scribe)

1. In `ForwardToWorkEmail.gs`, update the following variables:
   - `const recipient = "<WORKEMAIL>";` - Replace `<WORKEMAIL>` with your work email address.

#### Work Account

1. In `SaveToGDrive.gs`, update the following variables:
   - `var senderEmail = '<YouPersonalid@gmail.com>';` - Replace with the sender's email address.
   - `var folderId = '<>';` - Replace with your Google Drive folder ID.
   - `var sheetId = '<>';` - Replace with your Google Sheet ID.
   - `var sheetName = 'Action Items List from Notes';` - Replace with your desired sheet name.

### Step 4: Authorize the Scripts

#### Personal Account (Kindle Scribe)

1. Click on the `Deploy` button and select `Test deployments`.
2. Click on `Select type` and choose `Web app`.
3. Click on `Deploy`.
4. Authorize the script to access your Google account and grant the necessary permissions.

#### Work Account

1. Click on the `Deploy` button and select `Test deployments`.
2. Click on `Select type` and choose `Web app`.
3. Click on `Deploy`.
4. Authorize the script to access your Google account and grant the necessary permissions.

### Step 5: Schedule the Script to Run Every 5 Minutes

#### Personal Account (Kindle Scribe)

1. In the Google Apps Script editor, click on the clock icon on the left sidebar to open the `Triggers` page.
2. Click on `Add Trigger`.
3. Set the following options:
   - Choose which function to run: `checkForAmazonEmails`
   - Choose which deployment should run: `Head`
   - Select event source: `Time-driven`
   - Select type of time-based trigger: `Minutes timer`
   - Select minute interval: `Every 5 minutes`
4. Click on `Save`.

#### Work Account

1. In the Google Apps Script editor, click on the clock icon on the left sidebar to open the `Triggers` page.
2. Click on `Add Trigger`.
3. Set the following options:
   - Choose which function to run: `saveGmailAttachmentsToDrive`
   - Choose which deployment should run: `Head`
   - Select event source: `Time-driven`
   - Select type of time-based trigger: `Minutes timer`
   - Select minute interval: `Every 5 minutes`
4. Click on `Save`.

### Step 6: Save and Close

1. Save your project by clicking on the `File` menu and selecting `Save`.
2. Close the Google Apps Script editor.

## Usage

Once the scripts are set up and scheduled, they will automatically run every 5 minutes to check for new handwritten notes on your Kindle Scribe, save them to Google Drive, and forward them to your work Gmail.

## License

This project is licensed under the MIT License. See the [`LICENSE`](LICENSE ) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

By following these steps, you will have successfully set up the automation to share your handwritten notes from Kindle Scribe to your work Gmail and Google Drive. If you encounter any issues, please refer to the Google Apps Script documentation or open an issue in this repository.