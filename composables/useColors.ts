import config from '~/config.json';

export const useColors = () => {
  function getLineColor(line: number): string {
    const black = '#000000';
    const lineConfig = config.colors.find((color) => color.line === line);
    if (!lineConfig) { return black; }
    return lineConfig.color;
  }

  function getTransportColor(type: string, line: string): string {
    const black = '#000000';
    const lineConfig = config.transportColors.find((color) => color.type === type && color.line === line);
    if (!lineConfig) { return black; }
    return lineConfig.color;
  }

  return { getLineColor, getTransportColor };
};
