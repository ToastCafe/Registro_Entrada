import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ExcelJS from "exceljs";
import { Readable } from "stream";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();



function calcularDiferenciaHoras(
  horaEntrada: string,
  horaSalida: string
): string {
  const [hEntrada, mEntrada, sEntrada] = horaEntrada.split(":").map(Number);
  const [hSalida, mSalida, sSalida] = horaSalida.split(":").map(Number);

  const entrada = new Date(0, 0, 0, hEntrada, mEntrada, sEntrada);
  const salida = new Date(0, 0, 0, hSalida, mSalida, sSalida);

  let diferencia = (salida.getTime() - entrada.getTime()) / 1000; // Diferencia en segundos

  const horas = Math.floor(diferencia / 3600);
  diferencia %= 3600;
  const minutos = Math.floor(diferencia / 60);
  const segundos = diferencia % 60;

  return `${horas.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
}

// Función para convertir una cadena de tiempo "hh:mm:ss" a segundos
function tiempoASegundos(tiempo: string): number {
  const [horas, minutos, segundos] = tiempo.split(':').map(Number);
  return horas * 3600 + minutos * 60 + segundos;
}

// Función para convertir segundos a una cadena de tiempo "hh:mm:ss"
function segundosATiempo(segundos: number): string {
  const horas = Math.floor(segundos / 3600);
  segundos %= 3600;
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;

  return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
}

// Función para calcular el total de horas trabajadas a partir de una lista de diferencias horarias
function calcularTotalHorasTrabajadas(diferencias: string[]): string {
  let totalSegundos = 0;

  for (const diferencia of diferencias) {
    totalSegundos += tiempoASegundos(diferencia);
  }

  return segundosATiempo(totalSegundos);
}




export default defineEventHandler(async () => {
  const datosExportadosAExcelCQ = [];
  const datosExportadosAExcelAZ = [];

  try {
    const asistencia = await prisma.asistencia.findMany({
      orderBy:{
        id: "asc"
      }
    });
    const fechas = Array.from(
      new Set(
        asistencia.map(
          (asistencia) => asistencia.fecha.toISOString().split("T")[0]
        )
      )
    );
    const empleados = Array.from(
      new Set(asistencia.map((asistencia) => asistencia.cedula))
    );

    const empleadosInfo = await prisma.empleados.findMany({
      where: {
        cedula: {
          in: empleados,
        },
      },
    });

    console.log("TODOS TODOS TODOS Los empleados son: " + empleadosInfo.map((empleado) => empleado.nombre + " " + empleado.apellido1 + " " + empleado.apellido2));

   
    const encabezado = ["Nombre", ...fechas, "Total de horas"];
    datosExportadosAExcelCQ.push(encabezado);
    datosExportadosAExcelAZ.push(encabezado);

    for (const empleadoActual of empleados) {
      const diasTrabajados = [];
      const horasTrabajadas = [];

      console.log("El empleado actual es: " + empleadoActual + " y trabajó: ");

      for (const registro of asistencia) {
        if (empleadoActual === registro.cedula) {
          const dia = registro.fecha.toISOString().split("T")[0];
          const horaEntrada = registro.hora_entrada
            .toISOString()
            .split("T")[1]
            .split(".")[0];
          const horaSalida = registro.hora_salida
            ?.toISOString()
            .split("T")[1]
            .split(".")[0];
          console.log("Día: ", dia, " trabajado");
          console.log("Hora de entrada: " + horaEntrada);
          console.log("Hora de salida: " + horaSalida);
          const diferenciaHoras = calcularDiferenciaHoras(
            horaEntrada,
            horaSalida || horaEntrada
          );
          horasTrabajadas.push(diferenciaHoras);
          diasTrabajados.push(dia);
        }
      }

      let cont = 0;
      while (cont < fechas.length) {
        if (diasTrabajados[cont] !== fechas[cont]) {
          console.log("El empleado no trabajó el día: " + fechas[cont]);
          horasTrabajadas.splice(cont, 0, "00:00:00");
          diasTrabajados.splice(cont, 0, fechas[cont]);
          cont = 0;
        } else {
          cont++;
        }
      }

      for (const empleadoInfo of empleadosInfo) {
        if (empleadoInfo.cedula === empleadoActual) {
          horasTrabajadas.push(calcularTotalHorasTrabajadas(horasTrabajadas));
          horasTrabajadas.splice(0, 0, empleadoInfo.nombre + " " + empleadoInfo.apellido1 + " " + empleadoInfo.apellido2);
          if (empleadoInfo.sede === "CQ") {
            datosExportadosAExcelCQ.push(horasTrabajadas);
          } else {
            datosExportadosAExcelAZ.push(horasTrabajadas);
          }
          break;
        }
      }
      console.log(horasTrabajadas);
      console.log(fechas);
    }
  } catch (error) {
    console.error("Error executing query:", error);
    return { error: "Error executing query" };
  } finally {
    await prisma.$disconnect();
  }
    
  //: Crear el archivo Excel

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Informe CQ");
  worksheet.addRows(datosExportadosAExcelCQ);
  const excelBuffer = await workbook.xlsx.writeBuffer();
  const readableStream = new Readable();
  readableStream._read = () => {}; // No-op
  readableStream.push(excelBuffer);
  readableStream.push(null); // Indicar el final del stream

  const workbook2 = new ExcelJS.Workbook();
  const worksheet2 = workbook2.addWorksheet("Informe AZ ");
  worksheet2.addRows(datosExportadosAExcelAZ); 
  const excelBuffer2 = await workbook2.xlsx.writeBuffer();
  const readableStream2 = new Readable();
  readableStream2._read = () => {}; // No-op
  readableStream2.push(excelBuffer2);
  readableStream2.push(null); // Indicar el final del stream

  //: Configurar el transporte del correo

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
    subject: "Informe Mensual de las horas trabajadas en locales Toast",
    text: "Informe Mensual de las horas trabajadas ", 
    attachments: [
      {
        filename: "Informe Ciudad Quesada Toast.xlsx",
        content: readableStream,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      {
        filename: "Informe Aguas Zarcas Toast.xlsx",
        content: readableStream2,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
  };

  try {
    // Envía el correo
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado: " + info.response);


    const fecha = new Date();
    //: Limpiar la base de datos
    console.log("Fecha de eliminacion:", fecha);
    //await prisma.$executeRawUnsafe("TRUNCATE TABLE asistencia;");
    //await prisma.$executeRawUnsafe("SELECT setval('asistencia_id_seq', 1, false);");

  } catch (error) {
    console.error("Error al enviar el correo: " + error);
  }
  finally {
    await prisma.$disconnect();
  }

  return { message: "Correo enviado" };
});
