
"use strict"

var api_key = '1e27e2810b2d2c020429acd2dd45e895-7dcc6512-1dcbf83c';
var domain = 'sandboxf4c633a0abab426094e541374d99fb42.mailgun.org';
var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

module.exports = {


    //Helper for sending Email
    sendMail: async (input) => {
        console.log('[=== Send Email Request ===]', input);
        await mailgun.messages().send({
            from: `ICO DashBoard <abhidelhi281298@gmail.com>`,
            to: input.email,
            subject: 'ForgetPassword Details',
            text: `Here is Details`,
            html: `<h4>Hello  ${input.email}</h1><br />
            <a href='http://localhost:3000/pages/reset-password-v1/${input.token}'>Link<a>`

        }).then((data) => {
            console.log(data)
            console.log('Message sent')
        }).catch((error) => {

            console.log(error)

        })


    }
}