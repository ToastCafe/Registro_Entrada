import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();



export default defineEventHandler(async () => {
  try {
    const empleadoshoy = (await prisma.$queryRawUnsafe<[]>(
      "SELECT * FROM consultarempleadoshoy()"
    )) as [];

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
        empleado.hora_salida = "No ha salido";
        const horaISO2 =
          salidaHora instanceof Date ? salidaHora.toISOString() : salidaHora;
        const hora2 = horaISO2.split("T")[1].split(".")[0];
        //@ts-ignore
        empleado.hora_salida = hora2;
      }
    });

    //HACER LA LOGICA AQUI 

    return empleadoshoy;
  } catch (error) {
    console.error("Error executing query:", error);
    return { error: "Error executing query" };
  } finally {
    await prisma.$disconnect();
  }
});
