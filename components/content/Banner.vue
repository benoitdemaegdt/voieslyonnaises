<template>
  <div class="not-prose border-l-4 p-4" :class="banners[type].color.banner">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <Icon :name="banners[type].icon" class="h-6 w-6" :class="banners[type].color.logo" aria-hidden="true" />
      </div>
      <div class="ml-3 text-base" :class="banners[type].color.text">
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
    icon: 'mdi:circle-edit-outline',
    color: {
      banner: 'border-sky-400 bg-sky-50',
      logo: 'text-sky-400',
      text: 'text-sky-700'
    }
  },
  postponed: {
    title: 'Reporté',
    icon: 'mdi:clock-plus-outline',
    color: {
      banner: 'border-orange-400 bg-orange-50',
      logo: 'text-orange-400',
      text: 'text-orange-700'
    }
  },
  unsecured: {
    title: 'Non sécurisé',
    icon: 'mdi:alert-rhombus-outline',
    color: {
      banner: 'border-red-400 bg-red-50',
      logo: 'text-red-400',
      text: 'text-red-700'
    }
  },
  wip: {
    title: 'Travaux en cours',
    icon: 'mdi:traffic-cone',
    color: {
      banner: 'border-yellow-400 bg-yellow-50',
      logo: 'text-yellow-400',
      text: 'text-yellow-700'
    }
  }
};
</script>
