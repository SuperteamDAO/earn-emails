export const getListingTypeLabel = (type: string) => {
  if (type === 'project') return 'Project';
  if (type === 'hackathon') return 'Hackathon Track';
  return 'Bounty';
};
