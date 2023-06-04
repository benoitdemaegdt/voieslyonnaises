import maplibregl from 'maplibre-gl';
const { getTooltipHtml } = useTooltip();

export const useMap = () => {
  function plotDoneSections({ map, features }) {
    const sections = features.filter(feature => feature.properties.isDone);
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

  function plotNotDoneSections({ map, features }) {
    const sections = features.filter(feature => feature.properties.isDone === false);
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

  return { plotDoneSections, plotNotDoneSections, fitBounds };
};
