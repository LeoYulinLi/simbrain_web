import NetworkModel from "./interfaces/NetworkModel";
import { Neuron } from "./Neuron";
import eventEmitter from "../../events/emitter";

export class Synapse implements NetworkModel {

  source!: Neuron;

  target!: Neuron;

  private _weight = 1;

  events =  eventEmitter<{
    updated: Synapse,
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
    this.target.bufferedValue += this.source.value * this._weight;
  }

  delete(): void {
    this.source.fanOuts.delete(this);
    this.events.fire("delete", this);
  }


  get weight(): number {
    return this._weight;
  }

  set weight(value: number) {
    this._weight = value;
    this.events.fire("updated", this);
  }

  increaseWeight(): void {
    this.weight += 0.1;
  }

  decreaseWeight(): void {
    this.weight -= 0.1;
  }

}
