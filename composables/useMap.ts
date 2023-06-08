import maplibregl from 'maplibre-gl';
const { getTooltipHtml } = useTooltip();

export const useMap = () => {
  function plotDoneSections({ map, features }) {
    const sections = features.filter(feature => feature.properties.status === 'done');
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

  function plotUnknownSections({ map, features }) {
    const sections = features.filter(feature => feature.properties.status === 'unknown');
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
        'line-width': 20,
        'line-color': ['get', 'color'],
        'line-opacity': 0.2
      }
    });
    map.addLayer({
      id: 'symbols',
      type: 'symbol',
      source: 'unknown-sections',
      layout: {
        'symbol-placement': 'line-center',
        'text-font': ['Open Sans Regular'],
        'text-field': 'tracé exact inconnu',
        'text-size': 14
      }
    });
  }

  function fitBounds({ map, features }) {
    const allCoordinates = features.map(feature => feature.geometry.coordinates).flat();
    const bounds = new maplibregl.LngLatBounds(allCoordinates[0], allCoordinates[0]);
    for (const coord of allCoordinates) {
      bounds.extend(coord);
    }
    map.fitBounds(bounds, { padding: 20 });
  }

  return { plotDoneSections, plotWipSections, plotPlannedSections, plotUnknownSections, fitBounds };
};
