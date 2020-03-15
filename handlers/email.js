const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass
    }
  });

// generar HTML
const generarHtml = (archivo,opciones = {}) =>{
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`,opciones);
    return juice(html);
}

const enviar = async (opciones) =>{
    await transport.sendMail({
      from: 'UpTask <no-reply@uptask.com>', // sender address
      to: opciones.usuario.email, // list of receivers
      subject: opciones.subject, // Subject line
      text: htmlToText.fromString(generarHtml(opciones.archivo,opciones)), // plain text body
      html: generarHtml(opciones.archivo,opciones) // html body
    })
};

module.exports = {
  enviar
};
