import Network from "../../model/network/Network";
import paper from "paper";
import { NeuronNode } from "./NeuronNode";
import { Neuron } from "../../model/network/Neuron";
import { Coordinate } from "../../utils/geom";

export default class NetworkPanel {

  private project = paper.project;

  private lastClickPosition: Coordinate = { x: 0, y: 0 };

  constructor(private network: Network) {
    network.events.on("neuronAdded", this.addNeuron.bind(this));

    const tool = new paper.Tool();
    tool.onMouseUp = (event: paper.MouseEvent) => {
      this.lastClickPosition = event.point;
    };

    tool.onKeyDown = (event: paper.KeyEvent) => {
      switch (event.key) {
      case "p": network.createNeuron({ coordinate: this.lastClickPosition });
      }
    };
  }

  private addNeuron(neuron: Neuron) {
    const neuronNode = new NeuronNode(neuron);
    this.project.activeLayer.addChild(neuronNode.node);
    neuron.events.on("delete", () => {
      neuronNode.node.remove();
    });
    neuron.events.on("location", location => {
      const { x, y } = location;
      neuronNode.node.position = new paper.Point(x, y);
    });
  }
}
