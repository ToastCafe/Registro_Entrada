<script setup lang="ts">


const toast = useToast()

const cedula = ref('');
const nombre = ref('');
const apellido1 = ref('');
const apellido2 = ref('');
const telefono = ref('');
const correo = ref('');

const colorCedula = ref('blue');
const colorNombre = ref('blue');
const colorApellido1 = ref('blue');
const colorApellido2 = ref('blue');
const colorTelefono = ref('blue');
const colorCorreo = ref('blue');
const colorSede = ref('blue');

const colors = [colorCedula, colorNombre, colorApellido1, colorApellido2, colorTelefono, colorCorreo]
const values = [cedula, nombre, apellido1, apellido2, telefono, correo]
const sedes = ['Ciudad Quesada', 'Aguas Zarcas']

const sede = ref('')



// Función para agregar un empleado

const agregar_empleado = async () => {
  // Emitir el nuevo empleado al componente padre


  for (let i = 0; i < colors.length; i++) {
    colors[i].value = 'blue'
  }
  if (sede.value == '') {
    colorSede.value = 'red'
    toast.add({
      title: 'Sede vacía',
      description: 'Por favor seleccione la sede',
      color: 'red'
    })
    return
  }

  if (cedula.value == '') {
    colorCedula.value = 'red'
    toast.add({
      title: 'Cédula vacía',
      description: 'Por favor ingrese la cédula',
      color: 'red'
    })
    return
  }
  if (nombre.value == '') {
    colorNombre.value = 'red'
    toast.add({
      title: 'Nombre vacío',
      description: 'Por favor ingrese el nombre',
      color: 'red'
    })
    return
  }
  if (apellido1.value == '') {
    colorApellido1.value = 'red'
    toast.add({
      title: 'Primer apeliido vacío',
      description: 'Por favor ingrese el primer apellido',
      color: 'red'
    })
    return
  }
  if (apellido2.value == '') {
    colorApellido2.value = 'red'
    toast.add({
      title: 'Segundo apellido vacío',
      description: 'Por favor ingrese el segundo apellido',
      color: 'red'
    })
    return
  }
  if (correo.value == '') {
    colorCorreo.value = 'red'
    toast.add({
      title: 'Correo vacío',
      description: 'Por favor ingrese el correo',
      color: 'red'
    })
    return
  }
  if (telefono.value == '') {
    colorTelefono.value = 'red'
    toast.add({
      title: 'Teléfono vacío',
      description: 'Por favor ingrese el teléfono',
      color: 'red'
    })
    return
  }


  const res = await fetch('/api/agregarEmpleado', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cedula: cedula.value,
      nombre: nombre.value,
      apellido1: apellido1.value,
      apellido2: apellido2.value,
      telefono: telefono.value,
      correo: correo.value,
      sede: sede.value
    })
  })

  const data = await res.json()
  console.log(data.message)
  if (data.message === "Empleado agregado") {
    toast.add({
      title: 'Empleado agregado',
      description: 'El empleado ha sido agregado exitosamente',
      color: 'green'
    })
    for (let i = 0; i < values.length; i++) {
      values[i].value = ''
    }
    sede.value = ''

  } else {
    colorCedula.value = 'red'
    toast.add({
      title: 'El empleado ya existe',
      description: 'Cedula ya registrada',
      color: 'red'
    })

  }


};
</script>



<template>
  <div class="fixed-container">
    <UFormGroup label="Formulario de Registro" class="mb-40">
      <div class="mb-6 relative w-full max-w-md">
        <USelect v-model="sede" :options="sedes" placeholder="Seleccione la sede" class="text-black text-xl"
          :color="colorSede" />
      </div>
      <div class="space-y-6 ">
        <div class="relative w-full max-w-md">
          <UInput v-model="cedula" placeholder="Cédula" required class="text-black text-xl" :color="colorCedula" />
        </div>
        <div class="relative w-full max-w-md">
          <UInput v-model="nombre" placeholder="Nombre" required class="text-black text-xl" :color="colorNombre" />
        </div>
        <div class="relative w-full max-w-md">
          <UInput v-model="apellido1" placeholder="Primer apellido" required class="text-black text-xl"
            :color="colorApellido1" />
        </div>
        <div class="relative w-full max-w-md">
          <UInput v-model="apellido2" placeholder="Segundo apellido" required class="text-black text-xl"
            :color="colorApellido2" />
        </div>
        <div class="relative w-full max-w-md">
          <UInput v-model="correo" placeholder="Correo" required class="text-black text-xl" :color="colorCorreo" />
        </div>
        <div class="relative w-full max-w-md">
          <UInput v-model="telefono" placeholder="Número de Teléfono" required class="text-black text-xl"
            :color="colorTelefono" />
        </div>

        <div class="relative w-full max-w-md mt-6">
          <UButton @click="agregar_empleado" color="primary" block
            class="bg-blue-500 text-white hover:bg-blue-600 text-xl">
            Agregar Empleado
          </UButton>
        </div>
      </div>
    </UFormGroup>
  </div>
</template>



<style scoped>
body {
  overflow: hidden;
  /* Desactiva el scroll en el body */
}

.fixed-container {
  position: fixed;
  /* Fija el contenedor en la pantalla */
  top: 50%;
  /* Centra verticalmente */
  left: 50%;
  /* Centra horizontalmente */
  transform: translate(-50%, -50%);
  /* Ajusta el centro del contenedor */
  height: auto;
  /* Altura automática */
  width: 100%;
  /* Ancho completo */
  max-width: 400px;
  /* Ancho máximo */
}

/* Estilo para el formulario */
.label-spacing {
  margin-bottom: 0.5rem;
  /* Ajusta el espacio entre el label y el hint */
}
</style>