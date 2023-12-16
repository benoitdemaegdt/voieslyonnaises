const { getDistance } = useStats();

type Status = 'done' | 'wip' | 'planned' | 'postponed' | 'variante';

type Feature = {
  type: string;
  properties: {
    id?: string;
    line: number;
    name: string;
    status: Status;
    doneAt?: string;
  };
  geometry: {
    type: string;
    coordinates: number[][];
  };
};

type PerspectiveProperties = {
  line: number;
  imgUrl: string;
};

type CompteurProperties = {
  type: 'compteur';
  name: string;
  link: string;
  lastRecordDate: string;
  lastRecordValue: string;
};

function getStatusText(status: Status, doneAt?: string): string {
  const statusText = {
    done: `Terminé (${getDoneAtText(doneAt!)})`,
    wip: 'En travaux',
    planned: 'Prévu',
    postponed: 'Reporté après 2026',
    variante: 'Variante',
    'variante-postponed': 'Variante reportée après 2026',
    unknown: 'Tracé à définir'
  };
  return statusText[status];
}

function getDoneAtText(doneAt: string): string {
  const [day, month, year] = doneAt.split('/');
  const isBeforeMandat =
    new Date(Number(year), Number(month) - 1, Number(day)).getTime() < new Date(2020, 0, 1).getTime();
  if (isBeforeMandat) {
    return 'avant 2020';
  }
  return `le ${doneAt}`;
}

export const useTooltip = () => {
  const { getLineColor } = useColors();

  function getTooltipHtml(feature: Feature) {
    const color = getLineColor(feature.properties.line);
    return `
      <div class="not-prose text-black">
        <div class="h-10 flex items-center" style="background-color: ${color}">
          <div class="p-2">
            <a class='text-white font-bold text-lg hover:underline' href='/voie-lyonnaise-${feature.properties.line}'>
              Voie Lyonnaise ${feature.properties.line}
            </a>
          </div>
        </div>
        <div class='p-2 divide-y'>
          <div>
            <div class='text-sm font-bold'>Tronçon</div>
            <div >${feature.properties.name}</div>
          </div>
           <div>
            <div class='text-sm font-bold'>statut</div>
            <div>${getStatusText(feature.properties.status, feature.properties.doneAt)}</div>
          </div>
           <div>
            <div class='text-sm font-bold'>distance</div>
            <div>${Math.round(getDistance({ features: [feature] }) / 25) * 25}m</div>
          </div>
        </div>
      </div>
    `;
  }

  function getTooltipPerspective(properties: PerspectiveProperties) {
    const color = getLineColor(properties.line);
    return `
      <div class="h-10 flex items-center not-prose text-black" style="background-color: ${color}">
        <div class="p-2">
          <a class='text-white font-bold text-lg hover:underline' href='/voie-lyonnaise-${properties.line}'>
            Voie Lyonnaise ${properties.line}
          </a>
        </div>
      </div>
      <img src="${properties.imgUrl}" class='my-0'>
    `;
  }

  function getTooltipCompteur(properties: CompteurProperties) {
    return `
      <div class="flex items-center bg-lvv-blue-600 not-prose text-black rounded-t">
        <div class="p-2">
          <a class='text-white font-bold text-lg hover:underline' href='${properties.link}'>
            ${properties.name}
          </a>
        </div>
      </div>
      <div class='px-2 py-1 divide-y text-gray-800'>
         <div>
           <div class='text-left text-base font-bold'>${properties.lastRecordDate}</div>
           <div class="text-left text-base">${properties.lastRecordValue}</div>
         </div>
      </div>
    `;
  }

  return { getTooltipHtml, getTooltipPerspective, getTooltipCompteur };
};
