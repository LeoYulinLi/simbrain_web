import { Emitter } from "../../../events/emitter";
import { Neuron } from "../Neuron";

export interface NetworkModel {
  update(): void;
  events: Emitter<{ delete: NetworkModel }>

  delete(): void;
}

export default NetworkModel;
