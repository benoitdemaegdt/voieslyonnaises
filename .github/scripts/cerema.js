/**
 * Le cerema est l'organisme qui remonte les données des compteurs voiture, à Lyon et ailleurs.
 * Il faut probablement voir ça comme l'équivalent de éco-compteur, pour les voitures.
 * Interface web : https://avatar.cerema.fr/cartographie
 * API : https://avatar.cerema.fr/api/doc
 *
 * À priori, ça semble jouable de récupérer les données des compteurs.
 * Il faut utiliser le endpoint /fixed_measures, sur lequel ils passent une couche de ML pour éviter le bruit
 * qui existe de par la nature physique des compteurs (trou dans les données, ou à l'inverse pic).
 *
 * À noter que ce endpoint retourne un point toutes les 6min. Il faut donc pas mal boucler pour récupérer
 * les données mensuelles qu'on exploite sur cyclopolis.
 *
 * Script toujours en WIP
 */

(async () => {
  // await getAllCeremaCounters();
  await getCompteurData();
})();

/**
 * récupération des données d'un compteur
 */
async function getCompteurData() {
  const params = new URLSearchParams({
    count_point_ids: 1990, // Sortie_Voies_Nord_XRousse
    as_vehicle_nb: true,
    start_time: '2017-01-01T00:00:00+01:00',
    end_time: '2017-01-31T23:59:59+01:00',
    time_zone: 'Europe/Paris',
    limit: 10000 // un point toutes les 6 minutes
  });
  const URL = 'https://avatar.cerema.fr/api/fixed_measures/?' + params.toString();
  const res = await fetch(URL, {
    headers: {
      'X-Fields': 'id,count_point_name,station_name,op_road_name'
    }
  });
  if (res.ok) {
    const data = await res.json();
    console.log(data.reduce((acc, item) => acc + item.q, 0));
  } else {
    console.log(res.statusText);
    console.error('[getCompteurData] An error happened while fetching counter data');
    process.exit(1);
  }
}

/**
 * récupération de tous les compteurs de la métropole de Lyon
 */
async function getAllCeremaCounters() {
  const params = new URLSearchParams({
    offset: 3, // les compteurs lyonnais sont 3ème dans la liste
    limit: 1,
    include_count_points: true
  });
  const URL = 'https://avatar.cerema.fr/api/operators?' + params.toString();
  const res = await fetch(URL);
  if (res.ok) {
    const data = await res.json();
    const compteurs = data[0].count_points.map(item => ({
      id: item.id,
      count_point_name: item.count_point_name,
      station_name: item.station_name,
      op_road_name: item.op_road_name
    }));
    console.log(JSON.stringify(compteurs, null, 2));
  } else {
    console.error('[getAllCeremaCounters] An error happened while fetching counters');
    process.exit(1);
  }
}
