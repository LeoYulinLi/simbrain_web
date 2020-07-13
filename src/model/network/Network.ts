import { Synapse } from "./Synapse";
import { Neuron } from "./Neuron";

export default class Network {


  private _neurons: Record<string, Neuron> = {};
  private _synapses: Record<string, Synapse> = {};


  get neurons(): Record<string, Neuron> {
    return this._neurons;
  }

  get synapses(): Record<string, Synapse> {
    return this._synapses;
  }

  update(peek?: (network: Network) => void): void {
    Object.values(this.synapses).forEach(s => s.update());
    Object.values(this.neurons).forEach(n => n.update());
    if (peek) peek(this);
  }

  createNeuron(...options: ConstructorParameters<typeof Neuron>): Neuron {
    const newNeuron = new Neuron(...options);
    const id = Math.random();
    this.neurons[id] = newNeuron;
    newNeuron.events.on("delete", () => {
      delete this.neurons[id];
    });
    return newNeuron;
  }

  createSynapse(...options: ConstructorParameters<typeof Synapse>): Synapse {
    const newSynapse = new Synapse(...options);
    const id = Math.random();
    this.synapses[id] = newSynapse;
    newSynapse.events.on("delete", () => {
      delete this.synapses[id];
    });
    return newSynapse;
  }

}
