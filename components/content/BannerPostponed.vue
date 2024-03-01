<template>
  <div class="not-prose max-w-lg px-3 py-2 bg-[#E8A0BF] rounded-md">
    <div class="flex items-center">
      <Icon name="ic:baseline-more-time" class="h-5 w-5 text-gray-900" aria-hidden="true" />
      <div class="ml-2 text-gray-900 font-semibold">
        Reporté
      </div>
    </div>
    <div class="text-gray-800 text-base text-justify">
      <slot />
    </div>
  </div>
</template>
