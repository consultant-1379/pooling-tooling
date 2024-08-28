// eslint-disable-next-line func-style, prefer-arrow/prefer-arrow-functions
export function initializer(): () => Promise<any> {
  return (): Promise<any> => new Promise(async (resolve, reject) => {
      try {
        resolve(Promise);
      } catch (error) {
        reject(error);
      }
    });
}
