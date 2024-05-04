import { assert, describe, it } from 'vitest';

import { useCompteur } from '../composables/useCompteur';
const { getCounterLastRecord, getCounterLastRecordPreviousYear, getEvolution, isLastRecordMax } = useCompteur();

describe('useCompteur', () => {
  describe('getCounterLastRecord', () => {
    describe('when there is only one record', () => {
      it('should return the last record', () => {
        const counter = {
          name: 'counter',
          description: 'description',
          arrondissement: 'arrondissement',
          idPdc: 'idPdc',
          coordinates: [0, 0],
          lines: [],
          counts: [{ month: '2016-02-01', count: 1 }]
        };
        const lastRecord = getCounterLastRecord(counter);
        assert.deepEqual(lastRecord, {
          month: 'févr.',
          year: '2016',
          value: '1',
          raw: 1
        });
      });
    });
  });

  describe('getCounterLastRecordPreviousYear', () => {
    describe('when there are 2 records with 1 year interval', () => {
      it('should return the last record of previous year', () => {
        const counter = {
          name: 'counter',
          description: 'description',
          arrondissement: 'arrondissement',
          idPdc: 'idPdc',
          coordinates: [0, 0],
          lines: [],
          counts: [
            { month: '2015-02-01', count: 2 },
            { month: '2016-02-01', count: 1 }
          ]
        };
        const record = getCounterLastRecordPreviousYear(counter);
        assert.deepEqual(record, {
          month: 'févr.',
          year: '2015',
          value: '2',
          raw: 2
        });
      });
    });
  });

  describe('getEvolution', () => {
    describe('when there are 2 records with 1 year interval', () => {
      it('should return the last record of previous year', () => {
        const counter = {
          name: 'counter',
          description: 'description',
          arrondissement: 'arrondissement',
          idPdc: 'idPdc',
          coordinates: [0, 0],
          lines: [],
          counts: [
            { month: '2015-02-01', count: 1 },
            { month: '2016-02-01', count: 2 }
          ]
        };
        const evolution = getEvolution(counter);
        assert.deepEqual(evolution, '100.0');
      });
    });
  });

  describe('isLastRecordMax', () => {
    describe('when last record is maximum', () => {
      it('should return true', () => {
        const counter = {
          name: 'counter',
          description: 'description',
          arrondissement: 'arrondissement',
          idPdc: 'idPdc',
          coordinates: [0, 0],
          lines: [],
          counts: [
            { month: '2015-02-01', count: 1 },
            { month: '2016-02-01', count: 2 }
          ]
        };
        const isMax = isLastRecordMax(counter);
        assert.deepEqual(isMax, true);
      });
    });
  });
});
