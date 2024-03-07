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
      banner: 'border-[#A3D5D3] bg-[#F2FFFF]',
      logo: 'text-[#A3D5D3]',
      text: 'text-[#79C2BE]'
    }
  },
  postponed: {
    title: 'Reporté',
    icon: 'mdi:clock-plus-outline',
    color: {
      banner: 'border-[#E8A0BF] bg-[#FFF0F8]',
      logo: 'text-[#E8A0BF]',
      text: 'text-[#DB6E9D]'
    }
  },
  unsecured: {
    title: 'Non sécurisé',
    icon: 'mdi:alert-rhombus-outline',
    color: {
      banner: 'border-gray-400 bg-gray-50',
      logo: 'text-gray-400',
      text: 'text-gray-700'
    }
  },
  wip: {
    title: 'Travaux en cours',
    icon: 'mdi:traffic-cone',
    color: {
      banner: 'border-[#FBBE65] bg-[#FFF8E2]',
      logo: 'text-[#FBBE65]',
      text: 'text-[#F99D1C]'
    }
  }
};
</script>
