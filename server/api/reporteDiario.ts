import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ExcelJS from "exceljs";
import { Readable } from "stream";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();

interface Empleado {
  id: number;
  cedula: string;
  nombre: string;
  apellido1: string;
  fecha: any;
  hora_entrada: any;
  hora_salida: any;
  sede: string;
}

function convertirFormatoHora24a12(hora24: string) {
  // Divide la cadena de tiempo en horas, minutos y segundos
  const [horas, minutos] = hora24.split(":");

  // Convierte las horas a un número para hacer cálculos
  let horasNumerico = parseInt(horas, 10);
  const esPM = horasNumerico >= 12;

  // Determina AM o PM y ajusta las horas al formato de 12 horas
  const periodo = esPM ? "PM" : "AM";
  horasNumerico = horasNumerico % 12 || 12; // Convierte 0 a 12 para medianoche

  // Formatea y devuelve la nueva cadena de tiempo
  return `${horasNumerico}:${minutos} ${periodo}`;
}




export default defineEventHandler(async () => {
  try {
    /*
    const empleadoshoy = (await prisma.$queryRawUnsafe<Empleado[]>(
      "SELECT * FROM consultarempleadosHoySede()"
    )) as Empleado[];
    */
    /*
   const empleadoshoy = (await prisma.$queryRawUnsafe<Empleado[]>(
     "SELECT * FROM ConsultarEmpleadosPorFecha('2024-09-04');"
   )) as Empleado[];
    */
    const empleadoshoy = (await prisma.$queryRawUnsafe<Empleado[]>(
      "SELECT * FROM ConsultarEmpleadosDiaAnterior();"
    )) as Empleado[];


    const encabezado = ["nombre","hora_entrada","hora_salida","sede"];
    const datosExportadosAExcel: any[] = [];
    const fecha = empleadoshoy[0].fecha.toISOString().split("T")[0];
    datosExportadosAExcel.push(encabezado);


    empleadoshoy.forEach(async (empleado) => {
      const fecha = empleado.fecha;
      const fechaISO = fecha instanceof Date ? fecha.toISOString() : fecha;
      const fecha2 = fechaISO.split("T")[0];

      empleado.fecha = fecha2;
      const entradaHora = empleado.hora_entrada;
      const horaISO =
        entradaHora instanceof Date ? entradaHora.toISOString() : entradaHora;
      const hora = horaISO.split("T")[1].split(".")[0];
      empleado.hora_entrada = hora;
      const salidaHora = empleado.hora_salida;
      if (salidaHora !== null) {
        const horaISO2 =
          salidaHora instanceof Date ? salidaHora.toISOString() : salidaHora;
        const hora2 = horaISO2.split("T")[1].split(".")[0];
        empleado.hora_salida = hora2;

        empleado.hora_entrada = convertirFormatoHora24a12(
          empleado.hora_entrada
        );
        empleado.hora_salida = convertirFormatoHora24a12(empleado.hora_salida);
      } else {
        empleado.hora_entrada = convertirFormatoHora24a12(
          empleado.hora_entrada
        );
        empleado.hora_salida = "No marcó la salida";
      }

      datosExportadosAExcel.push([
        empleado.nombre + " " + empleado.apellido1,
        empleado.hora_entrada,
        empleado.hora_salida,
        empleado.sede,
      ]);
    });

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet("Informe Toast");

// Agregar las filas
worksheet.addRows(datosExportadosAExcel);

// Ajustar el tamaño de las columnas con respecto al contenido
worksheet.columns.forEach((column) => {
    let maxLength = 0;
    //@ts-ignore
    column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value ? cell.value.toString() : "";
        maxLength = Math.max(maxLength, cellValue.length);
    });
    column.width = maxLength + 2; // Añadir un margen para que no quede muy ajustado
});

const excelBuffer = await workbook.xlsx.writeBuffer();
const readableStream = new Readable();
readableStream._read = () => {}; // No-op
readableStream.push(excelBuffer);
readableStream.push(null); // Indicar el final del stream

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CORREO_ENVIANTE,
        pass: process.env.CONTRASENA,
      },
    });

    //: Configurar el correo
    const mailOptions = {
      from: process.env.CORREO_ENVIANTE,
      to: process.env.CORREO_DESTINO,
      subject: "Informe dia: "+ fecha+" de las horas trabajadas en locales Toast",
      text: "Informe diario de las horas trabajadas ",
      attachments: [
        {
          filename: "Informe locales Toast día:"+fecha+".xlsx",
          content: readableStream,
          contentType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado: " + info.response);

    console.log("datosExportadosAExcel", datosExportadosAExcel);
    return empleadoshoy;



  } catch (error) {
    console.error("Error executing query:", error);
    return { error: "Error executing query" };
  } finally {
    await prisma.$disconnect();
  }
});
