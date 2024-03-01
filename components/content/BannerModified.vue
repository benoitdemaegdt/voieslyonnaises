<template>
  <div class="not-prose max-w-lg px-3 py-2 bg-[#A3D5D3] rounded-md">
    <div class="flex items-center">
      <Icon name="material-symbols:edit-square-outline" class="h-5 w-5 text-gray-900" aria-hidden="true" />
      <div class="ml-2 text-gray-900 font-semibold">
        Modification après concertation
      </div>
    </div>
    <div class="text-gray-800 text-base">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
</script>
