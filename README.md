# Serverless

The `Serverless` module provides functionality to send email notifications using the Mailgun service. It is designed to handle different scenarios related to assignment submissions and communicates the status to the users. The module utilizes the Mailgun.js library for sending emails.

## Prerequisites

Before using this module, ensure that you have the following prerequisites:

- Node.js and npm installed on your system.
- Mailgun account with an API key.
- AWS DynamoDB for tracking mail-related data.

## Installation

1. Install the required npm packages:

   ```bash
   npm install dotenv form-data mailgun.js uuid
   
2. Functionality

The sendEmailConfirmation function within the module performs the following tasks:

Constructs email content based on the assignment status and submission URL.
Sends the email using Mailgun.
Logs the email sending status.
Inserts tracking data into AWS DynamoDB.

3. Parameters

userEmail: The email address of the recipient.
submissionUrl: The URL for the assignment submission.
assignmentStatus: Boolean indicating the success or failure of the assignment submission.
assignmentPath: Path to the assignment in case of success.
assignmentName: Name of the assignment.
gcpPath: Google Cloud Storage path for the submitted assignment.
