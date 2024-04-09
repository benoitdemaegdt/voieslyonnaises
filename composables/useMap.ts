import { GeoJSONSource, LngLatBounds, Map } from 'maplibre-gl';

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

type ColoredLineStringFeature = LineStringFeature & { properties: { color: string } };

type PerspectiveFeature = {
  type: 'Feature';
  properties: {
    type: 'perspective';
    line: number;
    name: string;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
};

type CompteurFeature = {
  type: 'Feature';
  properties: {
    type: 'compteur';
    line: number;
    name: string;
    counts?: any[];
    /**
     * z-index like
     */
    circleSortKey?: number;
    circleRadius?: number;
    circleStrokeWidth?: number;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
};

type PointFeature = PerspectiveFeature | CompteurFeature;

type Feature = LineStringFeature | PointFeature;

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

function sortByLine(featureA: LineStringFeature, featureB: LineStringFeature) {
  const lineA = featureA.properties.line;
  const lineB = featureB.properties.line;
  return sortOrder.indexOf(lineA) - sortOrder.indexOf(lineB);
}

function getCrossIconUrl(color: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 8; // Set the desired width of your icon
  canvas.height = 8; // Set the desired height of your icon
  const context = canvas.getContext('2d');
  if (!context) {
    return '';
  }

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

function groupFeaturesByColor(features: ColoredLineStringFeature[]) {
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

function isLineStringFeature(feature: Feature): feature is LineStringFeature {
  return feature.geometry.type === 'LineString';
}

function isPointFeature(feature: Feature): feature is PointFeature {
  return feature.geometry.type === 'Point';
}

function isPerspectiveFeature(feature: Feature): feature is PerspectiveFeature {
  return isPointFeature(feature) && feature.properties.type === 'perspective';
}

function isCompteurFeature(feature: Feature): feature is CompteurFeature {
  return isPointFeature(feature) && ['compteur-velo', 'compteur-voiture'].includes(feature.properties.type);
}

export const useMap = () => {
  const { getLineColor } = useColors();

  function addLineColor(feature: LineStringFeature): ColoredLineStringFeature {
    return {
      ...feature,
      properties: {
        color: getLineColor(feature.properties.line),
        ...feature.properties
      }
    };
  }

  function plotUnderlinedSections({ map, features }: { map: Map; features: LineStringFeature[] }) {
    const sections = features.map((feature, index) => ({ id: index, ...feature }));

    if (sections.length === 0 && !map.getLayer('highlight')) {
      return;
    }
    const source = map.getSource('all-sections') as GeoJSONSource;
    if (source) {
      source.setData({ type: 'FeatureCollection', features: sections });
      return;
    }
    map.addSource('all-sections', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: sections }
    });

    map.addLayer({
      id: 'highlight',
      type: 'line',
      source: 'all-sections',
      layout: { 'line-cap': 'round' },
      paint: {
        'line-gap-width': 5,
        'line-width': 4,
        'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#9ca3af', '#FFFFFF']
      }
    });
    map.addLayer({
      id: 'contour',
      type: 'line',
      source: 'all-sections',
      layout: { 'line-cap': 'round' },
      paint: {
        'line-gap-width': 4,
        'line-width': 1,
        'line-color': '#6b7280'
      }
    });
    map.addLayer({
      id: 'underline',
      type: 'line',
      source: 'all-sections',
      paint: {
        'line-width': 4,
        'line-color': '#ffffff'
      }
    });

    let hoveredLineId: any = null;
    map.on('mousemove', 'highlight', (e: any) => {
      map.getCanvas().style.cursor = 'pointer';
      if (e.features.length > 0) {
        if (hoveredLineId !== null) {
          map.setFeatureState({ source: 'all-sections', id: hoveredLineId }, { hover: false });
        }
        if (e.features[0].id !== undefined) {
          hoveredLineId = e.features[0].id;
          if (hoveredLineId !== null) {
            map.setFeatureState({ source: 'all-sections', id: hoveredLineId }, { hover: true });
          }
        }
      }
    });
    map.on('mouseleave', 'highlight', () => {
      map.getCanvas().style.cursor = '';
      if (hoveredLineId !== null) {
        map.setFeatureState({ source: 'all-sections', id: hoveredLineId }, { hover: false });
      }
      hoveredLineId = null;
    });
  }

  function plotDoneSections({ map, features }: { map: Map; features: ColoredLineStringFeature[] }) {
    const sections = features.filter(feature => feature.properties.status === 'done');

    // si il n'y a rien a afficher et que la couche n'existe pas, on ne fait rien
    // si elle existe déjà, on la maj (carte dynamique par année)
    if (sections.length === 0 && !map.getLayer('done-sections')) {
      return;
    }
    const source = map.getSource('done-sections') as GeoJSONSource;
    if (source) {
      source.setData({ type: 'FeatureCollection', features: sections });
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

  function plotWipSections({ map, features }: { map: Map; features: ColoredLineStringFeature[] }) {
    const sections = features.filter(feature => feature.properties.status === 'wip');

    if (sections.length === 0 && !map.getLayer('wip-sections')) {
      return;
    }
    const source = map.getSource('wip-sections') as GeoJSONSource;
    if (source) {
      source.setData({ type: 'FeatureCollection', features: sections });
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

  function plotPlannedSections({ map, features }: { map: Map; features: ColoredLineStringFeature[] }) {
    const sections = features.filter(feature => feature.properties.status === 'planned');

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

  function plotVarianteSections({ map, features }: { map: Map; features: ColoredLineStringFeature[] }) {
    const sections = features.filter(feature => feature.properties.status === 'variante');

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

  function plotVariantePostponedSections({ map, features }: { map: Map; features: ColoredLineStringFeature[] }) {
    const sections = features.filter(feature => feature.properties.status === 'variante-postponed');

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

  function plotUnknownSections({ map, features }: { map: Map; features: ColoredLineStringFeature[] }) {
    const sections = features.filter(feature => feature.properties.status === 'unknown');

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

  function plotPostponedSections({ map, features }: { map: Map; features: ColoredLineStringFeature[] }) {
    const sections = features.filter(feature => feature.properties.status === 'postponed');

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
      map.loadImage(iconUrl, (error?: Error | null, image?: any) => {
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
            'icon-size': 1.2
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

  function plotPerspective({ map, features }: { map: Map; features: Feature[] }) {
    const perspectives = features.filter(isPerspectiveFeature).map(feature => ({
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

    map.loadImage('/icons/camera.png', (error?: Error | null, image?: any) => {
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

  function plotCompteurs({ map, features }: { map: Map; features: Feature[] }) {
    const compteurs = features.filter(isCompteurFeature);
    if (compteurs.length === 0) {
      return;
    }
    compteurs
      .sort((c1, c2) => c2.properties.counts?.at(-1).count - c1.properties.counts?.at(-1).count)
      .map((c, i) => {
        // top counters are bigger and drawn above others
        const top = 10;
        c.properties.circleSortKey = i < top ? 1 : 0;
        c.properties.circleRadius = i < top ? 10 : 7;
        c.properties.circleStrokeWidth = i < top ? 3 : 0;
        return c;
      });

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
      layout: {
        'circle-sort-key': ['get', 'circleSortKey']
      },
      paint: {
        'circle-color': '#152B68',
        'circle-stroke-color': '#fff',
        'circle-stroke-width': ['get', 'circleStrokeWidth'],
        'circle-radius': ['get', 'circleRadius']
      }
    });
    map.on('mouseenter', 'compteurs', () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', 'compteurs', () => (map.getCanvas().style.cursor = ''));
  }

  function getCompteursFeatures({
    counters,
    type
  }: {
    counters: Compteur[];
    type: 'compteur-velo' | 'compteur-voiture';
  }) {
    if (counters.length === 0) {
      return;
    }

    return counters.map(counter => ({
      type: 'Feature',
      properties: {
        type,
        name: counter.name,
        link: counter._path,
        counts: counter.counts
      },
      geometry: {
        type: 'Point',
        coordinates: counter.coordinates
      }
    }));
  }

  function fitBounds({ map, features }: { map: Map; features: Feature[] }) {
    const allLineStringsCoordinates = features
      .filter(isLineStringFeature)
      .map(feature => feature.geometry.coordinates)
      .flat();

    const allPointsCoordinates = features.filter(isPointFeature).map(feature => feature.geometry.coordinates);

    if (allPointsCoordinates.length === 0 && allLineStringsCoordinates.length === 0) {
      return;
    }

    if (features.length === 1 && allPointsCoordinates.length === 1) {
      map.flyTo({ center: allPointsCoordinates[0] });
    } else {
      const bounds = new LngLatBounds(allLineStringsCoordinates[0], allLineStringsCoordinates[0]);
      for (const coord of [...allLineStringsCoordinates, ...allPointsCoordinates]) {
        bounds.extend(coord);
      }
      map.fitBounds(bounds, { padding: 20 });
    }
  }

  function plotFeatures({ map, features }: { map: Map; features: Feature[] }) {
    const lineStringFeatures = features.filter(isLineStringFeature);
    if (lineStringFeatures.length) {
      const features = lineStringFeatures.sort(sortByLine).map(addLineColor);
      plotUnderlinedSections({ map, features });
      plotDoneSections({ map, features });
      plotPlannedSections({ map, features });
      plotVarianteSections({ map, features });
      plotVariantePostponedSections({ map, features });
      plotWipSections({ map, features });
      plotUnknownSections({ map, features });
      plotPostponedSections({ map, features });
    }
    plotPerspective({ map, features });
    plotCompteurs({ map, features });
  }

  return {
    plotFeatures,
    getCompteursFeatures,
    fitBounds
  };
};
