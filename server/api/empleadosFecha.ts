import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


interface Event {
  fecha: string;
}
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
  const [horas, minutos, segundos] = tiempo.split(":").map(Number);
  return horas * 3600 + minutos * 60 + segundos;
}

// Función para convertir segundos a una cadena de tiempo "hh:mm:ss"
function segundosATiempo(segundos: number): string {
  const horas = Math.floor(segundos / 3600);
  segundos %= 3600;
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;

  return `${horas.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}:${segundosRestantes.toString().padStart(2, "0")}`;
}

// Función para calcular el total de horas trabajadas a partir de una lista de diferencias horarias
function calcularTotalHorasTrabajadas(diferencias: string[]): string {
  let totalSegundos = 0;

  for (const diferencia of diferencias) {
    totalSegundos += tiempoASegundos(diferencia);
  }

  return segundosATiempo(totalSegundos);
}



export default defineEventHandler(async (event) => {
  try {

    const eventDate:Event = await readBody(event);

    console.log("EVENT DATE FECHA",eventDate.fecha.split("T")[0]);
    //const fechatest = "2025-02-23";

    const empleadoshoy = (await prisma.$queryRawUnsafe<[]>(
      `SELECT * FROM ConsultarEmpleadosPorFecha('${eventDate.fecha.split("T")[0]}')`
    )) as [];

    console.log("EMPLEADOS HOY",empleadoshoy);
    
    empleadoshoy.forEach((empleado) => {
      //@ts-ignore
      const fecha = empleado.fecha;
      const fechaISO = fecha instanceof Date ? fecha.toISOString() : fecha;
      const fecha2 = fechaISO.split("T")[0];
      //@ts-ignore
      empleado.fecha = fecha2;

      //@ts-ignore
      const entradaHora = empleado.hora_entrada;
      const horaISO =
        entradaHora instanceof Date ? entradaHora.toISOString() : entradaHora;
      const hora = horaISO.split("T")[1].split(".")[0];
      //@ts-ignore
      empleado.hora_entrada = hora;
      //@ts-ignore
      const salidaHora = empleado.hora_salida;
      if (salidaHora !== null) {
        //@ts-ignore
        const horaISO2 =
          salidaHora instanceof Date ? salidaHora.toISOString() : salidaHora;
        const hora2 = horaISO2.split("T")[1].split(".")[0];
        //@ts-ignore
        empleado.hora_salida = hora2;

        // Calcular horas trabajadas
        
        const horasTrabajadas = calcularDiferenciaHoras(hora, hora2);

        //@ts-ignore
        empleado.horas_trabajadas = horasTrabajadas;
        

      } else {
        //@ts-ignore
        empleado.hora_salida = "No ha salido";
        //@ts-ignore
        empleado.horas_trabajadas = "0.00"; // Si no ha salido, horas trabajadas es 0
      }
    });


    const empleadosCQ: any[] = [];
    const empleadosAZ: any[] = [];

    empleadoshoy.forEach((empleado) => {
      //@ts-ignore
      if (empleado.sede === 'CQ') {
      empleadosCQ.push(empleado);
      } else {
      empleadosAZ.push(empleado);
      }
    });
    
    return {empleadosCQ, empleadosAZ};
  } catch (error) {
    console.error("Error executing query:", error);
    return { error: "Error executing query" };
  } finally {
    await prisma.$disconnect();
  }
});
