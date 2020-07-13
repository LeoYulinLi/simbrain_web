import NetworkModel from "./interfaces/NetworkModel";
import { Neuron } from "./Neuron";
import eventEmitter from "../../events/emitter";

export class Synapse implements NetworkModel {

  source!: Neuron;

  target!: Neuron;

  weight = 1;

  events =  eventEmitter<{ delete: Synapse }>();

  constructor(options: Pick<Synapse, 'source' | 'target'> & Pick<Partial<Synapse>, 'weight'>) {
    Object.assign(this, options);
    options.source.events.on("delete", this.delete);
    options.target.events.on("delete", this.delete);
  }

  update() {
    this.target.bufferedValue += this.source.value * this.weight;
  }

  delete(): void {
    this.events.fire("delete", this);
  }

}
