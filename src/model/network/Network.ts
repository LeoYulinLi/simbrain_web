import NetworkModel from "./interfaces/NetworkModel";
import { Synapse } from "./Synapse";
import { Neuron } from "./Neuron";

export default class Network {

  private _networkModels: Set<NetworkModel> = new Set<NetworkModel>();

  get networkModels(): Set<NetworkModel> {
    return this._networkModels;
  }

  update() {
    this.networkModels.forEach(m => m.update());
  }

  createNeuron(options: ConstructorParameters<typeof Neuron>) {
    const newNeuron = new Neuron(...options);
    this.networkModels.add(newNeuron);
    newNeuron.events.on("delete", () => {
      this.networkModels.delete(newNeuron);
    });
  }

  createSynapse(options: ConstructorParameters<typeof Synapse>) {
    const newSynapse = new Synapse(...options);
    this.networkModels.add(newSynapse);
    newSynapse.events.on("delete", () => {
      this.networkModels.delete(newSynapse);
    });
  }

}
