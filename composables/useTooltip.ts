const { getDistance } = useStats();

type Status = 'done' | 'wip' | 'planned' | 'postponed' | 'variante';

type Feature = {
  type: string;
  properties: {
    id?: string;
    line: string;
    color: string;
    name: string;
    status: Status;
  };
  geometry: {
    type: string;
    coordinates: number[][];
  };
};

type PoiProperties = {
  line: string;
  color: string;
  imgUrl: string;
};

function getStatusText(status: Status): string {
  const statusText = {
    done: 'Terminé',
    wip: 'En travaux',
    planned: 'Prévu',
    postponed: 'Reporté après 2026',
    variante: 'Variante',
    'variante-postponed': 'Variante reportée après 2026',
    unknown: 'Tracé à définir'
  };
  return statusText[status];
}

export const useTooltip = () => {
  function getTooltipHtml(feature: Feature) {
    return `
      <div class="h-10 flex items-center" style="background-color: ${feature.properties.color}">
        <div class="p-2">
          <a class='text-white font-bold text-lg hover:underline' href='/voie-lyonnaise-${feature.properties.line}'>
            Voie Lyonnaise ${feature.properties.line}
          </a>
        </div>
      </div>
      <div class='p-2 divide-y'>
        <div>
          <div class='text-sm font-bold'>Tronçon</div>
          <div>${feature.properties.name}</div>
        </div>
         <div>
          <div class='text-sm font-bold'>statut</div>
          <div>${getStatusText(feature.properties.status)}</div>
        </div>
         <div>
          <div class='text-sm font-bold'>distance</div>
          <div>${Math.round(getDistance({ features: [feature] }) / 25) * 25}m</div>
        </div>
      </div>
    `;
  }

  function getTooltipPoi(properties: PoiProperties) {
    return `
      <div class="h-10 flex items-center" style="background-color: ${properties.color}">
        <div class="p-2">
          <a class='text-white font-bold text-lg hover:underline' href='/voie-lyonnaise-${properties.line}'>
            Voie Lyonnaise ${properties.line}
          </a>
        </div>
      </div>
      <img src="${properties.imgUrl}" class='my-0'>
    `;
  }

  return { getTooltipHtml, getTooltipPoi };
};
