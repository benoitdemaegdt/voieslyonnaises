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
        'line-dasharray': [0, 4, 3]
      }
    });

    const dashArraySequence = [
      [0, 4, 3],
      [0.5, 4, 2.5],
      [1, 4, 2],
      [1.5, 4, 1.5],
      [2, 4, 1],
      [2.5, 4, 0.5],
      [3, 4, 0],
      [0, 0.5, 3, 3.5],
      [0, 1, 3, 3],
      [0, 1.5, 3, 2.5],
      [0, 2, 3, 2],
      [0, 2.5, 3, 1.5],
      [0, 3, 3, 1],
      [0, 3.5, 3, 0.5]
    ];
    let step = 0;
    function animateDashArray(timestamp) {
      // Update line-dasharray using the next value in dashArraySequence. The
      // divisor in the expression `timestamp / 50` controls the animation speed.
      const newStep = parseInt((timestamp / 50) % dashArraySequence.length);

      if (newStep !== step) {
        map.setPaintProperty('wip-sections', 'line-dasharray', dashArraySequence[step]);
        step = newStep;
      }

      // Request the next frame of the animation.
      requestAnimationFrame(animateDashArray);
    }
    animateDashArray(0);
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
        'line-dasharray': [1.5, 1.5]
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

  function fitBounds({ map, features }) {
    const allCoordinates = features.map(feature => feature.geometry.coordinates).flat();
    const bounds = new maplibregl.LngLatBounds(allCoordinates[0], allCoordinates[0]);
    for (const coord of allCoordinates) {
      bounds.extend(coord);
    }
    map.fitBounds(bounds, { padding: 20 });
  }

  return { plotDoneSections, plotWipSections, plotPlannedSections, fitBounds };
};
