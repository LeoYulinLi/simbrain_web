import LocatableModel from "./interfaces/LocatableModel";
import eventEmitter from "../../events/emitter";
import NetworkModel from "./interfaces/NetworkModel";
import { Coordinate } from "../../utils/geom";
import { Synapse } from "./Synapse";
import { NeuronUpdateRule } from "./update_rules/NeuronUpdateRule";
import { LinearRule } from "./update_rules/LinearRule";

export class Neuron implements LocatableModel, NetworkModel {

  updateRule: NeuronUpdateRule = new LinearRule({ lowerBound: -1, upperBound: 1 });

  coordinate: Coordinate = { x: 0, y: 0 };

  clamped = false;

  bufferedValue = 0;

  value = 0;

  fanOuts: Synapse[] = []

  events = eventEmitter<{ location: Coordinate, delete: Neuron }>();

  constructor(options?: Pick<Partial<Neuron>, 'updateRule' | 'coordinate' | 'clamped'>) {
    Object.assign(this, options);
  }

  update(): void {
    this.value = this.updateRule.compute(this);
    this.bufferedValue = 0;
  }

  delete(): void {
    this.events.fire("delete", this);
  }

}
