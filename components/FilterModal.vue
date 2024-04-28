<template>
  <Dialog :open="isOpen" class="relative z-50" @close="closeModal">
    <!-- backdrop-->
    <div class="fixed inset-0 bg-black/30" aria-hidden="true" />

    <!-- dialog itself-->
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <DialogPanel class="relative p-4 w-full max-w-sm rounded bg-white">
        <button
          type="button"
          class="absolute top-1 right-1 bg-white rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          @click="closeModal"
        >
          <Icon name="mdi:close" class="h-6 w-6" aria-hidden="true" />
        </button>
        <DialogTitle class="text-lg font-medium leading-6 text-gray-900">
          Filtres
        </DialogTitle>
        <div class="mt-2">
          <div class="text-base">
            Filtrer par statut d'avancement
          </div>
          <div v-for="statusFilter in statusFilters" :key="statusFilter.label">
            <label>
              <input v-model="statusFilter.isEnable" type="checkbox">
              {{ statusFilter.label }}
            </label>
          </div>
          <div class="text-base">
            Filtrer par type d'aménagement
          </div>
          <div v-for="typeFilter in typeFilters" :key="typeFilter.label">
            <label>
              <input v-model="typeFilter.isEnable" type="checkbox">
              {{ typeFilter.label }}
            </label>
          </div>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';

const isOpen = ref(false);

function closeModal() {
  isOpen.value = false;
}
function openModal() {
  isOpen.value = true;
}

defineExpose({
  openModal
});

const statusFilters = ref([
  { label: 'Prévu pour 2026', isEnable: true, statuses: ['planned', 'variante'] },
  { label: 'Terminé', isEnable: true, statuses: ['done'] },
  { label: 'Reporté', isEnable: true, statuses: ['postponed', 'variante-postponed'] },
  { label: 'Inconnu', isEnable: true, statuses: ['unknown'] },
  { label: 'En travaux', isEnable: true, statuses: ['wip'] }
]);

const typeFilters = ref([
  { label: 'Bidirectionnelle', isEnable: true, types: ['bidirectionnelle'] },
  { label: 'Bilaterale', isEnable: true, types: ['bilaterale'] },
  { label: 'Voie Bus', isEnable: true, types: ['voie-bus', 'voie-bus-elargie'] },
  { label: 'Voie verte', isEnable: true, types: ['voie-verte'] },
  { label: 'Vélorue', isEnable: true, types: ['velorue'] },
  { label: 'Bandes cyclables', isEnable: true, types: ['bandes-cyclables'] },
  { label: 'Zone de rencontre', isEnable: true, types: ['zone-de-rencontre'] }
]);

const emit = defineEmits(['update']);

watch([statusFilters, typeFilters], () => {
  const visibleStatuses = statusFilters.value
    .filter(item => item.isEnable)
    .flatMap(item => item.statuses);

  const visibleTypes = typeFilters.value
    .filter(item => item.isEnable)
    .flatMap(item => item.types);

  emit('update', { visibleStatuses, visibleTypes });
}, { deep: true });

</script>
