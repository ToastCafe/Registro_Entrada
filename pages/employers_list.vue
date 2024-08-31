<script setup lang="ts">

import { ref } from 'vue'



const tableConfig = {
  wrapper: 'relative overflow-x-auto bg-white border border-gray-300', // Fondo blanco y borde gris claro para el contenedor
  base: 'min-w-full table-fixed border-collapse', // Border-collapse para compartir bordes
  divide: 'divide-y divide-gray-200 dark:divide-gray-700', // Líneas divisorias grises
  thead: 'relative bg-gray-800 border-b border-gray-300', // Fondo oscuro para el encabezado con borde inferior gris claro
  tbody: 'divide-y divide-gray-200 dark:divide-gray-800', // Líneas divisorias grises en el cuerpo
  caption: 'sr-only',
  tr: {
    base: 'border-b border-gray-200 dark:border-gray-700', // Borde inferior gris claro para cada fila
    selected: 'bg-gray-100 dark:bg-gray-800/50', // Fondo gris claro para filas seleccionadas
    active: 'hover:bg-gray-100 dark:hover:bg-gray-800/50 cursor-pointer', // Fondo gris claro al pasar el cursor
  },
  th: {
    base: 'text-left rtl:text-right border border-gray-300', // Borde alrededor de las celdas del encabezado
    padding: 'px-4 py-3.5',
    color: 'text-white', // Texto blanco para el encabezado
    font: 'font-semibold',
    size: 'text-sm',
    bg: 'bg-gray-800' // Fondo gris oscuro para el encabezado
  },
  td: {
    base: 'whitespace-nowrap border border-gray-300', // Borde alrededor de las celdas del cuerpo
    padding: 'px-4 py-4',
    color: 'text-gray-900 dark:text-gray-400', // Texto gris oscuro para el cuerpo
    font: '',
    size: 'text-sm',
    bg: 'bg-white' // Fondo blanco para las celdas del cuerpo
  },
  checkbox: {
    padding: 'ps-4',
  },
  loadingState: {
    wrapper: 'flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14',
    label: 'text-sm text-center text-gray-900 dark:text-white',
    icon: 'w-6 h-6 mx-auto text-gray-400 dark:text-gray-500 mb-4 animate-spin',
  },
  emptyState: {
    wrapper: 'flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14',
    label: 'text-sm text-center text-gray-900 dark:text-white',
    icon: 'w-6 h-6 mx-auto text-gray-400 dark:text-gray-500 mb-4',
  },
  progress: {
    wrapper: 'absolute inset-x-0 -bottom-[0.5px] p-0',
  },
  default: {
    sortAscIcon: 'i-heroicons-bars-arrow-up-20-solid',
    sortDescIcon: 'i-heroicons-bars-arrow-down-20-solid',
    sortButton: {
      icon: 'i-heroicons-arrows-up-down-20-solid',
      trailing: true,
      square: true,
      color: 'gray',
      variant: 'ghost',
      class: '-m-1.5',
    },
    checkbox: {
      color: 'primary',
    },
    progress: {
      color: 'primary',
      animation: 'carousel',
    },
    loadingState: {
      icon: 'i-heroicons-arrow-path-20-solid',
      label: 'Loading...',
    },
    emptyState: {
      icon: 'i-heroicons-circle-stack-20-solid',
      label: 'No hay empleados registrados actualmente',
    },
  },
};


const columns = [{
  key: 'cedula',
  label: 'Cedula'
}, {
  key: 'nombre',
  label: 'Nombre'
}, {
  key: 'hora_entrada',
  label: 'Hora de entrada'
}, {
  key: 'hora_salida',
  label: 'Hora de salida'
}, {
  key: 'marcar_salida',
  label: 'Marcar salida'
}]

const empleados = ref<empleado[]>([
]);

interface empleado {
  cedula: number
  nombre: string
  apellido1: string
  hora_entrada: string
  hora_salida: string
  hora_entrada_almuerzo: string
  hora_salida_almuerzo: string
  class: string
}








const registrar_entrada = async () => {

  const res = await fetch('/api/registrarEntrada', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cedula: cedulaInput.value
    })
  })
  cargando.value = true
  const data = await res.json()
  console.log(data)
  if (!data.error) {
    await obtener_empleados()
    toast.add({
      title: 'Bienvenido! ' + empleados.value[empleados.value.length - 1].nombre,
    })
    errorCedula.value = 'blue'
    isOpen.value = false
    cedulaInput.value = ''
  }
  else {
    errorCedula.value = 'red'
    cargando.value = false
  }

}

function convertirFormatoHora24a12(hora24: string) {
  // Divide la cadena de tiempo en horas, minutos y segundos
  const [horas, minutos] = hora24.split(':');

  // Convierte las horas a un número para hacer cálculos
  let horasNumerico = parseInt(horas, 10);
  const esPM = horasNumerico >= 12;

  // Determina AM o PM y ajusta las horas al formato de 12 horas
  const periodo = esPM ? 'PM' : 'AM';
  horasNumerico = horasNumerico % 12 || 12; // Convierte 0 a 12 para medianoche

  // Formatea y devuelve la nueva cadena de tiempo
  return `${horasNumerico}:${minutos} ${periodo}`;
}



const obtener_empleados = async () => {

  try {
    const res = await fetch('/api/empleadosHoy')
    const data = await res.json()

    data.forEach((empleado: empleado) => {

      empleado.nombre = empleado.nombre + ' ' + empleado.apellido1

      empleado.hora_entrada = convertirFormatoHora24a12(empleado.hora_entrada)
      if (empleado.hora_salida !== null) {
        empleado.class = 'bg-green-200 '
        empleado.hora_salida = convertirFormatoHora24a12(empleado.hora_salida)
      }
      else {
        empleado.class = 'bg-orange-200'
        empleado.hora_salida = 'En trabajo'
        return
      }
      if (empleado.hora_entrada_almuerzo === null ){
        empleado.hora_entrada_almuerzo = 'En trabajo'
        empleado.class = 'bg-orange-200'
      }
      if (empleado.hora_salida_almuerzo === null || empleado.hora_entrada_almuerzo !== null){
        empleado.hora_salida = 'En almuerzo'
        empleado.class = 'bg-blue-600'
      }
    })
    empleados.value = data
    console.log(data)
    cargando.value = false

  } catch (error) {
    console.log("error")
  }
}



const marcar_salida = async (row: empleado) => {

  cargando.value = true
  console.log(row)
  const res = await fetch('/api/marcarSalida', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cedula: row.cedula,
    })
  })
  const data = await res.json()
  console.log(data)
  await obtener_empleados()
  cargando.value = false
}

const cerrar_modal = async () => {
  isOpen.value = false
  cedulaInput.value = ''
  errorCedula.value = 'blue'
}


const cargando = ref(true)
const isOpen = ref(false)
const cedulaInput = ref('')
const toast = useToast()
const errorCedula = ref('blue')

onMounted(() => {
  obtener_empleados()
})


const pagina = ref(1)
const totalPaginas = 5
const rows = computed(() => {
  return empleados.value.slice((pagina.value - 1) * totalPaginas, pagina.value * totalPaginas);
});

</script>

<template>
  <div class="mt-10 mx-14">
    <UTable class="h-96" :rows="rows" :columns="columns" :loading="cargando"
      :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Cargando...' }" :ui="tableConfig"
      :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No hay entradas registradas actualmente.' }">
      <template #name-data="{ _ }">
      </template>
      <template #marcar_salida-data="{ row }">
        <UButton color="indigo" @click="marcar_salida(row)" :disabled="row.hora_salida !== 'En trabajo' || cargando">
          Marcar
        </UButton>
      </template>
    </UTable>
    <div class="flex justify-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700 mt-4 text-lg">
      <UPagination v-model="pagina" :page-count="totalPaginas" :total="empleados.length"
        :active-button="{ color: 'blue' }" />
    </div>
  </div>

  <div class="flex justify-center mt-24">
    <UButton label="Registrar entrada" @click="isOpen = true" color="blue" />

    <UModal v-model="isOpen" prevent-close>
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <div v-if="cargando" class="flex items-center justify-center h-1 mb-4 relative">
          <h1 class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full z-10 mb-4 text-stone-700">
            Cargando....</h1>
          <UProgress class="mt-2" color="primary" />
        </div>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-black ml-28">
              Ingrese su numero de cédula
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="cerrar_modal"
              :disabled="cargando" />
          </div>

          <div class="mt-10">
            <UFormGroup v-slot="{ error }" label="Cedula" :error="errorCedula === 'red' && 'Cédula no encontrada o usted ya se encuentra registrado...'">
              <UInput placeholder="Ej: 208490685" :color="errorCedula" id="cedula" v-model="cedulaInput"
                :disabled="cargando" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
            </UFormGroup>
          </div>
        </template>
        <div class="flex justify-center">
          <UButton label="Confirmar" color="blue" @click="registrar_entrada" :disabled="cargando" />
        </div>

      </UCard>
    </UModal>
  </div>
</template>
