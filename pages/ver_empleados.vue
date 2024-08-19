<script setup lang="ts">
import { ref, computed } from 'vue';


const empleados = ref<Empleado[]>([])

interface Empleado {

  cedula: string,
  nombre: string,
  apellido1: string,
  apellido2: string,
  correo: string,
  telefono: string,
}

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




const obtenerEmpleados = async () => {

  try {
    const res = await fetch('/api/obtenerEmpleados')
    const data = await res.json()

    empleados.value = data

  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  obtenerEmpleados()
})



const pagina = ref(1);
const totalPaginas = 5;

const rows = computed(() => {
  return empleados.value.slice((pagina.value - 1) * totalPaginas, pagina.value * totalPaginas);
});
</script>

<template>
  <div class="flex flex-col items-center mt-10 mx-14">
    <div class="w-full max-w-3xl">
      <!-- Aumentar tamaño de letra y establecer altura fija -->
      <UTable :rows="rows" class="text-lg h-[319px]"
        :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Cargando...' }" :ui="tableConfig"
        :loading="true"
        :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No hay empleados registrados actualmente.' }" />
      <div class=" flex justify-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700 mt-4 text-lg">
        <UPagination v-model="pagina" :page-count="totalPaginas" :total="empleados.length"
          :active-button="{ color: 'blue' }" />
      </div>
    </div>
  </div>
</template>