import dotenv from 'dotenv';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { v4 as uuidv4 } from 'uuid';
import insertItemToDynamoDB from './mailTracker.mjs';
dotenv.config();

const mailgun = new Mailgun(formData);

const domain = process.env.domainName;
const apiKey = process.env.MAILGUN_API_KEY;
const mg = mailgun.client({ username: 'api', key: apiKey });

const isValidUrl = (url) => {
    // Regular expression for a valid URL
    const urlPattern = new RegExp('^(https?|ftp):\\/\\/[\\w-]+(\\.[\\w-]+)+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?$');
    return urlPattern.test(url);
  };

const sendEmailConfirmation = async (userEmail, submissionUrl, assignmentStatus, assignmentPath, assignmentName, gcpPath) => {
    let textData;
    let htmlData;
    if(assignmentStatus)
    {
        textData = `Dear ${userEmail},\n\n` +
        `We are delighted to inform you that your assignment has been successfully submitted. Access your submission through the following link:\n` +
        `Assignment Path: ${assignmentPath}\n\n` +
        `Should you encounter any challenges or have questions, please don't hesitate to reach out to us.\n\n` +
        `Best regards,\n` +
        `Admin Team`;
        htmlData = `<p>Dear ${userEmail},</p>` +
        `<p>Your submission has been received successfully. Kindly access it through the provided link.</p>` +
        `<p><strong>Assignment Name:</strong> ${assignmentName} </p>` +
        `<p><strong>Downloadble Link:</strong> <a href="${assignmentPath}">Link</a> </p>` +
        `<p><strong>Cloud Storage Path:</strong> ${gcpPath}</p>` +
        `Should you encounter any challenges or have questions, please don't hesitate to reach out to us.` +
        `<p>Best regards,<br/>Admin Team</p>`
    }
    else if(isValidUrl(submissionUrl) && submissionUrl.endsWith('.zip')){
        textData = `Dear ${userEmail},\n\n` +
        `There was an issue with your assignment submission. We couldn't retrieve the zip file from the submission URL\n` +
        `Kindly ensure that the provided submission URL (.zip) is accessible, and resubmit it before the deadline.\n\n` +
        `Assignment Name: ${assignmentName} \n\n` +
        `Submission URL: ${submissionUrl}\n\n` +
        `Best regards,\n` +
        `Admin Team`;
        htmlData = `<p>Dear ${userEmail},</p>` +
        `<p>There was an issue with your assignment submission. We couldn't retrieve the zip file from the submission URL</p>` +
        `<p>Kindly ensure that the provided submission URL (.zip) is accessible, and resubmit it before the deadline.</p>` +
        `<p><strong>Assignment Name:</strong> ${assignmentName} </p>` +
        `<p><strong>Submission URL:</strong> ${submissionUrl} </p>` +
        `<p>Should you encounter any challenges or have questions, please don't hesitate to reach out to us.</p>` +
        `<p>Best regards,<br/>Admin Team</p>`
    }
    else{
        textData = `Dear ${userEmail},\n\n` +
        `There was an issue with your assignment submission. We couldn't retrieve the zip file from the submission URL\n` +
        `Please validate the submission and resubmit it before the deadline.\n\n` +
        `Assignment Name: ${assignmentName} \n\n` +
        `Submission URL: ${submissionUrl}\n\n` +
        `Best regards,\n` +
        `Admin Team`;
        htmlData = `<p>Dear ${userEmail},</p>` +
        `<p>There was an issue with your assignment submission. We couldn't retrieve the zip file from the submission URL</p>` +
        `<p>Your assignment submission encountered an issue. We were unable to access the zip file from submissionURL</p>` +
        `<p>Please validate the submissionURL and resubmit it before the deadline.</p>` +
        `<p><strong>Assignment Name:</strong> ${assignmentName} </p>` +
        `<p><strong>Submission URL:</strong> ${submissionUrl} </p>` +
        `<p>If you encounter any issues or have questions, please contact us.</p>` +
        `<p>Best regards,<br/>Admin Team</p>`
        
    }

    const mailData = {
        from: 'Admin <Admin@' + domain + '>',
        to: [userEmail],
        cc: ['kodandram14@gmail.com'],
        subject: `Assignment submission status`,
        text: textData,
        html: htmlData
      };

    try {
        const msg = await mg.messages.create(domain, mailData);
        console.log(msg);
        const epochTime = Date.now();
        const uniqueId = uuidv4();
        const item =  
            {
                uniqueId: {S : uniqueId},
                emailId: { S : userEmail },
                assignmentName: { S: assignmentName},
                submissionURL: { S : submissionUrl },
                epochTime : {S: epochTime.toString()}
            }
        insertItemToDynamoDB(item);
    } catch (err) {
        console.log(err);
    }
}

export default sendEmailConfirmation;
