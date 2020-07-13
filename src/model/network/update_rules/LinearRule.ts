import { NeuronUpdateRule } from "./NeuronUpdateRule";
import BoundedUpdateRule from "./BoundedUpdateRule";
import { Neuron } from "../Neuron";
import clamp from "lodash.clamp";

export class LinearRule extends NeuronUpdateRule implements BoundedUpdateRule {

  lowerBound = -1;
  upperBound = 1;
  bias = 0;

  readonly graphicalLowerBound: number = this.lowerBound;
  readonly graphicalNeutral: number = (this.upperBound - this.lowerBound) / 2 + this.lowerBound;
  readonly graphicalUpperBound: number = this.upperBound;
  
  constructor(options: Pick<Partial<LinearRule>, 'lowerBound' | 'upperBound' | 'bias'>) {
    super();
    Object.assign(this, options);
  }

  compute(neuron: Neuron): number {
    return clamp(neuron.bufferedValue, this.lowerBound, this.upperBound) + this.bias;
  }

}
