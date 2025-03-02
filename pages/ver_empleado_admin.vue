<script setup lang="ts">

import { format } from 'date-fns'

const date = ref(new Date())

const tableConfigCQ = {
  wrapper: 'relative overflow-x-auto bg-white border border-gray-300', // Fondo blanco y borde gris claro para el contenedor
  base: 'min-w-full table-fixed border-collapse', // Border-collapse para compartir bordes
  divide: 'divide-y divide-gray-200 dark:divide-gray-700', // Líneas divisorias grises
  thead: 'relative bg-blue-800 border-b border-gray-300', // Fondo oscuro para el encabezado con borde inferior gris claro
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

const tableConfigAZ = {
  wrapper: 'relative overflow-x-auto bg-white border border-gray-300', // Fondo blanco y borde gris claro para el contenedor
  base: 'min-w-full table-fixed border-collapse', // Border-collapse para compartir bordes
  divide: 'divide-y divide-gray-200 dark:divide-gray-700', // Líneas divisorias grises
  thead: 'relative bg-green-800 border-b border-gray-300', // Fondo oscuro para el encabezado con borde inferior gris claro
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

interface Empleado{

  cedula: string;
  nombre: string;
  apellido1: string;
  fecha: string;
  hora_entrada: string;
  hora_salida: string;
  sede: string;
  horas_trabajadas: string;
}

const columns = [{
  key: 'cedula',
  label: 'Cedula'
}, {
  key: 'nombre',
  label: 'Nombre'
}, {
  key: 'apellido1',
  label: 'Apellido'
}, {
  key: 'hora_entrada',
  label: 'Hora de entrada'
}, {
  key: 'hora_salida',
  label: 'Hora de salida'
}, {
  key: 'sede',
  label: 'Sede'
},{
  key: 'horas_trabajadas',
  label: 'Horas trabajadas'
}]

const loading = ref(false)


async function obtener_empleados() {
  try {
    empleadosAZ.value = []
    empleadosCQ.value = []
    loading.value = true
    const res = await fetch('/api/empleadosFecha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({fecha: date.value})
    })

    const data = await res.json()
    
    if (data.length === 0) {
      console.log("No hay empleados")
      empleadosAZ.value = []
      empleadosCQ.value = []
      loading.value = false
      return
    }

    loading.value = false
    empleadosAZ.value = data.empleadosAZ
    empleadosCQ.value = data.empleadosCQ
    
  } catch (error) {
    console.log("error")
  }
}




const empleadosCQ = ref<Empleado[]>([])
const empleadosAZ = ref<Empleado[]>([])



</script>

<template>
  <div class="flex items-center space-x-4 mt-2 mb-8">
    <UPopover :popper="{ placement: 'bottom-start' }">
      <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(date, 'd MMM, yyy')" color="blue" />
      <template #panel="{ close }">
        <DatePicker v-model="date" is-required @close="close" color="blue" />
      </template>
    </UPopover>
    <UButton @click="obtener_empleados" label="BUSCAR" icon="i-heroicons-magnifying-glass" color="blue"/>
  </div>

  <template>
    <UTable :rows="empleadosCQ" :columns="columns" :loading="loading" :ui="tableConfigCQ" />
  </template>

  <template>
    <UTable :rows="empleadosAZ" :columns="columns" :loading="loading" :ui="tableConfigAZ"/>
  </template>

  <div class="mb-8">

  </div>
</template>