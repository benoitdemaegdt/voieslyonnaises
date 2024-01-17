import maplibregl from 'maplibre-gl';

type LineStringFeature = {
  type: 'Feature';
  properties: {
    line: number;
    name: string;
    status: string;
    doneAt?: string;
  };
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
};

type PointFeature = {
  type: 'Feature';
  properties: {
    type: 'perspective' | 'compteur';
    line: number;
    name: string;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
};

type Compteur = {
  name: string;
  _path: string;
  description: string;
  idPdc: number;
  coordinates: [number, number];
  lines: number[];
  counts: Array<{
    month: string;
    count: number;
  }>;
};

// features plotted last are on top
const sortOrder = [1, 3, 2, 4, 5, 6, 7, 12, 8, 9, 10, 11].reverse();

function getCrossIconUrl(color: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 8; // Set the desired width of your icon
  canvas.height = 8; // Set the desired height of your icon
  const context: any = canvas.getContext('2d');

  // Draw the first diagonal line of the "X"
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(canvas.width, canvas.height);
  context.lineWidth = 2;
  context.strokeStyle = color; // Set the strokeStyle to apply the color
  context.stroke();

  // Draw the second diagonal line of the "X"
  context.beginPath();
  context.moveTo(0, canvas.height);
  context.lineTo(canvas.width, 0);
  context.lineWidth = 2;
  context.strokeStyle = color; // Set the strokeStyle to apply the color
  context.stroke();

  return canvas.toDataURL();
}

function groupFeaturesByColor(features: Array<LineStringFeature & { properties: { color: string } }>) {
  const featuresByColor: any = {};
  for (const feature of features) {
    const color = feature.properties.color;

    if (featuresByColor[color]) {
      featuresByColor[color].push(feature);
    } else {
      featuresByColor[color] = [feature];
    }
  }
  return featuresByColor;
}

export const useMap = () => {
  const { getLineColor } = useColors();

  function plotUnderlinedSections({ map, features }: { map: any; features: LineStringFeature[] }) {
    const sections = features
      .filter(feature => feature.geometry.type === 'LineString')
      .map((feature, index) => ({ id: index, ...feature }));

    if (sections.length === 0 && !map.getLayer('underline-sections')) {
      return;
    }
    if (map.getSource('underline-sections')) {
      map.getSource('underline-sections').setData({ type: 'FeatureCollection', features: sections });
      return;
    }
    map.addSource('underline-sections', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: sections }
    });
    map.addLayer({
      id: 'underline-sections',
      type: 'line',
      source: 'underline-sections',
      layout: {
        'line-cap': 'round'
      },
      paint: {
        'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 8, 5],
        'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#d1d5db', '#FFFFFF']
      }
    });

    let hoveredLineId: any = null;
    map.on('mousemove', 'underline-sections', (e: any) => {
      map.getCanvas().style.cursor = 'pointer';
      if (e.features.length > 0) {
        if (hoveredLineId !== null) {
          map.setFeatureState({ source: 'underline-sections', id: hoveredLineId }, { hover: false });
        }
        if (e.features[0].id !== undefined) {
          hoveredLineId = e.features[0].id;
          if (hoveredLineId !== null) {
            map.setFeatureState({ source: 'underline-sections', id: hoveredLineId }, { hover: true });
          }
        }
      }
    });
    map.on('mouseleave', 'underline-sections', () => {
      map.getCanvas().style.cursor = '';
      if (hoveredLineId !== null) {
        map.setFeatureState({ source: 'underline-sections', id: hoveredLineId }, { hover: false });
      }
      hoveredLineId = null;
    });
  }

  function plotDoneSections({ map, features }: { map: any; features: LineStringFeature[] }) {
    const sections = features
      .filter(feature => feature.properties.status === 'done')
      .sort((featureA, featureB) => {
        const lineA = featureA.properties.line;
        const lineB = featureB.properties.line;
        return sortOrder.indexOf(lineA) - sortOrder.indexOf(lineB);
      })
      .map(feature => ({
        ...feature,
        properties: {
          color: getLineColor(feature.properties.line),
          ...feature.properties
        }
      }));
    // si il n'y a rien a afficher et que la couche n'existe pas, on ne fait rien
    // si elle existe déjà, on la maj (carte dynamique par année)
    if (sections.length === 0 && !map.getLayer('done-sections')) {
      return;
    }
    if (map.getSource('done-sections')) {
      map.getSource('done-sections').setData({ type: 'FeatureCollection', features: sections });
      return;
    }
    map.addSource('done-sections', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: sections }
    });
    map.addLayer({
      id: 'done-sections',
      type: 'line',
      source: 'done-sections',
      paint: {
        'line-width': 4,
        'line-color': ['get', 'color']
      }
    });
  }

  function plotWipSections({ map, features }: { map: any; features: LineStringFeature[] }) {
    const sections = features
      .filter(feature => feature.properties.status === 'wip')
      .sort((featureA, featureB) => {
        const lineA = featureA.properties.line;
        const lineB = featureB.properties.line;
        return sortOrder.indexOf(lineA) - sortOrder.indexOf(lineB);
      })
      .map(feature => ({
        ...feature,
        properties: {
          color: getLineColor(feature.properties.line),
          ...feature.properties
        }
      }));
    if (sections.length === 0 && !map.getLayer('wip-sections')) {
      return;
    }
    map.addSource('wip-sections', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: sections }
    });
    map.addLayer({
      id: 'wip-sections',
      type: 'line',
      source: 'wip-sections',
      paint: {
        'line-width': 4,
        'line-color': ['get', 'color'],
        'line-dasharray': [0, 2, 2]
      }
    });

    const dashArraySequence = [
      [0, 2, 2],
      [0.5, 2, 1.5],
      [1, 2, 1],
      [1.5, 2, 0.5],
      [2, 2, 0],
      [0, 0.5, 2, 1.5],
      [0, 1, 2, 1],
      [0, 1.5, 2, 0.5]
    ];
    let step = 0;
    function animateDashArray(timestamp: number) {
      // Update line-dasharray using the next value in dashArraySequence. The
      // divisor in the expression `timestamp / 50` controls the animation speed.
      const newStep = parseInt((timestamp / 45) % dashArraySequence.length);

      if (newStep !== step) {
        map.setPaintProperty('wip-sections', 'line-dasharray', dashArraySequence[step]);
        step = newStep;
      }

      // Request the next frame of the animation.
      requestAnimationFrame(animateDashArray);
    }
    animateDashArray(0);
  }

  function plotPlannedSections({ map, features }: { map: any; features: LineStringFeature[] }) {
    const sections = features
      .filter(feature => feature.properties.status === 'planned')
      .sort((featureA, featureB) => {
        const lineA = featureA.properties.line;
        const lineB = featureB.properties.line;
        return sortOrder.indexOf(lineA) - sortOrder.indexOf(lineB);
      })
      .map(feature => ({
        ...feature,
        properties: {
          color: getLineColor(feature.properties.line),
          ...feature.properties
        }
      }));

    if (sections.length === 0 && !map.getLayer('planned-sections')) {
      return;
    }
    map.addSource('planned-sections', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: sections }
    });
    map.addLayer({
      id: 'planned-sections',
      type: 'line',
      source: 'planned-sections',
      paint: {
        'line-width': 4,
        'line-color': ['get', 'color'],
        'line-dasharray': [2, 2]
      }
    });
  }

  function plotVarianteSections({ map, features }: { map: any; features: LineStringFeature[] }) {
    const sections = features
      .filter(feature => feature.properties.status === 'variante')
      .sort((featureA, featureB) => {
        const lineA = featureA.properties.line;
        const lineB = featureB.properties.line;
        return sortOrder.indexOf(lineA) - sortOrder.indexOf(lineB);
      })
      .map(feature => ({
        ...feature,
        properties: {
          color: getLineColor(feature.properties.line),
          ...feature.properties
        }
      }));
    if (sections.length === 0 && !map.getLayer('variante-sections')) {
      return;
    }
    map.addSource('variante-sections', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: sections }
    });
    map.addLayer({
      id: 'variante-sections',
      type: 'line',
      source: 'variante-sections',
      paint: {
        'line-width': 4,
        'line-color': ['get', 'color'],
        'line-dasharray': [2, 2],
        'line-opacity': 0.5
      }
    });
    map.addLayer({
      id: 'variante-symbols',
      type: 'symbol',
      source: 'variante-sections',
      paint: {
        'text-halo-color': '#fff',
        'text-halo-width': 4
      },
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 120,
        'text-font': ['Open Sans Regular'],
        'text-field': ['coalesce', ['get', 'text'], 'variante'],
        'text-size': 14
      }
    });

    map.on('mouseenter', 'variante-sections', () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', 'variante-sections', () => (map.getCanvas().style.cursor = ''));
  }

  function plotVariantePostponedSections({ map, features }: { map: any; features: LineStringFeature[] }) {
    const sections = features
      .filter(feature => feature.properties.status === 'variante-postponed')
      .sort((featureA, featureB) => {
        const lineA = featureA.properties.line;
        const lineB = featureB.properties.line;
        return sortOrder.indexOf(lineA) - sortOrder.indexOf(lineB);
      })
      .map(feature => ({
        ...feature,
        properties: {
          color: getLineColor(feature.properties.line),
          ...feature.properties
        }
      }));
    if (sections.length === 0 && !map.getLayer('variante-postponed-sections')) {
      return;
    }
    map.addSource('variante-postponed-sections', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: sections }
    });
    map.addLayer({
      id: 'variante-postponed-sections',
      type: 'line',
      source: 'variante-postponed-sections',
      paint: {
        'line-width': 4,
        'line-color': ['get', 'color'],
        'line-dasharray': [2, 2],
        'line-opacity': 0.5
      }
    });
    map.addLayer({
      id: 'variante-postponed-symbols',
      type: 'symbol',
      source: 'variante-postponed-sections',
      paint: {
        'text-halo-color': '#fff',
        'text-halo-width': 4
      },
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 120,
        'text-font': ['Open Sans Regular'],
        'text-field': ['coalesce', ['get', 'text'], 'variante reportée'],
        'text-size': 14
      }
    });

    map.on('mouseenter', 'variante-postponed-sections', () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', 'variante-postponed-sections', () => (map.getCanvas().style.cursor = ''));
  }

  function plotUnknownSections({ map, features }: { map: any; features: LineStringFeature[] }) {
    const sections = features
      .filter(feature => feature.properties.status === 'unknown')
      .sort((featureA, featureB) => {
        const lineA = featureA.properties.line;
        const lineB = featureB.properties.line;
        return sortOrder.indexOf(lineA) - sortOrder.indexOf(lineB);
      })
      .map(feature => ({
        ...feature,
        properties: {
          color: getLineColor(feature.properties.line),
          ...feature.properties
        }
      }));
    if (sections.length === 0 && !map.getLayer('unknown-sections')) {
      return;
    }
    map.addSource('unknown-sections', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: sections }
    });
    map.addLayer({
      id: 'unknown-sections',
      type: 'line',
      source: 'unknown-sections',
      layout: {
        'line-cap': 'round'
      },
      paint: {
        'line-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          11,
          4, // width 4 at low zoom
          14,
          25 // progressively reach width 25 at high zoom
        ],
        'line-color': ['get', 'color'],
        'line-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          11,
          0.5, // opacity 0.4 at low zoom
          14,
          0.35 // opacity 0.35 at high zoom
        ]
      }
    });
    map.addLayer({
      id: 'unknown-symbols',
      type: 'symbol',
      source: 'unknown-sections',
      paint: {
        'text-halo-color': '#fff',
        'text-halo-width': 3
      },
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 120,
        'text-font': ['Open Sans Regular'],
        'text-field': 'tracé à définir',
        'text-size': 14
      }
    });

    map.on('mouseenter', 'unknown-sections', () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', 'unknown-sections', () => (map.getCanvas().style.cursor = ''));
  }

  function plotPostponedSections({ map, features }: { map: any; features: LineStringFeature[] }) {
    const sections = features
      .filter(feature => feature.properties.status === 'postponed')
      .sort((featureA, featureB) => {
        const lineA = featureA.properties.line;
        const lineB = featureB.properties.line;
        return sortOrder.indexOf(lineA) - sortOrder.indexOf(lineB);
      })
      .map(feature => ({
        ...feature,
        properties: {
          color: getLineColor(feature.properties.line),
          ...feature.properties
        }
      }));
    if (sections.length === 0) {
      return;
    }

    const featuresByColor = groupFeaturesByColor(sections);
    for (const [color, sameColorFeatures] of Object.entries(featuresByColor)) {
      map.addSource(`postponed-sections-${color}`, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: sameColorFeatures }
      });

      const iconUrl = getCrossIconUrl(color);
      map.loadImage(iconUrl, (error: Error, image: any) => {
        if (error) {
          throw error;
        }
        map.addImage(`cross-${color}`, image);

        map.addLayer({
          id: `postponed-symbols-${color}`,
          type: 'symbol',
          source: `postponed-sections-${color}`,
          layout: {
            'symbol-placement': 'line',
            'symbol-spacing': 1,
            'icon-image': `cross-${color}`,
            'icon-size': 1
          }
        });
        map.addLayer({
          id: `postponed-text-${color}`,
          type: 'symbol',
          source: `postponed-sections-${color}`,
          paint: {
            'text-halo-color': '#fff',
            'text-halo-width': 3
          },
          layout: {
            'symbol-placement': 'line',
            'symbol-spacing': 150,
            'text-font': ['Open Sans Regular'],
            'text-field': 'reporté',
            'text-size': 14
          }
        });

        map.on('mouseenter', `postponed-symbols-${color}`, () => (map.getCanvas().style.cursor = 'pointer'));
        map.on('mouseleave', `postponed-symbols-${color}`, () => (map.getCanvas().style.cursor = ''));
      });
    }
  }

  function plotPerspective({ map, features }: { map: any; features: Array<LineStringFeature | PointFeature> }) {
    const perspectives = features
      .filter((feature): feature is PointFeature => feature.geometry.type === 'Point')
      .filter(feature => feature.properties.type === 'perspective')
      .map(feature => ({
        ...feature,
        properties: {
          color: getLineColor(feature.properties.line),
          ...feature.properties
        }
      }));
    if (perspectives.length === 0) {
      return;
    }
    map.addSource('perspectives', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: perspectives
      }
    });

    map.loadImage('/icons/camera.png', (error: Error, image: any) => {
      if (error) {
        throw error;
      }
      map.addImage('camera-icon', image, { sdf: true });
      map.addLayer({
        id: 'perspectives',
        source: 'perspectives',
        type: 'symbol',
        layout: {
          'icon-image': 'camera-icon',
          'icon-size': 0.5,
          'icon-offset': [-25, -25]
        },
        paint: {
          'icon-color': ['get', 'color']
        }
      });
      map.setLayoutProperty('perspectives', 'visibility', 'none');
      map.on('zoom', () => {
        const zoomLevel = map.getZoom();
        if (zoomLevel > 14) {
          map.setLayoutProperty('perspectives', 'visibility', 'visible');
        } else {
          map.setLayoutProperty('perspectives', 'visibility', 'none');
        }
      });
    });
  }

  function plotCompteurs({ map, features }: { map: any; features: Array<LineStringFeature | PointFeature> }) {
    const compteurs = features
      .filter((feature): feature is PointFeature => feature.geometry.type === 'Point')
      .filter(feature => feature.properties.type === 'compteur');
    if (compteurs.length === 0) {
      return;
    }
    map.addSource('compteurs', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: compteurs
      }
    });
    map.addLayer({
      id: 'compteurs',
      source: 'compteurs',
      type: 'circle',
      paint: {
        'circle-radius': 7,
        'circle-color': '#152B68'
      }
    });
    map.on('mouseenter', 'compteurs', () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', 'compteurs', () => (map.getCanvas().style.cursor = ''));
  }

  function getCompteursFeatures({ counters }: { counters: Compteur[] }) {
    if (counters.length === 0) {
      return;
    }
    return counters.map(counter => {
      const lastRecord = counter.counts.at(-1)!;
      const date = new Date(lastRecord.month);
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      const averageDailyTraffic = Math.round(lastRecord.count / daysInMonth);

      return {
        type: 'Feature',
        properties: {
          type: 'compteur',
          name: counter.name,
          link: counter._path,
          lastRecordDate: new Date(lastRecord.month).toLocaleString('fr-Fr', {
            month: 'long',
            year: 'numeric'
          }),
          lastRecordValue: `${averageDailyTraffic} passages par jour`
        },
        geometry: {
          type: 'Point',
          coordinates: counter.coordinates
        }
      };
    });
  }

  function fitBounds({ map, features }: { map: any; features: Array<LineStringFeature | PointFeature> }) {
    const allLineStringsCoordinates = features
      .filter((feature): feature is LineStringFeature => feature.geometry.type === 'LineString')
      .map(feature => feature.geometry.coordinates)
      .flat();

    const allPointsCoordinates = features
      .filter((feature): feature is PointFeature => feature.geometry.type === 'Point')
      .map(feature => feature.geometry.coordinates);

    if (allPointsCoordinates.length === 0 && allLineStringsCoordinates.length === 0) {
      return;
    }

    if (features.length === 1 && allPointsCoordinates.length === 1) {
      map.flyTo({ center: allPointsCoordinates[0] });
    } else {
      const bounds = new maplibregl.LngLatBounds(allLineStringsCoordinates[0], allLineStringsCoordinates[0]);
      for (const coord of [...allLineStringsCoordinates, ...allPointsCoordinates]) {
        bounds.extend(coord);
      }
      map.fitBounds(bounds, { padding: 20 });
    }
  }

  return {
    plotUnderlinedSections,
    plotDoneSections,
    plotWipSections,
    plotPlannedSections,
    plotVarianteSections,
    plotVariantePostponedSections,
    plotUnknownSections,
    plotPostponedSections,
    plotPerspective,
    plotCompteurs,
    getCompteursFeatures,
    fitBounds
  };
};
