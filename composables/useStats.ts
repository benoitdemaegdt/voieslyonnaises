import { groupBy } from '../helpers/helpers';
import { isLineStringFeature, type Feature, type Geojson, type LaneType, type LineStringFeature, type LaneQuality } from '../types';

export const useStats = () => {
  function getAllUniqLineStrings(voies: Geojson[]) {
    return voies
      .map(voie => voie.features)
      .flat()
      .filter(isLineStringFeature)
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

  /**
   * retourne la somme des distances de tous les tronçons passé en paramètre.
   * Attention : pas de notion de dédoublonnage ici.
   */
  function getDistance({ features }: { features: Feature[] }): number {
    return features.reduce((acc: number, feature: Feature) => {
      return acc + getLineStringDistance(feature);
    }, 0);
  }

  function getLineStringDistance(feature: Feature) {
    if (feature.geometry.type !== 'LineString') {
      throw new Error('[getLineStringDistance] Feature must be a LineString');
    }

    let distance = 0;
    const coordinates = feature.geometry.coordinates;

    for (let i = 0; i < coordinates.length - 1; i++) {
      const [lon1, lat1] = coordinates[i];
      const [lon2, lat2] = coordinates[i + 1];
      distance += haversine(lat1, lon1, lat2, lon2);
    }

    return distance;
  }

  function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
    // Convert latitude and longitude from degrees to radians
    const toRadians = (angle: number) => (angle * Math.PI) / 180;
    lat1 = toRadians(lat1);
    lon1 = toRadians(lon1);
    lat2 = toRadians(lat2);
    lon2 = toRadians(lon2);

    // Haversine formula
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.asin(Math.sqrt(a));

    // Radius of the Earth in meters
    const radius = 6371000;

    // Calculate the distance in meters
    return Math.round(radius * c);
  }

  function displayDistanceInKm(distance: number, precision = 0) {
    if (distance === 0) {
      return '0 km';
    }
    const distanceInKm = distance / 1000;
    return `${distanceInKm.toFixed(precision)} km`;
  }

  function displayPercent(percent: number) {
    return `${percent}%`;
  }

  /**
   * retourne la somme des distances de tous les tronçons passé en paramètre, aprèds avoir retiré les doublons.
   * un doublon est un tronçon commun entre 2 VLs
   */
  function getTotalDistance(voies: Geojson[]) {
    const features = getAllUniqLineStrings(voies);
    return getDistance({ features });
  }

  function getStats(voies: Geojson[]) {
    const features = getAllUniqLineStrings(voies);
    const doneFeatures = features.filter(feature => feature.properties.status === 'done');
    const wipFeatures = features.filter(feature => ['wip', 'tested'].includes(feature.properties.status));
    const plannedFeatures = features.filter(feature =>
      ['planned', 'unknown', 'variante'].includes(feature.properties.status)
    );
    const postponedFeatures = features.filter(feature =>
      ['postponed', 'variante-postponed'].includes(feature.properties.status)
    );

    const totalDistance = getDistance({ features });
    const doneDistance = getDistance({ features: doneFeatures });
    const wipDistance = getDistance({ features: wipFeatures });
    const plannedDistance = getDistance({ features: plannedFeatures });
    const postponedDistance = getDistance({ features: postponedFeatures });

    function getPercent(distance: number) {
      return Math.round((distance / totalDistance) * 100);
    }

    return {
      done: {
        name: 'Réalisés',
        distance: doneDistance,
        percent: getPercent(doneDistance),
        class: 'text-lvv-blue-600 font-semibold'
      },
      wip: {
        name: 'En travaux',
        distance: wipDistance,
        percent: getPercent(wipDistance),
        class: 'text-lvv-blue-600 font-normal'
      },
      planned: {
        name: 'Prévus',
        distance: plannedDistance,
        percent: getPercent(plannedDistance),
        class: 'text-black font-semibold'
      },
      postponed: {
        name: 'Reportés',
        distance: postponedDistance,
        percent: getPercent(postponedDistance),
        class: 'text-lvv-pink font-semibold'
      }
    };
  }

  function getStatsQuality(voies: Geojson[]): { distance: number, percent: number, nbZone: number } {
    const features = getAllUniqLineStrings(voies);
    const totalDistance = getDistance({ features });
    const unsatisfactoryFeatures = features.filter(feature => feature.properties.quality === 'unsatisfactory');

    const unsatisfactoryDistance = getDistance({ features: unsatisfactoryFeatures });

    return {
      distance: unsatisfactoryDistance,
      percent: Math.round(unsatisfactoryDistance / totalDistance * 100),
      nbZone: unsatisfactoryFeatures.length
    };
  }

  const typologyNames: Record<LaneType, string> = {
    bidirectionnelle: 'Piste bidirectionnelle',
    bilaterale: 'Piste bilatérale',
    'voie-bus': 'Voie bus',
    'voie-bus-elargie': 'Voie bus élargie',
    velorue: 'Vélorue',
    'voie-verte': 'Voie verte',
    'bandes-cyclables': 'Bandes cyclables',
    'zone-de-rencontre': 'Zone de rencontre',
    aucun: 'Aucun',
    inconnu: 'Inconnu'
  };

  const qualityNames: Record<LaneQuality, string> = {
    unsatisfactory: 'Non satisfaisant',
    satisfactory: 'Satisfaisant'
  };

  function getStatsByTypology(voies: Geojson[]) {
    const lineStringFeatures = getAllUniqLineStrings(voies);
    const totalDistance = getDistance({ features: lineStringFeatures });

    function getPercent(distance: number) {
      return Math.round((distance / totalDistance) * 100);
    }

    const featuresByType = groupBy<LineStringFeature, LaneType>(lineStringFeatures, feature => feature.properties.type);
    return Object.entries(featuresByType)
      .map(([type, features]) => {
        const distance = getDistance({ features });
        const percent = getPercent(distance);
        return {
          name: typologyNames[type as LaneType],
          percent
        };
      })
      .filter(stat => stat.percent > 0) // on ne veut pas afficher les types à 0% (arrondis)
      .sort((a, b) => b.percent - a.percent); // plus grandes barres en haut, plus propre
  }

  return {
    getAllUniqLineStrings,
    getDistance,
    getTotalDistance,
    getStats,
    getStatsByTypology,
    displayDistanceInKm,
    displayPercent,
    typologyNames,
    qualityNames,
    getStatsQuality
  };
};
