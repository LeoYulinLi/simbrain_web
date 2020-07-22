import NetworkModel from "../../model/network/interfaces/NetworkModel";
import NetworkPanel from "./NetworkPanel";
import { Neuron } from "../../model/network/Neuron";
import { Synapse } from "../../model/network/Synapse";

export default class NetworkClipboard {
  private copiedModel: NetworkModel[] = []

  addModel(models: NetworkModel[]): void {
    this.copiedModel.length = 0;
    this.copiedModel.push(...models);
  }

  paste(networkPanel: NetworkPanel) {
    const mapping = new Map<Neuron, Neuron>();
    const tag = Math.random();
    this.copiedModel.forEach(model => {
      if (model instanceof Neuron) {
        const newNeuron = networkPanel.network.createNeuron(model);
        mapping.set(model, newNeuron);
        newNeuron.select(tag);
      }
    });
    this.copiedModel.forEach(model => {
      if (model instanceof Synapse) {
        const newSource = mapping.get(model.source);
        const newTarget = mapping.get(model.target);
        if (newSource && newTarget) {
          console.log(model.weight);
          const newSynapse = networkPanel.network.createSynapse({
            weight: model.weight,
            source: newSource,
            target: newTarget 
          });
          newSynapse?.select(tag);
        }
      }
    });
  }

}
