const nodemailer = require("nodemailer");
exports.nuevoUsuario = function (email, password) {
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
    tls: { ciphers: "SSLv3" },
    requiresAuth: true,
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    //maxConnections: 10,
    debug: true,
  });

  console.log(
    "URL",
    process.env.BACK_LINK,
    "\n",
    process.env.BACK_LINK + `\\recursos\\logo.png`
  );

  var htmlBody =
    `
    <!DOCTYPE html>
    <html lang='es'>
    <head>
    <style>
    @font-face {
    font-family: 'Centrale Sans Medium';
    font-stretch: normal;
    src: url('CentraleSans-Medium.woff') format('woff');
    }
    @font-face {
    font-family: 'Centrale Sans Regular';
    font-stretch: normal;
    src: url('CentraleSansRegular.woff') format('woff');
    }
    @font-face {
    font-family: 'Centrale Sans Light';
    font-stretch: normal;
    src: url('CentraleSans-Light.woff') format('woff');
    }
    @font-face {
    font-family: 'Centrale Sans Medium';
    font-stretch: normal;
    src: url('CentraleSans-Medium.woff') format('woff');
    }
        <meta charset='utf-8'>
        <title>Cabecera fija</title>

    </style>
    </head>

    <body>

        <header style='background-color: #0B3196; color: white; height: 100px; color: white; text-align: -webkit-center; width: 100%; left: 0; top: 0; position: fixed;'>
        <header id='main-header'>
        

        <div style='vertical-align: middle; margin: 30px 0 0 10px; max-width: 150%;'>
        <div class='header_logo'>
            </div>
            
        <center><img src='` +
    process.env.BACK_LINK +
    `/recursos/logo.png' / style='padding-top:10px; height: 80px;'></center>

        </div>

        </header></header><!-- / #main-header -->

        <section style='background: white; width: 90%; max-width: 800px; margin: 20px auto; text-align: -webkit-center;'>
        <section id='main-content'>
        
        
        <article>
        <header>
        <div style='width: 500px; color: #0B3196; font-size: 28px; font-style: italic; font-weight: 500; letter-spacing: 0; line-height: 16px;'>
        <div class='bienvenido'>
        
                    
            <h1>¡Bievenido a Dielsa!</h1>
        </div>
        </header>
                
        <center><img src='` +
    process.env.BACK_LINK +
    `/recursos/sobre.png' alt='Bienvenido' /></center>
        <div style='padding-top: 50px; color: #000000; font-size: 18px; font-style: italic; font-weight: 500; letter-spacing: 0; line-height: 20px; text-align: justify;'>
        <div class='contenido'>
        </div>
        
        <p>Ahora que estas registrado podrás realizar compras más fácil y rápido además de recibir promociones y descuentos exclusivos.</p>
                
        <p>En la sección de 'Mi cuenta' podrás:</p>

        </div>
        <div style='color: #000000; font-size: 16px; font-style: italic; letter-spacing: 0; line-height: 20px; padding-bottom: 50px; text-align: -webkit-left'>
        <div class='contenido1'>
        </div>
                    <p>- Consultar el estado de tus pedidos.</p>
                    <p>- Revisar el historial de tus compras.</p>
                    <p>- Dar de alta nuevas formas de pago y direcciones.</p>
                    <p>- Revisar información de tus facturas y crédito disponible.</p>
                    <p>- Generar nuevas cotizaciones.</p>
                    <p>- Crear nuevos usuarios.</p>
                    <p>- Modificar datos de la empresa.</p>

                </div>
                
    <p>
        <strong>Contrase&ntilde;a:<strong>  ` +
    password +
    ` 
    </p>
    <a  style=' background-color: #0B3196;
        border: none;
        color: white;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;' href='` +
    process.env.RECOVERY_PASSWORD +
    `/login'>
        <strong>Iniciar sesi&oacute;n</strong>
    </a>
            </article> <!-- /article -->
        
        </section></section> <!-- / #main-content -->

        <div style='flex: 1; padding-top: 50px; background: #0B3196;
        color: white;
        text-align: left;
        padding: 20px;
        margin-top: 40px;'>
            <div class='container'></div>

    <footer>
    <!-- Footer main -->
        <section style=' padding: 1.25rem 1.875rem; display: flex; justify-content: space-evenly; justify-content: end;'>
        <section class='ft-main'>
        </section>

        <div style='padding: 1.25rem; min-width: 12.5rem;'>
            <div class='ft-main-item'>
        </div>
        
        <h2 class='ft-title' style='color: #FFFFFF; font-size: 16px; font-weight: 500; letter-spacing: 0; line-height: 16px; text-align: justify;'>
        ¿Necesita ayuda?</h2>
    </h2>
        <ul style='list-style:none; padding: 0px 60px 0px 0px;'>
        <li><a style='color:white; font-size: 14px;'><a class='colores' href='mailto:contacto@dielsa.com' style='color:white; font-size: 14px;'>Correo: contacto@dielsa.com</a></li>
        </ul>
    </div>
        <div class='ft-main-item'>
        <h2 class='ft-title' style='color: #FFFFFF; font-size: 16px; font-weight: 500; letter-spacing: 0; line-height: 16px; text-align: justify;'>
        DIELSA Monterrey</h2>
    </h2>
        <ul style='list-style:none; padding: 0px 60px 0px 0px;'>
    
        <li><a class='colores' style='color:white; font-size: 14px;' href='mailto:contacto@dielsa.com'>Oscar Wilde No. 143 <br>Col. San Jerónimo, Monterrey, N.L. <br>C.P. 64640 Tel. (81) 4739 36 08</a></li>
        
        </ul>
        </div>
        <div class='ft-main-item'>
        <h2 class='ft-title' style='color: #FFFFFF; font-size: 16px; font-weight: 500; letter-spacing: 0; line-height: 16px; text-align: justify;'>
        DIELSA Ciudad de México</h2>
    </h2>
        <ul style='list-style:none; padding: 0px 60px 0px 0px;'>
        <li><a class='colores' style='color:white; font-size: 14px;' href='mailto:contacto@dielsa.com'>Benito Juárez No. 19 <br>Col. Lazaro Cardenas Estado de México, Naucalpan de Juárez <br>C.P. 53560 Tel. (55) 5353 3474</a></li>
        </ul>
        </div>
    <div class='social'>
            <a href='#'><img src='` +
    process.env.BACK_LINK +
    `/recursos/Facebook.png' alt='facebook'></a>
            <a href='#'><img src='` +
    process.env.BACK_LINK +
    `/recursos/Youtube.png' alt='youtube'></a>
            <a href='#'><img src='` +
    process.env.BACK_LINK +
    `/recursos/LinkedIn.png' alt='linkedin'></a>
            <a href='#'><img src='` +
    process.env.BACK_LINK +
    `/recursos/Instagram.png' alt='instagram'></a>
        </div>
    </section>



    <!-- Footer legal -->

    <section class='ft-legal'>
    <ul style=' width: 100%; list-style:none !important; flex-wrap: wrap;'>
        <ul class='ft-legal-list' style='list-style:none !important;'>
        <center><li>&copy; 2021 Dilesa. Todos Los Derechos Reservados.</li></center>
        </ul>
    </section>
    </footer>

        
    </body>
    </html>

  `;

  // Definimos el email
  const mailOptions = {
    from: "no-responder@dielsa.com",
    to: "henry@puntocommerce.com",
    // to: constSociosNegocio.sn_email_facturacion,
    subject: "Bienvenid@ a DIELSA",
    html: htmlBody,
  };

  // Enviamos el email
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("GOOD JOB", data);
    }
  });

  // Definimos el email
  const mailOptions2 = {
    from: "no-responder@dielsa.com",
    to: "gabriel@puntocommerce.com",
    subject: "Bienvenid@ a DIELSA",
    html: htmlBody,
  };

  // Enviamos el email
  transporter.sendMail(mailOptions2, (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("GOOD JOB", data);
    }
  });

  // Definimos el email
  const mailOptions3 = {
    from: "no-responder@dielsa.com",
    to: "aymara@puntocommerce.com",
    subject: "Bienvenid@ a DIELSA",
    html: htmlBody,
  };

  // Enviamos el email
  transporter.sendMail(mailOptions3, (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("GOOD JOB", data);
    }
  });

  // // Definimos el email
  // const mailOptions = {
  //   from: "no-responder@dielsa.com",
  //   to: email,
  //   subject: 'Bienvenid@ a DIELSA',
  //   html: `
  //   <!DOCTYPE html>
  //   <html lang='es'>
  //   <head>
  //   <style>
  //   @font-face {
  //   font-family: 'Centrale Sans Medium';
  //   font-stretch: normal;
  //   src: url('CentraleSans-Medium.woff') format('woff');
  //   }
  //   @font-face {
  //   font-family: 'Centrale Sans Regular';
  //   font-stretch: normal;
  //   src: url('CentraleSansRegular.woff') format('woff');
  //   }
  //   @font-face {
  //   font-family: 'Centrale Sans Light';
  //   font-stretch: normal;
  //   src: url('CentraleSans-Light.woff') format('woff');
  //   }
  //   @font-face {
  //   font-family: 'Centrale Sans Medium';
  //   font-stretch: normal;
  //   src: url('CentraleSans-Medium.woff') format('woff');
  //   }
  //       <meta charset='utf-8'>
  //       <title>Cabecera fija</title>

  //   </style>
  //   </head>

  //   <body>

  //       <header style='background-color: #0B3196; color: white; height: 100px; color: white; text-align: -webkit-center; width: 100%; left: 0; top: 0; position: fixed;'>
  //       <header id='main-header'>

  //       <div style='vertical-align: middle; margin: 30px 0 0 10px; max-width: 150%;'>
  //       <div class='header_logo'>
  //           </div>

  //       <center><img src='` + process.env.BACK_LINK + `/recursos/logo.png' / style='padding-top:10px; height: 80px;'></center>

  //       </div>

  //       </header></header><!-- / #main-header -->

  //       <section style='background: white; width: 90%; max-width: 800px; margin: 20px auto; text-align: -webkit-center;'>
  //       <section id='main-content'>

  //       <article>
  //       <header>
  //       <div style='width: 500px; color: #0B3196; font-size: 28px; font-style: italic; font-weight: 500; letter-spacing: 0; line-height: 16px;'>
  //       <div class='bienvenido'>

  //           <h1>¡Bievenido a Dielsa!</h1>
  //       </div>
  //       </header>

  //       <center><img src='` + process.env.BACK_LINK + `/recursos/sobre.png' alt='Bienvenido' /></center>
  //       <div style='padding-top: 50px; color: #000000; font-size: 18px; font-style: italic; font-weight: 500; letter-spacing: 0; line-height: 20px; text-align: justify;'>
  //       <div class='contenido'>
  //       </div>

  //       <p>Ahora que estas registrado podrás realizar compras más fácil y rápido además de recibir promociones y descuentos exclusivos.</p>

  //       <p>En la sección de 'Mi cuenta' podrás:</p>

  //       </div>
  //       <div style='color: #000000; font-size: 16px; font-style: italic; letter-spacing: 0; line-height: 20px; padding-bottom: 50px; text-align: -webkit-left'>
  //       <div class='contenido1'>
  //       </div>
  //                   <p>- Consultar el estado de tus pedidos.</p>
  //                   <p>- Revisar el historial de tus compras.</p>
  //                   <p>- Dar de alta nuevas formas de pago y direcciones.</p>
  //                   <p>- Revisar información de tus facturas y crédito disponible.</p>
  //                   <p>- Generar nuevas cotizaciones.</p>
  //                   <p>- Crear nuevos usuarios.</p>
  //                   <p>- Modificar datos de la empresa.</p>

  //               </div>

  //   <p>
  //       <strong>Contrase&ntilde;a:<strong>  ` + password + `
  //   </p>
  //   <a  style=' background-color: #0B3196;
  //       border: none;
  //       color: white;
  //       padding: 15px 32px;
  //       text-align: center;
  //       text-decoration: none;
  //       display: inline-block;
  //       font-size: 16px;
  //       margin: 4px 2px;
  //       cursor: pointer;' href='` + process.env.RECOVERY_PASSWORD + `/login'>
  //       <strong>Iniciar sesi&oacute;n</strong>
  //   </a>
  //           </article> <!-- /article -->

  //       </section></section> <!-- / #main-content -->

  //       <div style='flex: 1; padding-top: 50px; background: #0B3196;
  //       color: white;
  //       text-align: left;
  //       padding: 20px;
  //       margin-top: 40px;'>
  //           <div class='container'></div>

  //   <footer>
  //   <!-- Footer main -->
  //       <section style=' padding: 1.25rem 1.875rem; display: flex; justify-content: space-evenly; justify-content: end;'>
  //       <section class='ft-main'>
  //       </section>

  //       <div style='padding: 1.25rem; min-width: 12.5rem;'>
  //           <div class='ft-main-item'>
  //       </div>

  //       <h2 class='ft-title' style='color: #FFFFFF; font-size: 16px; font-weight: 500; letter-spacing: 0; line-height: 16px; text-align: justify;'>
  //       ¿Necesita ayuda?</h2>
  //   </h2>
  //       <ul style='list-style:none; padding: 0px 60px 0px 0px;'>
  //       <li><a style='color:white; font-size: 14px;'><a class='colores' href='mailto:contacto@dielsa.com' style='color:white; font-size: 14px;'>Correo: contacto@dielsa.com</a></li>
  //       </ul>
  //   </div>
  //       <div class='ft-main-item'>
  //       <h2 class='ft-title' style='color: #FFFFFF; font-size: 16px; font-weight: 500; letter-spacing: 0; line-height: 16px; text-align: justify;'>
  //       DIELSA Monterrey</h2>
  //   </h2>
  //       <ul style='list-style:none; padding: 0px 60px 0px 0px;'>

  //       <li><a class='colores' style='color:white; font-size: 14px;' href='mailto:contacto@dielsa.com'>Oscar Wilde No. 143 <br>Col. San Jerónimo, Monterrey, N.L. <br>C.P. 64640 Tel. (81) 4739 36 08</a></li>

  //       </ul>
  //       </div>
  //       <div class='ft-main-item'>
  //       <h2 class='ft-title' style='color: #FFFFFF; font-size: 16px; font-weight: 500; letter-spacing: 0; line-height: 16px; text-align: justify;'>
  //       DIELSA Ciudad de México</h2>
  //   </h2>
  //       <ul style='list-style:none; padding: 0px 60px 0px 0px;'>
  //       <li><a class='colores' style='color:white; font-size: 14px;' href='mailto:contacto@dielsa.com'>Benito Juárez No. 19 <br>Col. Lazaro Cardenas Estado de México, Naucalpan de Juárez <br>C.P. 53560 Tel. (55) 5353 3474</a></li>
  //       </ul>
  //       </div>
  //   <div class='social'>
  //           <a href='#'><img src='` + process.env.BACK_LINK + `/recursos/Facebook.png' alt='facebook'></a>
  //           <a href='#'><img src='` + process.env.BACK_LINK + `/recursos/Youtube.png' alt='youtube'></a>
  //           <a href='#'><img src='` + process.env.BACK_LINK + `/recursos/LinkedIn.png' alt='linkedin'></a>
  //           <a href='#'><img src='` + process.env.BACK_LINK + `/recursos/Instagram.png' alt='instagram'></a>
  //       </div>
  //   </section>

  //   <!-- Footer legal -->

  //   <section class='ft-legal'>
  //   <ul style=' width: 100%; list-style:none !important; flex-wrap: wrap;'>
  //       <ul class='ft-legal-list' style='list-style:none !important;'>
  //       <center><li>&copy; 2021 Dilesa. Todos Los Derechos Reservados.</li></center>
  //       </ul>
  //   </section>
  //   </footer>

  //   </body>
  //   </html>
  //   `
  // };

  // // Enviamos el email
  // transporter.sendMail(mailOptions, (err, data) => {
  //   if (err) {
  //       console.log('Error', err);
  //   } else {
  //       console.log('GOOD JOB', data);
  //   }
  // });
};
