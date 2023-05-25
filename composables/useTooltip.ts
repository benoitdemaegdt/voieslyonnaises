type Properties = {
  line: string;
  color: string;
  name: string;
  distance: number;
  isDone: boolean;
};

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
          <div class='text-sm font-bold'>Distance</div>
          <div>${properties.distance}m</div>
        </div>
         <div>
          <div class='text-sm font-bold'>statut</div>
          <div>${properties.isDone ? 'terminé' : 'non terminé'}</div>
        </div>
      </div>
    `;
  }

  return { getTooltipHtml };
};
