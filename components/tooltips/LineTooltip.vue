<template>
  <div class="not-prose w-48">
    <div class="pb-1 bg-zinc-100 flex flex-col items-center justify-center">
      <div class="text-gray-900 font-bold text-lg">
        Voie Lyonnaise
      </div>
      <div
        class="h-6 w-6 rounded-full flex items-center justify-center text-white text-md font-bold"
        :style="`background-color: ${getLineColor(feature.properties.line)}`"
      >
        {{ feature.properties.line }}
      </div>
    </div>
    <div class="p-2 divide-y">
      <div>
        <div class="text-sm font-bold">
          Tronçon
        </div>
        <div>{{ feature.properties.name }}</div>
      </div>
      <div>
        <div class="text-sm font-bold">
          statut
        </div>
        <div>{{ getStatusText(feature.properties.status, feature.properties.doneAt) }}</div>
      </div>
      <div>
        <div class="text-sm font-bold">
          Longueur
        </div>
        <div>{{ Math.round(getDistance({ features: [feature] }) / 25) * 25 }}m</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { getLineColor } = useColors();
const { getDistance } = useStats();

type Status = 'done' | 'wip' | 'planned' | 'postponed' | 'variante';
const { feature } = defineProps<{
  feature: {
    type: string;
    properties: {
      id?: string;
      line: number;
      name: string;
      status: Status;
      doneAt?: string;
    };
    geometry: {
      type: string;
      coordinates: number[][];
    };
  }
}>();

function getDoneAtText(doneAt: string): string {
  const [day, month, year] = doneAt.split('/');
  const isBeforeMandat =
    new Date(Number(year), Number(month) - 1, Number(day)).getTime() < new Date(2021, 0, 1).getTime();
  if (isBeforeMandat) {
    return 'avant 2021';
  }
  return `le ${doneAt}`;
}

function getStatusText(status: Status, doneAt?: string): string {
  const statusText = {
    done: () => `Terminé (${getDoneAtText(doneAt!)})`,
    wip: () => 'En travaux',
    planned: () => 'Prévu',
    postponed: () => 'Reporté après 2026',
    variante: () => 'Variante',
    'variante-postponed': () => 'Variante reportée après 2026',
    unknown: () => 'Tracé à définir'
  };
  return statusText[status]();
}
</script>
