const nodemailer = require("nodemailer");
import models from "../models";
const { Op } = require("sequelize");
import { Sequelize } from "sequelize";
const sequelize = new Sequelize(process.env.POSTGRESQL);
import date_and_time from "date-and-time";

// exports.creadaOrden = async function(email, id_usuario_socio, orden){
exports.lineasEntregaEmail = async function (order_id) {
  try {
    var metodo_de_pago;

    //Compra Finalizada order information
    const constCompraFinalizada = await models.CompraFinalizada.findOne({
      where: {
        cf_compra_finalizada_id: order_id,
      },
    });

    //-----------------------------------------------------------------
    // Datos personales
    //Compra Finalizada order information
    const constSociosNegocio = await models.SociosNegocio.findOne({
      where: {
        sn_socios_negocio_id:
          constCompraFinalizada.cf_vendido_a_socio_negocio_id,
      },
    });

    var razon_social = constSociosNegocio.sn_razon_social;
    var correo_facturacion = constSociosNegocio.sn_email_facturacion;
    var cardcode = constSociosNegocio.sn_cardcode;

    //-----------------------------------------------------------------
    //-----------------------------------------------------------------
    //Datos usuario sn venta
    const constSociosNegocioUsuario = await models.SociosNegocioUsuario.findOne({
      where: {
        snu_usuario_snu_id: constCompraFinalizada.cf_snu_usuario_snu_id
      },
    });

    var SociosNegocioUsuarioEmail = constSociosNegocioUsuario.snu_correo_electronico
    //-----------------------------------------------------------------
    // Datos de entrega
    var estadoValor;
    var estadoCodigo;
    var paisValor;
    var direccion;
    var direccionEnvio;
    var colonia;
    var ciudad;
    var codigo_postal;

    //obtener tipo de envio
    const constControlMaestroMultipleTipoEnvio =
      await models.ControlMaestroMultiple.findOne({
        where: {
          cmm_control_id: constCompraFinalizada.cf_cmm_tipo_envio_id,
        },
      });

    var isRecoleccion = false;

    if (constControlMaestroMultipleTipoEnvio.cmm_valor == "Recolección") {
      isRecoleccion = true;

      //Buscar direccion de recoleccion
      const constAlmaceness = await models.Almacenes.findOne({
        where: {
          alm_almacen_id: constCompraFinalizada.cf_alm_almacen_recoleccion,
        },
      });

      //Buscar direccion de envio
      const constRawAlmacenes = await models.RawAlmacenes.findOne({
        where: {
          codigoAlmacen: constAlmaceness.alm_codigoAlmacen,
        },
      });

      const constEstado = await models.Estado.findOne({
        where: {
          estpa_codigo_estado: constRawAlmacenes.estado,
        },
      });

      if (constEstado) {
        estadoValor = constEstado.dataValues.estpa_estado_nombre;
        estadoCodigo = constEstado.dataValues.estpa_codigo_estado;
      }

      const constPais = await models.Pais.findOne({
        where: {
          pais_abreviatura: constRawAlmacenes.pais,
        },
      });

      if (constPais) {
        paisValor = constPais.dataValues.pais_nombre;
      }

      // Set direccion de envio
      direccion = constRawAlmacenes.calle;

      colonia = "Col. " + constRawAlmacenes.colonia;

      ciudad = constRawAlmacenes.ciudad;

      codigo_postal = "Cp. " + constRawAlmacenes.codigoPostal;
    } else {
      //Generar Direccin de envio
      if (constCompraFinalizada.cf_direccion_envio_id) {
        //Buscar direccion de envio
        const constSociosNegocioDirecciones =
          await models.SociosNegocioDirecciones.findOne({
            where: {
              snd_direcciones_id: constCompraFinalizada.cf_direccion_envio_id,
            },
          });

        //Si existe el estado ID
        if (constSociosNegocioDirecciones.snd_estado_id) {
          const constEstado = await models.Estado.findOne({
            where: {
              estpa_estado_pais_id: constSociosNegocioDirecciones.snd_estado_id,
            },
          });

          if (constEstado) {
            estadoValor = constEstado.dataValues.estpa_estado_nombre;
            estadoCodigo = constEstado.dataValues.estpa_codigo_estado;
          }
        }

        //Si existe el pais ID
        if (constSociosNegocioDirecciones.snd_pais_id) {
          const constPais = await models.Pais.findOne({
            where: {
              pais_pais_id: constSociosNegocioDirecciones.snd_pais_id,
            },
          });

          if (constPais) {
            paisValor = constPais.dataValues.pais_nombre;
          }
        }

        // Set direccion de envio
        var constDireccionEnvio = constSociosNegocioDirecciones.dataValues;

        direccion = constDireccionEnvio.snd_direccion;

        if (constDireccionEnvio.snd_colonia) {
          colonia = "Col. " + constDireccionEnvio.snd_colonia;
        }

        if (constDireccionEnvio.snd_ciudad) {
          ciudad = constDireccionEnvio.snd_ciudad;
        }

        if (constDireccionEnvio.snd_codigo_postal) {
          codigo_postal = "Cp. " + constDireccionEnvio.snd_codigo_postal;
        }
      }
    }

    //-----------------------------------------------------------------

    //Metodo de pago
    if (constCompraFinalizada.cf_sap_forma_pago_codigo == "99") {
      metodo_de_pago = "Mi Crédito Con Dielsa";
    } else if (constCompraFinalizada.cf_sap_forma_pago_codigo == "05") {
      metodo_de_pago = "Transferencia Bancaria";
    } else if (constCompraFinalizada.cf_sap_forma_pago_codigo == "04") {
      metodo_de_pago = "Tarjeta De Crédito";
    } else if (constCompraFinalizada.cf_sap_forma_pago_codigo == "28") {
      metodo_de_pago = "Tarjeta De Débito";
    }

    var totalCompra = constCompraFinalizada.cf_total_compra;

    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    totalCompra = formatter.format(totalCompra);

    //-----------------------------------------------------------------
    //Informacion final de pago

    var subTotal = constCompraFinalizada.cf_orden_subtotal;
    var orderIVA = constCompraFinalizada.cf_order_iva;
    var costoEnvio = constCompraFinalizada.cf_orden_gastos_envio;
    var descuentos = constCompraFinalizada.cf_orden_descuento;

    subTotal = formatter.format(subTotal);
    orderIVA = formatter.format(orderIVA);
    costoEnvio = formatter.format(costoEnvio);
    descuentos = formatter.format(descuentos);

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
      tls: { ciphers: "SSLv3" },
      requiresAuth: true,
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      //maxConnections: 10,
      debug: true,
    });

    var htmlBody =
      `
      <!DOCTYPE html>
      <html lang='es'>
      <head>
        <title>Productos en entrega actualizados</title>
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
                  <h1>Tu pedido ha sido entregado</h1>                  
                </div>
              </header>
            
              <div style='padding-top: 20px; color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
                <p>Estimado ` +
      razon_social +
      `.</p>
              </div>

              <div style='color: #000000; font-size: 16px; letter-spacing: 0; line-height: 20px; text-align: -webkit-left'>
                <p>Se ha completado la entrega de algunos artículos de su pedido. Consulte el detalle del correo para más información o si lo prefiere en la sección de <a href="` +
      process.env.STORE_LINK +
      `/myprofile">Mis Pedidos<a>.</p>
              </div>
            
              <div style='color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
                <p>No. de pedido.</p>
              </div>
        
              <div style='color: #40DF00; font-size: 18px; letter-spacing: 0; line-height: 20px; text-align: -webkit-left; padding-bottom: 50px;'>
                <p>` +
      constCompraFinalizada.cf_compra_numero_orden +
      `</p>
              </div>
      
              <section class='datos' style='background: #F5F5F5; padding-top: 30px; padding-left: 50px;'>
                <div style='color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>
                  <p>Datos Personales</p>
                </div>
                <div style='color: #000000; font-size: 16px; letter-spacing: 0; line-height: 20px; text-align: -webkit-left'>
                  <p>` +
      razon_social +
      `</p>
                  <p>` +
      correo_facturacion +
      `</p>
                  <p>` +
      cardcode +
      `</p>
                </div>

                <div style='color: #000000; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify;'>`;

    if (isRecoleccion == true) {
      htmlBody += `
                            <p>Dirección de recolección</p>
                          `;
    } else {
      htmlBody += `
                            <p>Dirección de entrega</p>
                          `;
    }

    htmlBody +=
      ` </div>
                      <div style='color: #000000; font-size: 16px; letter-spacing: 0; line-height: 20px; text-align: -webkit-left'>
                          <p>` +
      direccion +
      `</p>
                          <p>` +
      colonia +
      `</p>
                          <p>` +
      ciudad +
      `</p>
                          <p>` +
      codigo_postal +
      `</p>
                              
                      
                      
                      <div style='padding-right: 15px; padding-bottom: 15px;'>
                        <div style='color: #0B3196; font-size: 18px; font-weight: 600; letter-spacing: 0; line-height: 20px; text-align: justify; margin-bottom: 20px'>
                        `;

    const constProductoCompraFinalizada =
      await models.ProductoCompraFinalizada.findAll({
        where: {
          pcf_cf_compra_finalizada_id: order_id,
        },
        order: [["pcf_fecha_entrega", "ASC"]],
        attributes: [
          "pcf_prod_producto_id",
          "pcf_fecha_entrega",
          "pcf_cantidad_producto",
          "pcf_precio",
          "pcf_producto_compra_finalizada_id",
          "pcf_cantidad_entregada",
        ],
      });

    const ConstCorreos = await models.Correos.findAll({
      where: {
        cor_pcf_cf_compra_finalizada_id: order_id,
        cor_cmm_tipo_correo: 1000192,
      },
    });

    var fecha_actual;

    for (var x = 0; x < constProductoCompraFinalizada.length; x++) {
      for (var f = 0; f < ConstCorreos.length; f++) {
        if (
          constProductoCompraFinalizada[x].dataValues
            .pcf_producto_compra_finalizada_id ==
          ConstCorreos[f].dataValues.cor_pcf_producto_compra_finalizada_id
        ) {
          const constProducto = await models.Producto.findOne({
            where: {
              prod_producto_id:
                constProductoCompraFinalizada[x].dataValues
                  .pcf_prod_producto_id,
            },
            attributes: ["prod_nombre", "prod_nombre_extranjero"],
          });

          const constImagenProducto = await models.ImagenProducto.findOne({
            where: {
              imgprod_prod_producto_id:
                constProductoCompraFinalizada[x].dataValues
                  .pcf_prod_producto_id,
            },
            order: [["imgprod_nombre_archivo", "ASC"]],
          });

          var imagen;
          var prod_nombre = constProducto.prod_nombre;
          var prod_nombre_foraneo = constProducto.prod_nombre_extranjero;
          var cantidad =
            constProductoCompraFinalizada[x].dataValues.pcf_cantidad_entregada;
          var precio = constProductoCompraFinalizada[x].dataValues.pcf_precio;
          precio = formatter.format(precio);

          if (constImagenProducto) {
            imagen = constImagenProducto.imgprod_ruta_archivo;
            imagen = imagen.split("./public");
            imagen = imagen[1];
            imagen = process.env.BACK_LINK + imagen;
          } else {
            imagen =
              "http://wws.com.pa/wp-content/plugins/wordpress-ecommerce/marketpress-includes/images/default-product.png";
          }

          var fecha_temp = date_and_time.format(
            constProductoCompraFinalizada[x].dataValues.pcf_fecha_entrega,
            "YYYY/MM/DD"
          );

          //Para hacer tabla de productos y envios
          if (fecha_actual == fecha_temp) {
            htmlBody += `<p>Entregado el ` + fecha_actual + `</p>`;

            htmlBody +=
              ` 
                                  <div style='color: #444444; vertical-align: top; font-weight: 400; padding: 5px;'>
                                    <div style='width: 15%; display: inline-block; vertical-align: top;'>
                                      <img src='` +
              imagen +
              `' style='width: 100%;' />
                                    </div>
                                    <div style='display: inline-block; width: 70%; margin-left: 5%;'>
                                      <p style='font-size: 18px; line-height: 16px; text-align: justify; margin-top: 0px; margin-bottom: 10px;'>` +
              prod_nombre +
              `</p>
                                      <p style='font-size: 18px; line-height: 16px; text-align: justify; margin-top: 0px; margin-bottom: 10px;'>` +
              prod_nombre_foraneo +
              `</p>
                                      <p style='font-size: 18px; line-height: 16px; text-align: justify; margin-top: 0px; margin-bottom: 10px;'>` +
              cantidad +
              `</p>
                                      <p style='font-size: 18px; line-height: 16px; text-align: justify; margin-top: 0px; margin-bottom: 10px;'>` +
              precio +
              `</p>
                                    </div>
                                  </div>
                                        `;
          } else {
            fecha_actual = fecha_temp;

            if (x != 0) {
              htmlBody += `<hr>`;
            }

            if (isRecoleccion == true) {
              htmlBody += `<p>Recolectar para el día ` + fecha_actual + `</p>`;
            } else {
              htmlBody += `<p>Enviando para el ` + fecha_actual + `</p>`;
            }

            htmlBody +=
              ` <div style='color: #444444; vertical-align: top; font-weight: 400; padding: 5px;'>
                  <div style='width: 15%; display: inline-block; vertical-align: top;'>
                    <img src='` +
              imagen +
              `' style='width: 100%;' />
                  </div>
                  <div style='display: inline-block; width: 70%; margin-left: 5%;'>
                    <p style='font-size: 18px; line-height: 16px; text-align: justify; margin-top: 0px; margin-bottom: 10px;'>` +
              prod_nombre +
              `</p>
                    <p style='font-size: 18px; line-height: 16px; text-align: justify; margin-top: 0px; margin-bottom: 10px;'>` +
              prod_nombre_foraneo +
              `</p>
                    <p style='font-size: 18px; line-height: 16px; text-align: justify; margin-top: 0px; margin-bottom: 10px;'>` +
              cantidad +
              `</p>
                    <p style='font-size: 18px; line-height: 16px; text-align: justify; margin-top: 0px; margin-bottom: 10px;'>` +
              precio +
              `</p>
                  </div>
                </div>`;
          }
        }
      }
    }

    htmlBody +=
      `   </div>
              </div>
            </section>            
          </article>
        </section>
      </section>

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
  </html>`;

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
            "informatica@dielsa.com",
            "oscar.espinosa@daltum.mx"
        ];
    }
    else
    {
        maillist = [
            SociosNegocioUsuarioEmail
        ];
    }

    
    // Definimos el email
    const mailOptions = {
      from: "no-responder@dielsa.com",
      to: maillist,
      // to: constSociosNegocio.sn_email_facturacion,
      subject: "Productos en entrega actualizados",
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
  } catch (e) {
    console.log(e);
    next(e);
  }
};
