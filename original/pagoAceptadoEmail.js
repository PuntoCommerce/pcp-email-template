const nodemailer = require('nodemailer');
import models from '../models';
const { Op } = require("sequelize");
import {  Sequelize } from 'sequelize';
const sequelize = new Sequelize(process.env.POSTGRESQL);
exports.pagoAceptado = async function(email, id_usuario_socio, orden){

  const pedido =  await models.CarritoDeCompra.findOne({
      where: {
          cdc_numero_orden: orden
      }
  });
  const socios_negocio_usuario = await models.SociosNegocioUsuario.findOne({
    where: {
      snu_usuario_snu_id: id_usuario_socio
    }
  });

  const socio_negocio = await models.SociosNegocio.findOne({
    where: {
      sn_socios_negocio_id: socios_negocio_usuario.dataValues.snu_sn_socio_de_negocio_id
    }
  });

  let datos_comprador = '';
  datos_comprador += ' ' + socios_negocio_usuario.dataValues.snu_nombre + ' ' + socios_negocio_usuario.dataValues.snu_primer_apellido + '<br>' ;
  datos_comprador += email + '<br>';
  datos_comprador += !!socios_negocio_usuario.dataValues.snu_telefono ? socios_negocio_usuario.dataValues.snu_telefono : ' ' ;


  let direccion_de_envio = '';
  direccion_de_envio +=  'Dirección predeterminada' + ' <br>';
  
  const total_compra = await sequelize.query(`
  select 
      sum(total.total)
  from(
  select 
      case 
          when pcdc.pcdc_mejor_descuento >= 10 then   (pcdc.pcdc_precio - (pcdc.pcdc_precio * cast(concat('0.' || pcdc.pcdc_mejor_descuento) as float))) * pcdc.pcdc_producto_cantidad
          when pcdc.pcdc_mejor_descuento <= 9 then    (pcdc.pcdc_precio - (pcdc.pcdc_precio * cast(concat('0.0' || pcdc.pcdc_mejor_descuento) as float))) * pcdc.pcdc_producto_cantidad
      end as total
  from carrito_de_compras cdc  
  left join productos_carrito_de_compra pcdc  on pcdc.pcdc_carrito_de_compra_id  = cdc.cdc_carrito_de_compra_id 
  where cdc.cdc_carrito_de_compra_id  = ` + pedido.dataValues.cdc_carrito_de_compra_id + `
  )total
  `,
  {
    type: sequelize.QueryTypes.SELECT
  });
  let total_de_la_compra = total_compra.length > 0 ? total_compra[0].sum : 0
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
    to: email,
    subject: 'Pago aceptado',
    html:`
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
            
            <center><img src='` + process.env.BACK_LINK + `/recursos/logo.png' / style='padding-top:10px; height: 80px;'></center>
    
      </div>
    
      </header></header><!-- / #main-header -->
    
      <section style='background: white; width: 90%; max-width: 800px; margin: 20px auto; text-align: -webkit-center;'>
      <section id='main-content'>
      
      
      <article>
      <header>
      <div style='width: 500px; color: #0B3196; font-size: 28px; font-weight: 500; letter-spacing: 0; line-height: 16px;'>
      <div class='bienvenido'>
      
            
        <h1>Pago aceptado</h1>
      </div>
      </header>
          
      <center>
      <img src='` + process.env.BACK_LINK + `/recursos/pagoaceptado.png' alt='PagoAceptado' / style='width: 600px;'>
      </center>
      <div style='padding-top: 50px; color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
      <div class='contenido'>
      </div>
      
      <p>Estimado cliente.</p>
          
    
      </div>
      <div style='color: #000000; font-size: 16px; letter-spacing: 0; line-height: 20px; text-align: -webkit-left'>
      <div class='contenido1'>
      </div>
            <p>¡Gracias por comprar con nosotros!</p>
            <p>El pago de tu pedido #` + orden + ` fue generado exitosamente.</p>
            <p>Puedes comprobar el estado de tu pedido en la sección de mis ordenes.</p>
            <p>Gracias por tu preferencia..</p>
    
          </div>
    
      <section class='datos' style='background: #F5F5F5; padding-top: 30px; padding-left: 50px;'>
    
    <div style='color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
      <div class='contenidos'>
      </div>
      
      <p>Datos Personales</p>
      </div>
      <div style='color: #000000; font-size: 16px; letter-spacing: 0; line-height: 20px; text-align: -webkit-left'>
      <div class='contenido1'>
      ` + datos_comprador + `
      </div>
    
    <div style='color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
      <div class='contenidos'>
      </div>
      
      <p>Dirección de entrega</p>
          
    
      </div>
      <div style='color: #000000; font-size: 16px; letter-spacing: 0; line-height: 20px; text-align: -webkit-left'>
      <div class='contenido1'>
      </div>
            <p>` + direccion_de_envio + `</p>
            
    <div style='color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
      <div class='contenidos'>
      </div>
      
      <p>Metodo del pago</p>
          
    
      </div>
      <div style='color: #000000; font-size: 16px; letter-spacing: 0; line-height: 20px; text-align: -webkit-left'>
      <div class='contenido1'>
      </div>
            <p>¡Gracias por comprar con nosotros!</p>
    <div style='color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
      <div class='contenidos'>
      </div>
      
      <p>Entrega el día</p>
          
    
      </div>
      <div style='color: #000000; font-size: 16px; letter-spacing: 0; line-height: 20px; padding-bottom: 50px; text-align: -webkit-left'>
      <div class='contenido1'>
      </div>
            <p>¡Gracias por comprar con nosotros!</p>
    </div>
    </div>
    </div>
    </div>
    </section>
    
    <section class='datos1' style='background: #0B3196; padding-top: 5px; padding-left: 60px; margin-top: 50px; padding-bottom: 5px; margin-bottom: 50px'>
    
    <div style='color: #fff; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: center;'>
      <div class='contenidos'>
      </div>
      
      <p> <a style='text-decoration: none; color: #fff !important;' href='` + process.env.FRONT_B2B + `/myprofile?orderid=` + pedido.dataValues.cf_compra_finalizada_id + `'>Detalles de compra</a></p>
          
    
      </div>
      </div>
        
    </section>
    <section class='datos1' style='background: #F5F5F5; padding-top: 30px; padding-left: 50px; padding-bottom: 30px;margin-bottom: 50px'>
    
    <div style='color: #0B3196; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
      <div class='contenidos'>
      </div>
      
      <p>Entrega en X días</p>
          
    
      </div>
    </div>
    </section>
    
    <section class='datos' style='background: #F5F5F5; padding-top: 30px; padding-left: 50px;'>
    
    <div style='color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
      <div class='contenidos'>
      </div>
      
      <p>Subtotal</p>
          
    
      </div>
      <div style='color: #000000; font-size: 16px; letter-spacing: 0; line-height: 20px; text-align: -webkit-left'>
      <div class='contenido1'>
      </div>
            <p>$ ` + total_de_la_compra + `</p>
    
    <div style='color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
      <div class='contenidos'>
      </div>
      
      <p>Gastos de envío</p>
          
    
      </div>
      <div style='color: #000000; font-size: 16px; letter-spacing: 0; line-height: 20px; text-align: -webkit-left'>
      <div class='contenido1'>
      </div>
            <p>$00,000.00</p>
            
    <div style='color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
      <div class='contenidos'>
      </div>
      
      <p>Descuento</p>
          
    
      </div>
      <div style='color: #000000; font-size: 16px; letter-spacing: 0; line-height: 20px; text-align: -webkit-left'>
      <div class='contenido1'>
      </div>
            <p>$00,000.00</p>
    <div style='color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
      <div class='contenidos'>
      </div>
      
      <p>IVA 16%</p>
          
    
      </div>
      <div style='color: #000000; font-size: 16px; letter-spacing: 0; line-height: 20px; padding-bottom: 50px; text-align: -webkit-left'>
      <div class='contenido1'>
      </div>
      <p>$ ` + (total_de_la_compra * 0.16) + `</p>
    <div style='color: #000000; font-size: 24px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
      <div class='contenidos'>
      </div>
      
      <p>Total</p>
          
    
      </div>
      <div style='color: #000000; font-size: 19px; letter-spacing: 0; line-height: 20px; text-align: -webkit-left'>
      <div class='contenido1'>
      </div>
      <p>$ ` + (total_de_la_compra + (total_de_la_compra * 0.16)) + `</p>
    </div>
    </div>
    </div>
    </section>
    
    
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
          <a href='#'><img src='` + process.env.BACK_LINK + `/recursos/Facebook.png' alt='facebook'></a>
          <a href='#'><img src='` + process.env.BACK_LINK + `/recursos/Youtube.png' alt='youtube'></a>
          <a href='#'><img src='` + process.env.BACK_LINK + `/recursos/LinkedIn.png' alt='linkedin'></a>
          <a href='#'><img src='` + process.env.BACK_LINK + `/recursos/Instagram.png' alt='instagram'></a>
        </div>
      </section>
    
    
    
      <!-- Footer legal -->
    
      <section class='ft-legal'>
    <ul style=' width: 100%;
      flex-wrap: wrap;'>
      <ul class='ft-legal-list' style='list-style:none !important;'>
         <center><li>&copy; 2022 Dilesa. Todos Los Derechos Reservados.</li></center>
        </ul>
      </section>
    </footer>
    
      
    </body>
    </html>
    
    `
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