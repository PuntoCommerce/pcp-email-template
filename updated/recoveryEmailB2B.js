const nodemailer = require("nodemailer");
import models from "../models";
exports.recoveryEmail = async function (email, token, id_socio_negocio) {
  const socios_negocio_usuario = await models.SociosNegocioUsuario.findOne({
    where: {
      snu_usuario_snu_id: id_socio_negocio,
    },
  });

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

  // Definimos el email content
  var htmlBody =
    `
  <!DOCTYPE html>
  <html lang='es'>
  <head>
        <title>Recuperar contraseña</title>
        <link href="` +
  process.env.BACK_LINK +
  `/recursos/bootstrap.min.css" rel="stylesheet">
        <style type="text/css">
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

          .navbar img {
              margin:0px auto;
              display:block;
          }

          .content_data {
            background-color: #f5f5f5;
            padding: 30px;
            font-size: 16px
          }

          .header_logo {
            background-color: #0B3196; 
            height: 100px; 
            color: white; 
            width: 100%; 
            text-align: center;
            display: inline-flex; 
            justify-content: center; 
            align-items: center;
          }

          body {
            font-family: helvetica;
          }

          @media only screen and (max-width: 504px) {
              body,table,td,p,a,li,blockquote {
              -webkit-text-size-adjust:none !important;
              }
              table {width: 100% !important;}
              .responsive-image img {
              height: auto !important;
              max-width: 100% !important;
              width: 100% !important;
              }
              td{
              text-align:center;
              }
          }
        </style>
      </head>
      <body>
        <header class="header_logo">
          <img src='` + process.env.BACK_LINK + `/recursos/logo.png' / style='max-height: 70px; margin-top: 10px; margin: auto'>          
        </header>

    <section style='background: white; width: 90%; max-width: 800px; margin: 20px auto; text-align: -webkit-center; margin-top: 50px;'>
      <section id='main-content'>
      <article>
        <header>
          <div style='color: #0B3196; font-size: 28px; font-weight: 500; letter-spacing: 0;'>
            <h1>Recupera tu contraseña</h1>                  
          </div>
        </header>         
    
        <div style='padding-top: 20px; color: #000000; font-size: 18px; font-style: italic; font-weight: 500; letter-spacing: 0; line-height: 20px; text-align: justify;'>
          <p>Estimado ` +
    socios_negocio_usuario.dataValues.snu_nombre +
    ` ` +
    socios_negocio_usuario.dataValues.snu_primer_apellido +
    `</p>
        </div>

      <div style='color: #000000; font-size: 16px; font-style: italic; letter-spacing: 0; line-height: 20px; padding-bottom: 50px; text-align: -webkit-left'>
      <div class='contenido1'>
      </div>
            <p>Recientemente recibimos una solicitud para cambiar la contraseña de tu cuenta.</p>
            <p>Si solicitaste este cambio, da click en el siguiente enlace para generar una nueva contraseña.</p>
            <p>Si no has realizado esta solicitud, puedes ignorar este mensaje y tu contraseña seguirá siendo la misma.</p>
            
    
          </div>
          
    
    <a class='button' style=' background-color: #0B3196;
        border: none;
        color: white;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;'
        href='` +
    process.env.RECOVERY_PASSWORD +
    `/recovery?` +
    token +
    `'
    >
        <strong>Generar nueva contraseña</strong>
      </a>
        </article> <!-- /article -->
      
      </section></section> <!-- / #main-content -->
    
                      <footer style='flex: 1; padding-top: 50px; background: #0B3196;color: white;text-align: left;padding: 20px;margin-top: 40px;'>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td>
                                <table border="0" cellpadding="0" cellspacing="0" align="left" width="24%">
                                    <tr>
                                        <td>
                                          <div style='padding: 0.5rem; min-width: 12.5rem;'>
                                            <div class='ft-main-item'></div>                                    
                                            <h2 class='ft-title' style='color: #FFFFFF; font-size: 16px; font-weight: 500; letter-spacing: 0; line-height: 16px;'>
                                              ¿Necesita ayuda?
                                            </h2>
                                              <p style='color:white; font-size: 14px;'>(81) 8123 9359</p>                                            
                                              <p style='color:white; font-size: 14px;'><a class='colores' href='mailto:contacto@dielsa.com' style='color:white; font-size: 14px; text-decoration: none;'>contacto@dielsa.com</a></p>                                            
                                          </div>
                                        </td>
                                    </tr>                                  
                                </table>
                                <table border="0" cellpadding="0" cellspacing="0" align="left" width="24%">
                                    <tr>
                                        <td>
                                          <div style='padding: 0.5rem; min-width: 12.5rem;'>
                                            <div class='ft-main-item'></div>                                    
                                            <h2 class='ft-title' style='color: #FFFFFF; font-size: 16px; font-weight: 500; letter-spacing: 0; line-height: 16px;'>
                                              Dielsa Monterrey
                                            </h2>
                                            <p class='colores' style='color:white; font-size: 14px;'>Oscar Wilde No. 143 Col. San Jerónimo, <br>Monterrey, N.L. C.P. 64640 Tel. (81) 4739 36 08</p>
                                          </div>                                    
                                        </td>
                                    </tr>                                  
                                </table>
                                <table border="0" cellpadding="0" cellspacing="0" align="left" width="24%">
                                    <tr>
                                        <td>
                                          <div style='padding: 0.5rem; min-width: 12.5rem;'>
                                            <div class='ft-main-item'></div>                                    
                                            <h2 class='ft-title' style='color: #FFFFFF; font-size: 16px; font-weight: 500; letter-spacing: 0; line-height: 16px;'>
                                              Dielsa Ciudad de México
                                            </h2>
                                            <p class='colores' style='color:white; font-size: 14px;'>Benito Juárez No. 19 Col. Lazaro Cardenas Estado <br>de México, Naucalpan de Juárez C.P. 53560 Tel. (55) 5353 3474</p>                                            
                                          </div>                                                                             
                                        </td>
                                    </tr>                                  
                                </table>
                                <table border="0" cellpadding="0" cellspacing="0" align="left" width="24%">
                                    <tr>
                                        <td>
                                          <div style='padding: 0.5rem; min-width: 12.5rem;'>
                                            <div class='ft-main-item'></div>                                                                                
                                            <div class='social'>
                                              <a href='https://www.facebook.com/Dielsamsi/' style='text-decoration: none;' target="_blank">
                                                  <img src="` +
                    process.env.BACK_LINK +
                    `/recursos/Facebook.png" alt='facebook'>
                                              </a>
                                              <a href='https://www.linkedin.com/company/dielsa-telecomunicaciones/' style='text-decoration: none;' target="_blank">
                                                  <img src="` +
                    process.env.BACK_LINK +
                    `/recursos/LinkedIn.png" alt='linkedin'>
                                              </a>
                                              <a href='https://www.instagram.com/dielsamsi/?hl=es' style='text-decoration: none;' target="_blank">
                                                  <img src="` +
                    process.env.BACK_LINK +
                    `/recursos/Instagram.png" alt='instagram'>
                                              </a>
                                              <a href='https://www.youtube.com/channel/UCLYgOWzTRXXuJvMIcvB4GLw' style='text-decoration: none;' target="_blank">
                                                  <img src="` +
                    process.env.BACK_LINK +
                    `/recursos/Youtube.png" alt='youtube'>
                                              </a>
                                          </div>                                          
                                          </div>                                                                             
                                        </td>
                                    </tr>                                  
                                </table>
                            </td>
                          </tr>
                          <tr> 
                            <td>
                              <div style='padding-top: 1rem; min-width: 12.5rem;'>
                                <section class='ft-legal'>
                                  <center>
                                    <span>&copy; 2022 Dielsa. Todos Los Derechos Reservados.</span>
                                  </center>
                                </section>
                              </div>                                
                            </td>
                          </tr>
                        </table>
                    </footer>
    
      
    </body>
    </html>
    `;
  
  // Definimos list email test
  var maillist
  if(process.env.EMAIL_ENV == "development")
  {
      maillist = [
          "baltazar.ibarra@dielsa.com",
          "gustavo.arizpe@dielsa.com",
          "marlen.pena@dielsa.com",
          "gabriel@puntocommerce.com",
          "henry@puntocommerce.com",
          "aymara@puntocommerce.com",
      ];
  }
  else
  {
      maillist = [
          email
      ];
  }


  
  // Definimos el email
  const mailOptions = {
    from: "no-responder@dielsa.com",
    to: maillist,
    // to: constSociosNegocio.sn_email_facturacion,
    subject: "Recuperar contraseña",
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
};
