export const setAdditionalText = (isProduction: boolean): string => {
  const url = window.location.origin;
  let text = '';
  if (url.includes('rpt-staging')) {
    text = ' (STAGING)';
  } else if (isProduction === false) {
    text = ' (DEV)';
  }
  return text;
};
