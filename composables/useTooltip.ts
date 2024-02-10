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

export const useTooltip = () => {
  const { getLineColor } = useColors();

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

  return { getTooltipPerspective, getTooltipCompteur };
};
