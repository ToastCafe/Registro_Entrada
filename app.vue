<script setup lang="ts">

const items = [
  [{
    label: 'Ciudad Quesada',
    avatar: {
      src: 'https://us.123rf.com/450wm/teresinagoia/teresinagoia1605/teresinagoia160500004/58756520-papel-de-color-naranja-textura-%C3%BAtil-como-fondo.jpg'
    },
    to: '/empleados_hoy_CQ'
    
  },{
    label: 'Agua Zarcas',
    avatar: {
      src: 'https://i.pinimg.com/originals/fe/86/0b/fe860ba4c8bf83e0391ef32739a776b2.jpg'
    },
    to: 'empleados_hoy_AZ'

  }]
]

const open = ref(true)

defineShortcuts({
  o: () => open.value = !open.value
})
const route = useRoute()
const headerClass = computed(() => {
  switch (route.path) {
    case '/empleados_hoy_AZ':
      return 'bg-green-800'
    case '/empleados_hoy_CQ':
      return 'bg-orange-950'
    default:
      return 'bg-gray-800'
  }
})



</script>

<template>
  <div>
    <header :class="headerClass" class="p-4">
      <nav class="container mx-auto flex justify-between items-center">
        <div class="text-white text-xl">TOAST CAFÉ</div>
        <ul class="flex space-x-24">
          <UDropdown v-model:open="open" :items="items" :popper="{ placement: 'bottom-start' }">
            <UButton color="white" label="Ingreso" trailing-icon="i-heroicons-chevron-down-20-solid" />
          </UDropdown>
          <UButton color="white" to="/agregar_empleado" variant="solid">Agregar empleado</UButton>
          <UButton color="white" to="/ver_empleados" variant="solid">Ver empleados</UButton>
        </ul>
      </nav>
    </header>
    <NuxtPage />
    <UNotifications />
  </div>
</template>
