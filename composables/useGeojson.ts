export const useGeojson = () => {
  function getGeojsonFeatures(voie) {
    if (!voie.sections) return []
    return voie.sections.map(section => ({
      type: 'Feature',
      properties: {
        name: `Ligne ${voie.line}`,
        color: voie.color,
        ...section.properties
      },
      geometry: {
        type: 'LineString',
        coordinates: section.coordinates
      }
    }))
  }

  return { getGeojsonFeatures }
}
