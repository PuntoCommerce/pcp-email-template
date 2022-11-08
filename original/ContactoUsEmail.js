const nodemailer = require('nodemailer');
exports.contacto_us = function(data){
  // Definimos el transporter
  const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER, // correo gmail temporal
        pass: process.env.EMAIL_PASSWORD, // Contraseña de aplicacion de google
      },
      // ignoreTLS: true,
      // secure: true,
      secureConnection: true,
      tls: { ciphers: 'SSLv3' },
      requiresAuth: true,
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      //maxConnections: 10,
      debug: true
    });
      
  // Definimos el email
  const mailOptions = {
    from: "no-responder@dielsa.com",
    to: "gabriel@puntocommerce.com",
    subject: 'Bienvenido a Dielsa',
    html: 
    `<!Doctype html>
    <html>
        <head>
            <title>Bienvenido</title>
            <link href="` + process.env.BACK_LINK + `/recursos/bootstrap.min.css" rel="stylesheet">
            <style type="text/css">
                .navbar img {
                    margin:0px auto;
                    display:block;
                }
            </style>
        </head>
        <body>
            <nav class="navbar navbar-light bg-light" style="background-color: #0B3196 !important; height: 375px !important;">
                <img src="` + process.env.BACK_LINK + `/recursos/logo.png">
            </nav>
            <h1 style="color: #0B3196 !important; text-align: center !important;">¡Bievenido a Dielsa!</h1>
            <div class="container">
                <div class="row">
                    <div class="col-sm"></div>
                    <div class="col-sm">
                        <img  src="` + process.env.BACK_LINK + `/recursos/bienvenida.png" >
                    </div>
                    <div class="col-sm"></div>
                </div>
            </div>
            <div class="container">
                <div class="row">
                    <div class="col-sm"></div>
                    <div class="col-sm">
                        <p style="text-align: center;">
                            <h4><srtrong>Mensaje de: </strong> ` + data.c_correo_electronico  + ` </h4>
                        </p>
                    </div>
                    <div class="col-sm"></div>
                </div>
            </div>
            <div class="container">
                <div class="row">
                    <div class="col-sm"></div>
                    <div class="col-sm">
                        <p> ` + data.c_empresa + `</p>
                        <p> ` + data.c_mensaje + `</p>
                        <p> ` + data.c_telefono + `</p>
                    </div>
                    <div class="col-sm"></div>
                </div>
            </div>
            <div class="container" style="height: 40px !important;">
    
            </div>
            <div class="card-footer text-muted" style="background-color: #0B3196 !important; color: #fff !important;">
                <div class="container">
                    <div class="row">
                        <div class="col-sm"></div>
                        <div class="col-sm">
                            <p>
                                <strong>¿Necesita ayuda?</strong><br>
                                Correo: contacto@dielsa.com
                            </p>
                            <p>
                                <strong>DIELSA Monterrey</strong><br>
                                Oscar Wilde No. 143 Col. San Jerónimo, Monterrey, N.L. C.P. 64640
                                Tel. (81) 4739 36 08
                            </p>
                            <p>
                                <strong>DIELSA Ciudad de México</strong><br>
                                Benito Juárez No. 19 Col. Lazaro Cardenas Estado de México, Naucalpan de Juárez
                                C.P. 53560<br>
                                Tel. (55) 5353 3474
                            </p>
                        </div>
                        <div class="col-sm"></div>
                    </div>
                </div>
                <div class="container" style="text-align: center !important;">
                    <div class="row">
                        <div class="col-sm"></div>
                        <div class="col-sm">
                            <div class="row" style="color: #fff !important;">
                                <div class="col">
                                    <img src="` + process.env.BACK_LINK + `/recursos/facebook.svg">
                                </div>
                                <div class="col">
                                    <img src="` + process.env.BACK_LINK + `/recursos/twitter.svg">
                                </div>
                                <div class="col">
                                    <img src="` + process.env.BACK_LINK + `/recursos/instagram.svg">
                                </div>
                                <div class="col">
                                    <img src="` + process.env.BACK_LINK + `/recursos/linkedin.svg">
                                </div>
                                <div class="col">
                                    <img src="` + process.env.BACK_LINK + `/recursos/youtube.svg">
                                </div>
                            </div>
                        </div>
                        <div class="col-sm"></div>
                    </div>
                </div>
                <div class="container" style="text-align: center !important;">
                    <div class="row">
                        <div class="col-sm"></div>
                        <div class="col-sm" style="border-top: 1px solid #fff !important;">
                            © 2022 Dielsa. Todos Los Derechos Reservados
                        </div>
                        <div class="col-sm"></div>
                    </div>
                </div>
            </div>
        </body>
    </html>`
  };


  // Enviamos el email
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
        console.log('Error', err);
    } else {
        console.log('GOOD JOB', data);
    }
  });
};