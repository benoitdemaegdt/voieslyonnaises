type Feature = {
  type: string;
  properties: {
    id?: string;
    line?: string;
    color?: string;
    name?: string;
    distance?: number;
    status?: string;
  };
  geometry: {
    type: string;
    coordinates: number[] | number[][];
  };
};

type Geojson = {
  type: string;
  features: Feature[];
};

export const useStats = () => {
  function getAllUniqSections(voies: Geojson[]) {
    return voies
      .map(voie => voie.features)
      .flat()
      .filter(feature => feature.geometry.type === 'LineString')
      .filter((feature, index, sections) => {
        if (feature.properties.id === undefined) {
          return true;
        }
        if (feature.properties.id === 'variante2') {
          return false;
        }

        return index === sections.findIndex(section => section.properties.id === feature.properties.id);
      });
  }

  function getDistance({ allSections, status }) {
    const distanceInMeters = allSections
      .filter(feature => status.includes(feature.properties.status))
      .reduce((acc, section) => {
        if (!section.properties.distance) {
          console.log('section >>', section);
          return acc;
        }
        return acc + section.properties.distance;
      }, 0);

    return Math.round(distanceInMeters / 1000);
  }

  return { getAllUniqSections, getDistance };
};
