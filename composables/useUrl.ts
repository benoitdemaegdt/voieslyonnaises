import config from '~/config.json';

export const useUrl = () => {
  function withoutTrailingSlash(path: string): string {
    return path.endsWith('/') ? path.slice(0, -1) : path;
  }

  function getVoieCyclablePath(line: number) {
    return `${config.slug}-${line}`;
  }

  function getVoieCyclableRegex() {
    return new RegExp(`${config.slug}-(1[0-2]|[1-9])\\b`);
  }

  return { withoutTrailingSlash, getVoieCyclablePath, getVoieCyclableRegex };
};
