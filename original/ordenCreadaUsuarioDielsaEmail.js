const nodemailer = require('nodemailer');
import models from '../models';
const { Op } = require("sequelize");
import {  Sequelize } from 'sequelize';
const sequelize = new Sequelize(process.env.POSTGRESQL);
import date_and_time from 'date-and-time';


// exports.creadaOrden = async function(email, id_usuario_socio, orden){
exports.ordenCreadaUsuarioDielsaEmail = async function(order_id)
{

  try
  {
    var metodo_de_pago

    //Compra Finalizada order information
    const constCompraFinalizada = await models.CompraFinalizada.findOne({
      where: {
        cf_compra_finalizada_id: order_id
      }
    });


    //-----------------------------------------------------------------
    // Datos personales
    //Compra Finalizada order information
    const constSociosNegocio = await models.SociosNegocio.findOne({
      where: {
        sn_socios_negocio_id: constCompraFinalizada.cf_vendido_a_socio_negocio_id
      }
    });

    var razon_social = constSociosNegocio.sn_razon_social
    var correo_facturacion = constSociosNegocio.sn_email_facturacion
    var cardcode = constSociosNegocio.sn_cardcode


    //-----------------------------------------------------------------
    // Datos de entrega
    var estadoValor
    var estadoCodigo
    var paisValor
    var direccion
    var direccionEnvio
    var colonia
    var ciudad
    var codigo_postal


    //obtener tipo de envio
    const constControlMaestroMultipleTipoEnvio = await models.ControlMaestroMultiple.findOne(
    {
        where: {
          cmm_control_id: constCompraFinalizada.cf_cmm_tipo_envio_id
        }
    })

    var isRecoleccion = false

    if(constControlMaestroMultipleTipoEnvio.cmm_valor == "Recolección")
    {
      isRecoleccion = true

      //Buscar direccion de recoleccion
      const constAlmaceness = await models.Almacenes.findOne(
      {
          where: {
              alm_almacen_id: constCompraFinalizada.cf_alm_almacen_recoleccion
          }
      })

      //Buscar direccion de envio
      const constRawAlmacenes = await models.RawAlmacenes.findOne(
      {
        where: {
            codigoAlmacen: constAlmaceness.alm_codigoAlmacen
        }
      })

      const constEstado = await models.Estado.findOne(
      {
        where: {
            estpa_codigo_estado: constRawAlmacenes.estado
        }
      });

      if(constEstado)
      {
        estadoValor = constEstado.dataValues.estpa_estado_nombre
        estadoCodigo = constEstado.dataValues.estpa_codigo_estado
      }



      const constPais = await models.Pais.findOne(
      {
          where: {
              pais_abreviatura: constRawAlmacenes.pais
          }
      });

      if(constPais)
      {
        paisValor = constPais.dataValues.pais_nombre
      }

      console.log(66564)

      // Set direccion de envio
      direccion = constRawAlmacenes.calle

      colonia =  "Col. "+ constRawAlmacenes.colonia

      console.log(455454)

      ciudad = constRawAlmacenes.ciudad

      codigo_postal = "Cp. " + constRawAlmacenes.codigoPostal
      console.log(8923489342)
    }
    else
    {
      //Generar Direccin de envio
      if(constCompraFinalizada.cf_direccion_envio_id)
      {
        //Buscar direccion de envio
        const constSociosNegocioDirecciones = await models.SociosNegocioDirecciones.findOne(
        {
            where: {
                snd_direcciones_id: constCompraFinalizada.cf_direccion_envio_id
            }
        })

        //Si existe el estado ID
        if(constSociosNegocioDirecciones.snd_estado_id)
        {

            const constEstado = await models.Estado.findOne(
            {
                where: {
                    estpa_estado_pais_id: constSociosNegocioDirecciones.snd_estado_id
                }
            });

            if(constEstado)
            {
                estadoValor = constEstado.dataValues.estpa_estado_nombre
                estadoCodigo = constEstado.dataValues.estpa_codigo_estado
            }
        }

        //Si existe el pais ID
        if(constSociosNegocioDirecciones.snd_pais_id)
        {

            const constPais = await models.Pais.findOne(
            {
                where: {
                    pais_pais_id: constSociosNegocioDirecciones.snd_pais_id
                }
            });

            if(constPais)
            {
                paisValor = constPais.dataValues.pais_nombre
            }
        }
        



        // Set direccion de envio
        var constDireccionEnvio = constSociosNegocioDirecciones.dataValues

        direccion = constDireccionEnvio.snd_direccion

        if(constDireccionEnvio.snd_colonia)
        {
            colonia =  "Col. "+ constDireccionEnvio.snd_colonia
        }

        if(constDireccionEnvio.snd_ciudad)
        {
            ciudad = constDireccionEnvio.snd_ciudad
        }

        if(constDireccionEnvio.snd_codigo_postal)
        {
            codigo_postal = "Cp. " + constDireccionEnvio.snd_codigo_postal
        }
      }
    }

    //-----------------------------------------------------------------

    //Metodo de pago
    if(constCompraFinalizada.cf_sap_forma_pago_codigo == "99"){
      metodo_de_pago = 'Mi Credito Con Dielsa'
    }
    else if(constCompraFinalizada.cf_sap_forma_pago_codigo == "05"){
      metodo_de_pago = 'Transferencia Bancaria'
    }
    else if(constCompraFinalizada.cf_sap_forma_pago_codigo == "04"){
      metodo_de_pago = 'Tarjeta De Crédito'
    }
    else if(constCompraFinalizada.cf_sap_forma_pago_codigo == "28"){
      metodo_de_pago = 'Tarjeta De Débito'
    }

    var totalCompra = constCompraFinalizada.cf_total_compra


    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });


    totalCompra = formatter.format(totalCompra)

    //-----------------------------------------------------------------
    //Informacion final de pago


    var subTotal = constCompraFinalizada.cf_orden_subtotal
    var orderIVA = constCompraFinalizada.cf_order_iva
    var costoEnvio = constCompraFinalizada.cf_orden_gastos_envio
    var descuentos = constCompraFinalizada.cf_orden_descuento

    subTotal = formatter.format(subTotal)
    orderIVA = formatter.format(orderIVA)
    costoEnvio = formatter.format(costoEnvio)
    descuentos = formatter.format(descuentos)


    //-----------------------------------------------------------------
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


      var htmlBody = `
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
              
             <center><img src='logos.png' / style='padding-top: 40px;'></center>

        </div>

        </header></header><!-- / #main-header -->

        <section style='background: white; width: 90%; max-width: 800px; margin: 20px auto; text-align: -webkit-center;'>
        <section id='main-content'>
        
        
        <article>
        <header>
        <div style='width: 500px; color: #0B3196; font-size: 28px; font-weight: 500; letter-spacing: 0; line-height: 16px;'>
        <div class='bienvenido'>
        
              
          <h1>Se ha generado un nuevo pedido</h1>
        </div>
        </header>
            
        <center><img src='pagoc.png' / style='width: 600px;'></center>
        <div style='padding-top: 50px; color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
        <div class='contenido'>
        </div>
        
        <p>Pedido nuevo.</p>
            

        </div>
        <div style='color: #000000; font-size: 16px; letter-spacing: 0; line-height: 20px; text-align: -webkit-left'>
        <div class='contenido1'>
        </div>

        `;

            if(constCompraFinalizada.cf_compra_numero_orden)
            {
              htmlBody += `<p>Número de pedido en MXN: `+constCompraFinalizada.cf_compra_numero_orden+`</p>`
            }

            if(constCompraFinalizada.cf_compra_numero_orden)
            {
              htmlBody += `<p>Número de pedido en USD: `+constCompraFinalizada.cf_orden_dividida_sap+`</p>`
            }



              







      htmlBody += `
      <div style='color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
        <div class='contenido'>
        </div>

        </div>
        <div style='color: #40DF00; font-size: 18px; letter-spacing: 0; line-height: 20px; text-align: -webkit-left; padding-bottom: 50px;'>
        <div class='contenido1'>
        </div>

            </div>
      </div>

        <section class='datos' style='background: #F5F5F5; padding-top: 30px; padding-left: 50px;'>

      <div style='color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
        <div class='contenidos'>
        </div>
        
        <p>Datos Personales</p>
            

        </div>
        <div style='color: #000000; font-size: 16px; letter-spacing: 0; line-height: 20px; text-align: -webkit-left'>
          <div class='contenido1'>
          </div>
              <p>`+razon_social+`</p>
              <p>`+correo_facturacion+`</p>
              <p>`+cardcode+`</p>

        <div style='color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
          <div class='contenidos'>
          </div>
          `;

            if(isRecoleccion == true)
            {
              htmlBody += `
                <p>Dirección de recolección</p>
              `
            }
            else
            {
              htmlBody += `
                <p>Dirección de entrega</p>
              `
            }

          htmlBody += `</div>
          <div style='color: #000000; font-size: 16px; letter-spacing: 0; line-height: 20px; text-align: -webkit-left'>
            <div class='contenido1'>
            </div>
              <p>`+direccion+`</p>
              <p>`+colonia+`</p>
              <p>`+ciudad+`</p>
              <p>`+codigo_postal+`</p>
                  
            <div style='color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
            <div class='contenidos'>
            </div>
            
            <p>Metodo del pago</p>
                

            </div>
            <div style='color: #000000; font-size: 16px; letter-spacing: 0; line-height: 20px; text-align: -webkit-left'>
              <div class='contenido1'>
              </div>
                  <p>`+metodo_de_pago+`</p>
                  <p>Por la cantidad de `+totalCompra+`</p>

              <div style='color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
                <div class='contenidos'>
                </div>
                  

              </div>
              <div style='color: #000000; font-size: 16px; letter-spacing: 0; line-height: 20px; padding-bottom: 50px; text-align: -webkit-left'>
                <div class='contenido1'>
                </div>
                      <p>¡Gracias por comprar con nosotros!</p>
              </div>
              <div style='border-bottom: 1px solid #000; padding-right: 15px;'>
                <div style='color: #0B3196; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
                <div class='contenidos'>
                </div>`;
          









        const constProductoCompraFinalizada= await models.ProductoCompraFinalizada.findAll({
            where: {
                pcf_cf_compra_finalizada_id: order_id
            },
            order: [
                ['pcf_fecha_entrega', 'ASC']
            ],
            attributes: ["pcf_prod_producto_id", "pcf_fecha_entrega", "pcf_cantidad_producto", "pcf_precio"]
        })

        var fecha_actual
        for (var x = 0; x < constProductoCompraFinalizada.length; x++) 
        {
            const constProducto = await models.Producto.findOne({
                where: {
                    prod_producto_id: constProductoCompraFinalizada[x].dataValues.pcf_prod_producto_id
                },
                attributes: ["prod_nombre", "prod_nombre_extranjero"]
            })

            const constImagenProducto = await models.ImagenProducto.findOne({
                where: {
                    imgprod_prod_producto_id: constProductoCompraFinalizada[x].dataValues.pcf_prod_producto_id
                },
                order: [
                    ['imgprod_nombre_archivo', 'ASC']
                ]
            })

            var imagen
            var prod_nombre = constProducto.prod_nombre
            var prod_nombre_foraneo = constProducto.prod_nombre_extranjero
            var cantidad = constProductoCompraFinalizada[x].dataValues.pcf_cantidad_producto
            var precio = constProductoCompraFinalizada[x].dataValues.pcf_precio
            precio = formatter.format(precio)
            
            if(constImagenProducto)
            {
                imagen = constImagenProducto.imgprod_ruta_archivo
                imagen = imagen.split("./public")
                imagen = imagen[1]
                imagen = process.env.BACK_LINK + imagen
            }
            else
            {
                imagen = "http://wws.com.pa/wp-content/plugins/wordpress-ecommerce/marketpress-includes/images/default-product.png"
            }



            var fecha_temp = date_and_time.format(constProductoCompraFinalizada[x].dataValues.pcf_fecha_entrega, 'YYYY/MM/DD');





            //Para hacer tabla de productos y envios
            if(fecha_actual == fecha_temp)
            {
                console.log(constProductoCompraFinalizada[x].dataValues.pcf_prod_producto_id)



                htmlBody += `
                      <div style='color: #444444; vertical-align: top; font-weight: 400; padding: 5px;'>
                        <div style='width: 15%; display: inline-block; vertical-align: top;'>
                          <img src='`+imagen+`' style='width: 100%;' />
                        </div>
                        <div style='display: inline-block; width: 70%; margin-left: 5%;'>
                          <p style='font-size: 18px; line-height: 16px; text-align: justify; margin-top: 0px; margin-bottom: 10px;'>`+prod_nombre+`</p>
                          <p style='font-size: 18px; line-height: 16px; text-align: justify; margin-top: 0px; margin-bottom: 10px;'>[`+prod_nombre_foraneo+`]</p>
                          <p style='font-size: 18px; line-height: 16px; text-align: justify; margin-top: 0px; margin-bottom: 10px;'>`+cantidad+` piezas</p>
                          <p style='font-size: 18px; line-height: 16px; text-align: justify; margin-top: 0px; margin-bottom: 10px;'>`+precio+`</p>
                        </div>
                      </div>
                `;








            }
            else
            {
                fecha_actual = fecha_temp

                if(x != 0)
                {
                    htmlBody += `<hr>`;
                }




                



                if(isRecoleccion == true)
                {
                  htmlBody += `<p>Recolectar para el dia `+fecha_actual+`</p>`;
                }
                else
                {
                  htmlBody += `<p>Enviando para el `+fecha_actual+`</p>`;
                }




                htmlBody += `
                  <div style='color: #444444; vertical-align: top; font-weight: 400; padding: 5px;'>
                    <div style='width: 15%; display: inline-block; vertical-align: top;'>
                      <img src='`+imagen+`' style='width: 100%;' />
                    </div>
                    <div style='display: inline-block; width: 70%; margin-left: 5%;'>
                      <p style='font-size: 18px; line-height: 16px; text-align: justify; margin-top: 0px; margin-bottom: 10px;'>`+prod_nombre+`</p>
                      <p style='font-size: 18px; line-height: 16px; text-align: justify; margin-top: 0px; margin-bottom: 10px;'>[`+prod_nombre_foraneo+`]</p>
                      <p style='font-size: 18px; line-height: 16px; text-align: justify; margin-top: 0px; margin-bottom: 10px;'>`+cantidad+` piezas</p>
                      <p style='font-size: 18px; line-height: 16px; text-align: justify; margin-top: 0px; margin-bottom: 10px;'>`+precio+`</p>
                    </div>
                  </div>
                `;
            }
        }



          htmlBody += `</div>
                            </div>
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
                              <p>`+subTotal+`</p>

                      <div style='color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
                        <div class='contenidos'>
                        </div>
                        
                        <p>Gastos de envío</p>
                            

                        </div>
                        <div style='color: #000000; font-size: 16px; letter-spacing: 0; line-height: 20px; text-align: -webkit-left'>
                        <div class='contenido1'>
                        </div>
                              <p>`+costoEnvio+`</p>
                              
                      <div style='color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
                        <div class='contenidos'>
                        </div>
                        
                        <p>Descuento</p>
                            

                        </div>
                        <div style='color: #000000; font-size: 16px; letter-spacing: 0; line-height: 20px; text-align: -webkit-left'>
                        <div class='contenido1'>
                        </div>
                              <p>`+descuentos+`</p>
                      <div style='color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
                        <div class='contenidos'>
                        </div>
                        
                        <p>IVA 16%</p>
                            

                        </div>
                        <div style='color: #000000; font-size: 16px; letter-spacing: 0; line-height: 20px; padding-bottom: 50px; text-align: -webkit-left'>
                        <div class='contenido1'>
                        </div>
                              <p>`+orderIVA+`</p>
                      <div style='color: #000000; font-size: 24px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
                        <div class='contenidos'>
                        </div>
                        
                        <p>Total</p>
                            

                        </div>
                        <div style='color: #000000; font-size: 19px; letter-spacing: 0; line-height: 20px; text-align: -webkit-left'>
                        <div class='contenido1'>
                        </div>
                              <p>`+totalCompra+`</p>
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
                        <ul>
                           <li><a style='color:white; font-size: 14px;'><a class='colores' href='mailto:contacto@dielsa.com' style='color:white; font-size: 14px;'>Correo: contacto@dielsa.com</a></li>
                          </ul>
                      </div>
                          <div class='ft-main-item'>
                            <h2 class='ft-title' style='color: #FFFFFF; font-size: 16px; font-weight: 500; letter-spacing: 0; line-height: 16px; text-align: justify;'>
                           DIELSA Monterrey</h2>
                      </h2>
                            <ul>
                       
                           <li><a class='colores' style='color:white; font-size: 14px;' href='mailto:contacto@dielsa.com'>Oscar Wilde No. 143 <br>Col. San Jerónimo, Monterrey, N.L. <br>C.P. 64640 Tel. (81) 4739 36 08</a></li>
                          
                            </ul>
                          </div>
                          <div class='ft-main-item'>
                            <h2 class='ft-title' style='color: #FFFFFF; font-size: 16px; font-weight: 500; letter-spacing: 0; line-height: 16px; text-align: justify;'>
                           DIELSA Ciudad de México</h2>
                      </h2>
                            <ul>
                             <li><a class='colores' style='color:white; font-size: 14px;' href='mailto:contacto@dielsa.com'>Benito Juárez No. 19 <br>Col. Lazaro Cardenas Estado de México, Naucalpan de Juárez <br>C.P. 53560 Tel. (55) 5353 3474</a></li>
                            </ul>
                          </div>
                      <div class='social'>
                          <a href='#'><img src='img/facebook.png' alt='facebook'></a>
                          <a href='#'><img src='img/youtube.png' alt='youtube'></a>
                          <a href='#'><img src='img/linkedin.png' alt='linkedin'></a>
                          <a href='#'><img src='img/instagram.png' alt='instagram'></a>
                          </div>
                        </section>



                        <!-- Footer legal -->

                        <section class='ft-legal'>
                      <ul style=' width: 100%;
                        flex-wrap: wrap;'>
                          <ul class='ft-legal-list'>
                           <center><li>&copy; 2022 Dilesa. Todos Los Derechos Reservados.</li></center>
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
      subject: 'Pago aceptado',
      html: htmlBody
    };


    // Enviamos el email
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
          console.log('Error', err);
      } else {
          console.log('GOOD JOB', data);
      }
    });


    // Definimos el email
    const mailOptions2 = {
      from: "no-responder@dielsa.com",
      to: "gabriel@puntocommerce.com",
      subject: 'Pago aceptado',
      html: htmlBody
    };


    // Enviamos el email
    transporter.sendMail(mailOptions2, (err, data) => {
      if (err) {
          console.log('Error', err);
      } else {
          console.log('GOOD JOB', data);
      }
    });

  }
  catch(e){
    console.log(e)
    next(e);
  }


};