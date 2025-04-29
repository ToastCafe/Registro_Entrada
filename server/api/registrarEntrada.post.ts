import { PrismaClient } from "@prisma/client";
import { toZonedTime } from "date-fns-tz";
import { format } from "date-fns";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const empleadoEvent = await readBody(event);

    const nowUtc = new Date();

    const zonedDate = toZonedTime(nowUtc, "America/Mexico_City");

    const formattedDate = format(zonedDate, "yyyy-MM-dd HH:mm:ss" + "-00:00");

    console.log("Hora local en la zona horaria especificada:", formattedDate);


    const asistencia = await prisma.asistencia2.findFirst({
      where: {
        cedula: empleadoEvent.cedula,
        fecha: formattedDate,
      },
    });

    if (asistencia) {
      await prisma.asistencia2.updateMany({
        where: {
          cedula: empleadoEvent.cedula,
          fecha: formattedDate,
        },
        data: {
          sede: empleadoEvent.sede,
        },
      });
      return { message: "Cambio de sede realizado" };
    }



    await prisma.asistencia2.create({
      data: {
        cedula: empleadoEvent.cedula,
        fecha: formattedDate,
        hora_entrada: formattedDate,
        sede: empleadoEvent.sede,
      },
    });

    const empleado = await prisma.empleados.findMany({
      where: {
        cedula: empleadoEvent.cedula,
      },
    });



    return { message: empleado[0].nombre +" "+ empleado[0].apellido1 };
  } catch (error) {
    console.log("Error executing query", error);
    return { error: "Error executing query" };
  }
});
