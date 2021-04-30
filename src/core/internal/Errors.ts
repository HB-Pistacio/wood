export class WOODInitError extends Error {
  constructor() {
    super();

    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, WOODInitError);
    }

    this.name = "WOODInitError";
    this.message = `Attach WOOD to a root using 'WOOD.attachTo('#your-canvas')'`;
  }
}
