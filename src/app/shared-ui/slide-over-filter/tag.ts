export interface Tag {
  translationKey: string;
  value: string;
  callback: () => void;
}

export const getTag = (translationKey, value, callback) => ({translationKey, value, callback});
