type Status = 'done' | 'wip' | 'planned' | 'abandoned' | 'variante';

type Properties = {
  line: string;
  color: string;
  name: string;
  distance: number;
  status: Status;
};

function getStatusText(status: Status): string {
  const statusText = {
    done: 'Terminé',
    wip: 'En travaux',
    planned: 'Prévu',
    abandoned: 'Abandonné',
    variante: 'Variante'
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
      </div>
    `;
  }

  return { getTooltipHtml };
};
