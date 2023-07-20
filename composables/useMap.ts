import maplibregl from 'maplibre-gl';
const { getTooltipHtml } = useTooltip();

type Properties = {
  type: 'Feature';
  properties: {
    line: number;
    color: string;
    name: string;
    distance: number;
    status: number;
    doneAt?: string;
  };
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
};

function getCrossIconUrl(color: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 8; // Set the desired width of your icon
  canvas.height = 8; // Set the desired height of your icon
  const context = canvas.getContext('2d');

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

function groupFeaturesByColor(features: Properties[]) {
  const featuresByColor = {};
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
  function plotDoneSections({ map, features }) {
    const sections = features.filter(feature => feature.properties.status === 'done');
    if (sections.length === 0) {
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

    map.on('click', 'done-sections', e => {
      new maplibregl.Popup({ closeButton: false, closeOnClick: true })
        .setLngLat(e.lngLat)
        .setHTML(getTooltipHtml(e.features[0].properties))
        .addTo(map);
    });
    map.on('mouseenter', 'done-sections', () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', 'done-sections', () => (map.getCanvas().style.cursor = ''));
  }

  function plotWipSections({ map, features }) {
    const sections = features.filter(feature => feature.properties.status === 'wip');
    if (sections.length === 0) {
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
    function animateDashArray(timestamp) {
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

    map.on('mouseenter', 'wip-sections', () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', 'wip-sections', () => (map.getCanvas().style.cursor = ''));
  }

  function plotPlannedSections({ map, features }) {
    const sections = features.filter(feature => feature.properties.status === 'planned');
    if (sections.length === 0) {
      return;
    }
    map.addSource('not-done-sections', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: sections }
    });
    map.addLayer({
      id: 'not-done-sections',
      type: 'line',
      source: 'not-done-sections',
      paint: {
        'line-width': 4,
        'line-color': ['get', 'color'],
        'line-dasharray': [2, 2]
      }
    });

    map.on('click', 'not-done-sections', e => {
      new maplibregl.Popup({ closeButton: false, closeOnClick: true })
        .setLngLat(e.lngLat)
        .setHTML(getTooltipHtml(e.features[0].properties))
        .addTo(map);
    });

    map.on('mouseenter', 'not-done-sections', () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', 'not-done-sections', () => (map.getCanvas().style.cursor = ''));
  }

  function plotVarianteSections({ map, features }) {
    const sections = features.filter(feature => feature.properties.status === 'variante');
    if (sections.length === 0) {
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
  }

  function plotUnknownSections({ map, features }) {
    const sections = features.filter(feature => feature.properties.status === 'unknown');
    if (sections.length === 0) {
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
  }

  function plotAbandonedSections({ map, features }) {
    const sections = features.filter(feature => feature.properties.status === 'abandoned');
    if (sections.length === 0) {
      return;
    }

    const featuresByColor = groupFeaturesByColor(sections);
    for (const [color, sameColorFeatures] of Object.entries(featuresByColor)) {
      map.addSource(`abandoned-sections-${color}`, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: sameColorFeatures }
      });

      const iconUrl = getCrossIconUrl(color);
      map.loadImage(iconUrl, (error, image) => {
        if (error) {
          throw error;
        }
        map.addImage(`cross-${color}`, image);

        map.addLayer({
          id: `abandoned-symbols-${color}`,
          type: 'symbol',
          source: `abandoned-sections-${color}`,
          layout: {
            'symbol-placement': 'line',
            'symbol-spacing': 1,
            'icon-image': `cross-${color}`,
            'icon-size': 1
          }
        });
        map.addLayer({
          id: `abandoned-text-${color}`,
          type: 'symbol',
          source: `abandoned-sections-${color}`,
          paint: {
            'text-halo-color': '#fff',
            'text-halo-width': 3
          },
          layout: {
            'symbol-placement': 'line',
            'symbol-spacing': 150,
            'text-font': ['Open Sans Regular'],
            'text-field': 'abandonné',
            'text-size': 14
          }
        });
        map.on('mouseenter', `abandoned-symbols-${color}`, () => (map.getCanvas().style.cursor = 'pointer'));
        map.on('mouseleave', `abandoned-symbols-${color}`, () => (map.getCanvas().style.cursor = ''));

        map.on('click', `abandoned-symbols-${color}`, e => {
          new maplibregl.Popup({ closeButton: false, closeOnClick: true })
            .setLngLat(e.lngLat)
            .setHTML(getTooltipHtml(e.features[0].properties))
            .addTo(map);
        });
      });
    }
  }

  function fitBounds({ map, features }) {
    const allCoordinates = features.map(feature => feature.geometry.coordinates).flat();
    const bounds = new maplibregl.LngLatBounds(allCoordinates[0], allCoordinates[0]);
    for (const coord of allCoordinates) {
      bounds.extend(coord);
    }
    map.fitBounds(bounds, { padding: 20 });
  }

  function isMapFullscreen() {
    return (
      !!document.fullscreenElement ||
      !!document.mozFullScreenElement ||
      !!document.webkitFullscreenElement ||
      !!document.msFullscreenElement
    );
  }

  return {
    plotDoneSections,
    plotWipSections,
    plotPlannedSections,
    plotVarianteSections,
    plotUnknownSections,
    plotAbandonedSections,
    fitBounds,
    isMapFullscreen
  };
};
