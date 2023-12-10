import type { ITheme } from '../types';

const strReg = /^"(.*)"$/;
export const urlReg = /^https:\/\/.*\.wikipedia\.org\/.*$/;

export const getThemeData = (themes: ITheme[], themeName: string) => {
  const name = strReg.test(themeName)
    ? themeName.replace(strReg, '$1')
    : themeName;
  return themes.find((theme) => theme.name === name);
};
