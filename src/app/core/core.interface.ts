export interface HasUnsavedData {
  hasUnsavedData(): boolean;

  hasUnsavedDataBeforeUnload(): boolean;
}
