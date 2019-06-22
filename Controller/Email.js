var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "outmail.abc.co.th", // hostname
    secure: false, // use SSL
    port: 25, // port for secure SMTP,
    secure: true,
    service: 'gmail',
    auth: {
        user: 'patienthistoryteam@gmail.com',
        pass: 'gp team 2019'
    },
    tls: {
        rejectUnauthorized: false
    }
});

exports.sendEmail = (mail,recoveryPassword)=>{
    return new Promise((resolve, reject) => {
        var text = 'You are receive this mail because you requested a password reset for your DoctorCom account.' +
            'please use these password ( '+recoveryPassword + ' ) if you do not request new password please forget these mail';
        var mailOptions = {
            from: 'patienthistoryteam@gmail.com',
            to: mail,
            subject: 'Recovery password',
            text: text
        };
        transporter.sendMail(mailOptions, function (error, info) {
            //console.log(mailOptions);
            if (error) {
                console.log(error);
                reject(error)
            } else {
                console.log('Email sent: ' + info.response);
                resolve('Email sent: ' + info.response);
            }
        });
    });
};
exports.registrationMailPlace = (mail,username,password)=>{
    return new Promise((resolve, reject) => {
        var text = 'You are receive this mail because you register to DoctorCom App .' +
            'please login with these username : '+username+' password ( '+password + ' ) ';
        var mailOptions = {
            from: 'patienthistoryteam@gmail.com',
            to: mail,
            subject: 'Confirmation',
            text: text
        };
        transporter.sendMail(mailOptions, function (error, info) {
            //console.log(mailOptions);
            if (error) {
                console.log(error);
                reject(error)
            } else {
                console.log('Email sent: ' + info.response);
                resolve('Email sent: ' + info.response);
            }
        });
    });
};
exports.commentPharmacy = (mail,pharmacyName,comment)=>{
    return new Promise((resolve, reject) => {
        var text = pharmacyName +' comment on your medicines and comment is ( ' +comment+ ' please review these comment with your doctor ';
        var mailOptions = {
            from: 'patienthistoryteam@gmail.com',
            to: mail,
            subject: 'Confirmation',
            text: text
        };
        transporter.sendMail(mailOptions, function (error, info) {
            //console.log(mailOptions);
            if (error) {
                console.log(error);
                reject(error)
            } else {
                console.log('Email sent: ' + info.response);
                resolve('Email sent: ' + info.response);
            }
        });
    });
};


