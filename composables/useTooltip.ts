type Status = 'done' | 'wip' | 'planned' | 'postponed' | 'variante';

type Properties = {
  line: string;
  color: string;
  name: string;
  distance: number;
  status: Status;
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
  function getTooltipHtml(properties: Properties) {
    return `
      <div class="h-10 flex items-center" style="background-color: ${properties.color}">
        <div class="p-2">
          <div class='text-white font-bold text-lg'>Voie Lyonnaise ${properties.line}</div>
        </div>
      </div>
      <div class='p-2 divide-y'> 
        <div>
          <div class='text-sm font-bold'>Tronçon</div>
          <div>${properties.name}</div>
        </div>
         <div>
          <div class='text-sm font-bold'>statut</div>
          <div>${getStatusText(properties.status)}</div>
        </div>
         <div>
          <div class='text-sm font-bold'>distance</div>
          <div>${Math.round(properties.distance / 25) * 25}m</div>
        </div>
      </div>
    `;
  }

  function getTooltipPoi(properties: PoiProperties) {
    return `
      <div class="h-10 flex items-center" style="background-color: ${properties.color}">
        <div class="p-2">
          <div class='text-white font-bold text-lg'>Voie Lyonnaise ${properties.line}</div>
        </div>
      </div>
      <img src="${properties.imgUrl}" class='my-0'>
    `;
  }

  return { getTooltipHtml, getTooltipPoi };
};
