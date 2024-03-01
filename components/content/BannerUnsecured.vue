<template>
  <div class="not-prose max-w-lg px-3 py-2 bg-[#D1D1D1] rounded-md">
    <div class="flex items-center">
      <Icon name="ic:sharp-warning-amber" class="h-5 w-5 text-gray-900" aria-hidden="true" />
      <div class="ml-2 text-gray-900 font-semibold">
        Non sécurisé
      </div>
    </div>
    <div class="text-gray-800 text-base">
      <slot />
    </div>
  </div>
</template>
