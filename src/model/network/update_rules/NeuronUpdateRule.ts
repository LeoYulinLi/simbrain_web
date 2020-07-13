import { Neuron } from "../Neuron";

export abstract class NeuronUpdateRule {

  abstract graphicalUpperBound: number
  abstract graphicalNeutral: number
  abstract graphicalLowerBound: number

  abstract compute(neuron: Neuron): number

}
