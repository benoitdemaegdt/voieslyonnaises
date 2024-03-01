<template>
  <div class="not-prose max-w-lg px-3 py-2 bg-[#FBBE65] rounded-md">
    <div class="flex items-center">
      <Icon name="lucide:traffic-cone" class="h-5 w-5 text-gray-900" aria-hidden="true" />
      <div class="ml-2 text-gray-900 font-semibold">
        Travaux en cours
      </div>
    </div>
    <div class="text-gray-800 text-base">
      <slot />
    </div>
  </div>
</template>
