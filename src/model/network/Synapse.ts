import NetworkModel from "./interfaces/NetworkModel";
import { Neuron } from "./Neuron";
import eventEmitter from "../../events/emitter";

export class Synapse implements NetworkModel {

  source!: Neuron;

  target!: Neuron;

  weight = 1;

  events =  eventEmitter<{
    delete: Synapse,
    location: Synapse,
  }>();

  constructor(options: Pick<Synapse, 'source' | 'target'> & Pick<Partial<Synapse>, 'weight'>) {
    const { source, target } = options;
    Object.assign(this, options);

    source.events.on("delete", this.delete.bind(this));
    source.events.on("location", () => this.events.fire("location", this));
    target.events.on("delete", this.delete.bind(this));
    target.events.on("location", () => this.events.fire("location", this));

    source.fanOuts.add(this);
  }

  update() {
    this.target.bufferedValue += this.source.value * this.weight;
  }

  delete(): void {
    this.source.fanOuts.delete(this);
    this.events.fire("delete", this);
  }

}
