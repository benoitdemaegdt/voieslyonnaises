import { expect, test } from 'vitest';
import { useStats } from './useStats';
const { getAllSections } = useStats();

test('keep sections with id undefined', () => {
  const voies = [
    {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            id: undefined
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [0, 0],
              [1, 1]
            ]
          }
        }
      ]
    }
  ];

  expect(getAllSections(voies)).toEqual([
    {
      type: 'Feature',
      properties: {
        id: undefined
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 0],
          [1, 1]
        ]
      }
    }
  ]);
});

test('keep remove duplicate ids', () => {
  const voies = [
    {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            id: 'id-1'
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [0, 0],
              [1, 1]
            ]
          }
        }
      ]
    },
    {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            id: 'id-1'
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [2, 2],
              [3, 3]
            ]
          }
        }
      ]
    }
  ];

  expect(getAllSections(voies)).toEqual([
    {
      type: 'Feature',
      properties: {
        id: 'id-1'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 0],
          [1, 1]
        ]
      }
    }
  ]);
});
