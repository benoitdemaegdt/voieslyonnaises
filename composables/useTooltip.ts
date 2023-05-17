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
      <div class="flex items-center text-base font-extrabold tracking-tight text-gray-900">
        <div>Ligne</div>
        <div
          class="ml-1 h-5 w-5 rounded-full flex items-center justify-center text-white font-bold"
          style="background-color: ${properties.color}"
        >
          ${properties.line}
        </div>
      </div>
      <div class="text-sm font-semibold text-gray-800">${properties.name}</div>
      <p>${properties.isDone ? 'tronçon terminé' : 'tronçon non terminé'}</p>
    `;
  }

  return { getTooltipHtml };
};
