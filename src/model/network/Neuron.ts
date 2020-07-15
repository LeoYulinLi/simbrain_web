import LocatableModel from "./interfaces/LocatableModel";
import eventEmitter from "../../events/emitter";
import NetworkModel from "./interfaces/NetworkModel";
import { Coordinate } from "../../utils/geom";
import { Synapse } from "./Synapse";
import { NeuronUpdateRule } from "./update_rules/NeuronUpdateRule";
import { LinearRule } from "./update_rules/LinearRule";

export class Neuron implements LocatableModel, NetworkModel {

  updateRule: NeuronUpdateRule = new LinearRule({ lowerBound: -1, upperBound: 1 });

  private _coordinate: Coordinate = { x: 50, y: 50 };

  clamped = false;

  bufferedValue = 0;

  private _value = 0;

  fanOuts: Synapse[] = []

  events = eventEmitter<{
    location: Coordinate,
    delete: Neuron,
    value: number,
    selected: Neuron,
  }>();

  constructor(options?: Pick<Partial<Neuron>, 'updateRule' | 'coordinate' | 'clamped' | 'value'>) {
    Object.assign(this, options);
  }

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    this._value = value;
    this.events.fire("value", value);
  }

  update(): void {
    this.value = this.updateRule.compute(this);
    this.bufferedValue = 0;
  }

  delete(): void {
    this.events.fire("delete", this);
  }

  select(): void {
    this.events.fire("selected", this);
  }

  get coordinate(): Coordinate {
    return this._coordinate;
  }

  set coordinate(value: Coordinate) {
    this._coordinate = value;
    this.events.fire("location", value);
  }

}
