export * from './getListingTypeLabel';
export * from './getPriority';
export * from './getUserEmailPreference';
export * from './processLogic';
export * from './queue';
export * from './feed'
export * from './comment'

export const capitalizeWords = (str: string): string => {
  if (!str) return '';
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
