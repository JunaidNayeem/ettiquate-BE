require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
app.use(cors()); 
app.use(express.json());

const MAIL_PASSWORD = process.env.EMAIL_PASS
const MAIL_USERNAME = process.env.EMAIL_USER

const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: "465",
  secure: true,
  auth: {
    user: MAIL_USERNAME,
    pass: MAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: true
  }
})

async function sendEmail(to, subject, html) {
    const options = { from: MAIL_USERNAME, to, subject, text:html };
    try {
        transport.sendMail(options, function (err, _info) {
            console.log("Email Sent Successfully")
            if (err) {
              throw new BadRequestError(err)
            }
          })        
    } catch (err) {
        console.error("Error sending email:", err);
        throw err; // This will be caught in the try-catch of the calling function
    }
}



// Endpoint to receive form data
app.post('/send-email', cors(), async (req, res) => {
    console.log("Running till -----1");
    const { firstName, lastName, dob, grade, allergy, firstName1, lastName1, cellPhone, workPhone, email } = req.body;
    const emailContent = `First Name: ${firstName}\nLast Name: ${lastName}\nDate of Birth: ${dob}\nGrade: ${grade}\nAllergy: ${allergy}\nParent/Guardian First Name: ${firstName1}\nParent/Guardian Last Name: ${lastName1}\nCell Phone: ${cellPhone}\nWork Phone: ${workPhone}\nEmail: ${email}`;
    console.log(emailContent)
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO, 
        subject: 'New Form Submission',
        text: emailContent
    };
    console.log("Running till -----2");
    try {
        console.log("Running till -----3");
        await sendEmail(mailOptions.to,mailOptions.subject,mailOptions.text);
      res.status(200).send('Email sent successfully');
    } catch (error) {
        console.log("Running till -----4");
      console.error('Error:', error);
      res.status(500).send('Error sending email');
    }
  });
  

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
