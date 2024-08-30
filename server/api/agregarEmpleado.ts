
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Empleado {
  cedula: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  telefono: string;
  correo: string;
  sede: string;
}

export default defineEventHandler(async (event) => {
  try{

    const empleado: Empleado = await readBody(event)
    console.log(empleado)

    if (empleado.sede === "Aguas Zarcas") {
      empleado.sede = "AZ"
    }else if(empleado.sede === "Ciudad Quesada"){
      empleado.sede = "CQ"
    }else{
      empleado.sede = "ADMIN"
    }

    await prisma.empleados.create({
      data: {
        cedula: empleado.cedula,
        nombre: empleado.nombre,
        apellido1: empleado.apellido1,
        apellido2: empleado.apellido2,
        telefono: empleado.telefono,
        correo: empleado.correo,
        sede: empleado.sede
      }
    })
    return { message: "Empleado agregado" }

  }catch(error){
    console.error("Error executing query:", error)
    return { message: "error" }
  } finally {
    await prisma.$disconnect()
  }


})
