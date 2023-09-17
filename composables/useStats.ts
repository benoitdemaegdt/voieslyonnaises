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
  function getAllSections(voies: Geojson[]) {
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

  return { getAllSections };
};
