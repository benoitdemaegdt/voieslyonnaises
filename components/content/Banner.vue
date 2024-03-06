<template>
  <div class="not-prose px-3 py-2 rounded-md" :class="banners[type].class">
    <div class="flex items-center">
      <Icon :name="banners[type].icon" class="h-10 w-10 text-gray-500" aria-hidden="true" />
      <div class="ml-2 text-gray-500 text-justify text-lg">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { type } = defineProps<{
  type: string;
}>();

const banners = {
  modified: {
    title: 'Modification après concertation',
    icon: 'material-symbols:edit-square-outline',
    class: 'border-4 border-[#A3D5D3]'
  },
  postponed: {
    title: 'Reporté',
    icon: 'ic:baseline-more-time',
    class: 'border-4 border-[#E8A0BF]'
  },
  unsecured: {
    title: 'Non sécurisé',
    icon: 'ic:sharp-warning-amber',
    class: 'border-4 border-[#D1D1D1]'
  },
  wip: {
    title: 'Travaux en cours',
    icon: 'lucide:traffic-cone',
    class: 'border-4 border-[#FBBE65]'
  }
};
</script>
