type PerspectiveProperties = {
  line: number;
  imgUrl: string;
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

  return { getTooltipPerspective };
};
