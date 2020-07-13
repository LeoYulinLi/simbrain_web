import { Emitter } from "../../../events/emitter";

export interface NetworkModel {
  update(): void;
  events: Emitter<{ delete: NetworkModel }>

  delete(): void;
}

export default NetworkModel;
