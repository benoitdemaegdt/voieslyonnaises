export const useGeojson = () => {
  function getGeojsonFeatures (voie: any) {
    if (!voie.sections) { return [] }
    return voie.sections.map((section: any) => ({
      type: 'Feature',
      properties: {
        line: voie.line,
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
