<template>
  <NuxtLink class="rounded-lg shadow-md hover:shadow-lg overflow-hidden" :to="link">
    <div class="px-4 py-2 bg-lvv-blue-600 text-white">
      <div class="text-base font-medium">
        {{ arrondissement }}
      </div>
      <div class="mt-1 text-lg font-semibold">
        {{ name }}
      </div>
    </div>
    <table class="w-full bg-white">
      <thead>
        <tr class="bg-lvv-blue-100">
          <th class="w-1/6 italic font-normal">
            {{ formatRecordMonth(lastRecord) }}
          </th>
          <th class="w-1/4">
            {{ formatRecordYear(lastRecord) - 1 }}
          </th>
          <th class="w-1/4">
            {{ formatRecordYear(lastRecord) }}
          </th>
          <th class="w-1/4 italic font-normal border-l-2 border-lvv-blue-600">
            évolution
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- ligne vélo -->
        <tr v-if="isTrackingVelo">
          <td class="text-center p-1">
            <Icon name="fluent:vehicle-bicycle-16-regular" class="text-3xl" />
          </td>
          <td class="text-center p-1">
            {{ formatRecordCount(lastRecordPreviousYear?.veloCount) }}
          </td>
          <td class="text-center p-1">
            {{ formatRecordCount(lastRecord?.veloCount) }}
          </td>
          <!-- <td class="text-center p-1">
            <div class="flex items-center justify-center">
              <span>{{ lastRecord.value }}</span>
              <Icon v-if="isLastRecordMax(counter)" name="iconoir:medal-1st-solid" class="text-lvv-pink text-xl" />
            </div>
          </td> -->
          <td class="text-center p-1 border-l-2 border-lvv-blue-600">
            <span v-if="getEvolution(lastRecordPreviousYear?.veloCount, lastRecord?.veloCount) === 0 " class="text-gray-600">
              N/A
            </span>
            <span v-if="getEvolution(lastRecordPreviousYear?.veloCount, lastRecord?.veloCount) > 0 " class="text-green-600">
              <Icon name="mdi:arrow-top-right-thin" />
              +{{ getEvolution(lastRecordPreviousYear?.veloCount, lastRecord?.veloCount) }}%
            </span>
            <span v-if="getEvolution(lastRecordPreviousYear?.veloCount, lastRecord?.veloCount) < 0 " class="text-red-600">
              <Icon name="mdi:arrow-bottom-right-thin" />
              {{ getEvolution(lastRecordPreviousYear?.veloCount, lastRecord?.veloCount) }}%
            </span>
          </td>
        </tr>

        <!-- ligne voiture -->
        <tr v-if="isTrackingVoiture">
          <td class="text-center p-1">
            <Icon name="fluent:vehicle-car-profile-ltr-16-regular" class="text-3xl" />
          </td>
          <td class="text-center p-1">
            {{ formatRecordCount(lastRecordPreviousYear?.voitureCount) }}
          </td>
          <td class="text-center p-1">
            {{ formatRecordCount(lastRecord?.voitureCount) }}
          </td>
          <td class="text-center p-1 border-l-2 border-lvv-blue-600">
            <span v-if="getEvolution(lastRecordPreviousYear?.voitureCount, lastRecord?.voitureCount) === 0 " class="text-gray-600">
              N/A
            </span>
            <span v-if="getEvolution(lastRecordPreviousYear?.voitureCount, lastRecord?.voitureCount) > 0 " class="text-green-600">
              <Icon name="mdi:arrow-top-right-thin" />
              +{{ getEvolution(lastRecordPreviousYear?.voitureCount, lastRecord?.voitureCount) }}%
            </span>
            <span v-if="getEvolution(lastRecordPreviousYear?.voitureCount, lastRecord?.voitureCount) < 0 " class="text-red-600">
              <Icon name="mdi:arrow-bottom-right-thin" />
              {{ getEvolution(lastRecordPreviousYear?.voitureCount, lastRecord?.voitureCount) }}%
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { CounterParsedContent } from '../../composables/useCompteur';

type Record = {
  month: string;
  veloCount?: number;
  voitureCount?: number;
};

const props = defineProps<{
  counter: Omit<CounterParsedContent, 'counts'> & {
    counts: Record[],
    link: string
  };
}>();

const arrondissement = props.counter.arrondissement;
const name = props.counter.name;
const link = props.counter.link;

const lastRecord = props.counter.counts[props.counter.counts.length - 1];
const lastRecordPreviousYear = getSameRecordPreviousYear(lastRecord);

const isTrackingVelo = props.counter.counts.some(record => record.veloCount !== undefined);
const isTrackingVoiture = props.counter.counts.some(record => record.voitureCount !== undefined);

/**
 * formatters
 */
function formatRecordMonth(record: Record) {
  return new Date(record.month).toLocaleString('fr-Fr', { month: 'short' });
}

function formatRecordYear(record: Record): number {
  return new Date(record.month).getFullYear();
}

function formatRecordCount(count?: number) {
  if (count === undefined) { return 'N/A'; }
  return count.toLocaleString('fr-FR') ?? 0;
}

/**
 * helpers
 */
function getSameRecordPreviousYear(record: Record): Record | undefined {
  const recordMonth = new Date(record.month).getMonth();
  const recordYear = new Date(record.month).getFullYear();
  return props.counter.counts.find(count => {
    return new Date(count.month).getMonth() === recordMonth &&
      new Date(count.month).getFullYear() === recordYear - 1;
  });
}

function getEvolution(count1?: number, count2?: number): number {
  if (count1 === undefined || count1 === 0) { return 0; }
  if (count2 === undefined || count2 === 0) { return 0; }
  return Math.round(((count2 - count1) / count1) * 1000) / 10;
}

</script>
