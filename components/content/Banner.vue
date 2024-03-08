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
      banner: 'border-[#4B7977] bg-[#F1F8F8]',
      logo: 'text-[#4B7977]',
      text: 'text-[#436C6A]'
    }
  },
  postponed: {
    title: 'Reporté',
    icon: 'mdi:clock-plus-outline',
    color: {
      banner: 'border-[#994d6d] bg-[#FBF0F5]',
      logo: 'text-[#994d6d]',
      text: 'text-[#7A3D57]'
    }
  },
  unsecured: {
    title: 'Non sécurisé',
    icon: 'mdi:alert-rhombus-outline',
    color: {
      banner: 'border-[#585858] bg-[#F9F9F9]',
      logo: 'text-[#585858]',
      text: 'text-[#4E4E4E]'
    }
  },
  wip: {
    title: 'Travaux en cours',
    icon: 'mdi:traffic-cone',
    color: {
      banner: 'border-[#9C6211] bg-[#FEF5E8]',
      logo: 'text-[#9C6211]',
      text: 'text-[#8B570F]'
    }
  }
};
</script>
