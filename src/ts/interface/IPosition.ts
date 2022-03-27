import TsDom from "../model/tsdom";

export interface IPosition {
  readonly position?: string;

  calculate: () => void;
  instances: () => Array<TsDom>;
}
