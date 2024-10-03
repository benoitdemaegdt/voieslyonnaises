import type { ParsedContent } from '@nuxt/content';

export type Count = {
  month: string;
  count: number;
}

export type Counter = {
  name: string;
  description: string;
  arrondissement: string;
  idPdc: string;
  coordinates: number[];
  lines: number[];
  counts: Count[];
}

export interface CounterParsedContent extends ParsedContent {
  name: string;
  description: string;
  arrondissement: string;
  idPdc: string;
  coordinates: number[];
  cyclopolisId?: string;
  lines?: number[];
  counts: Count[];
}
