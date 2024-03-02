<template>
  <div class="not-prose max-w-lg px-3 py-2 rounded-md" :class="banners[type].color">
    <div class="flex items-center">
      <Icon :name="banners[type].icon" class="h-5 w-5 text-gray-900" aria-hidden="true" />
      <div class="ml-2 text-gray-900 font-semibold">
        {{ banners[type].title }}
      </div>
    </div>
    <div class="text-gray-800 text-base">
      <slot />
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
    color: 'bg-[#A3D5D3]'
  },
  posponed: {
    title: 'Reporté',
    icon: 'ic:baseline-more-time',
    color: 'bg-[#E8A0BF]'
  },
  unsecured: {
    title: 'Non sécurisé',
    icon: 'ic:sharp-warning-amber',
    color: 'bg-[#D1D1D1]'
  },
  wip: {
    title: 'Travaux en cours',
    icon: 'lucide:traffic-cone',
    color: 'bg-[#FBBE65]'
  }
};
</script>
