import { PrismaClient } from "@prisma/client";
import { toZonedTime } from "date-fns-tz";
import { format } from "date-fns";

const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
  try {
    const cedulaEmpleado = await readBody(event);

    const nowUtc = new Date();

    const zonedDate = toZonedTime(nowUtc, "America/Mexico_City");

    const formattedDate = format(zonedDate, "yyyy-MM-dd HH:mm:ss" + "-00:00");

    console.log("Hora local en la zona horaria especificada:", formattedDate);

    await prisma.asistencia.updateMany({
      where: {
        cedula: cedulaEmpleado.cedula,
        fecha: formattedDate
      },
      data: {
        hora_salida: formattedDate,
      },
    });

    return { message: "Salida registrada" };
  } catch (error) {
    console.error("Error executing query", error);
    return { error: "Error executing query" };
  } finally {
    await prisma.$disconnect();
  }
});
