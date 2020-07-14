import Network from "../../model/network/Network";
import paper from "paper";
import { NeuronNode } from "./NeuronNode";
import { Neuron } from "../../model/network/Neuron";
import { Coordinate } from "../../utils/geom";

export default class NetworkPanel {

  private project = paper.project;

  private lastClickPosition: Coordinate = { x: 0, y: 0 };

  private layers = {
    marquee: new paper.Layer(),
    handles: new paper.Layer(),
    nodes: new paper.Layer(),
    connections: new paper.Layer()
  }

  constructor(private network: Network) {
    network.events.on("neuronAdded", this.addNeuron.bind(this));

    this.project.addLayer(this.layers.marquee);
    this.project.addLayer(this.layers.handles);
    this.project.addLayer(this.layers.nodes);
    this.project.addLayer(this.layers.connections);

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
    console.log(this.network.neurons);
    this.layers.nodes.addChild(neuronNode.node);
    neuron.events.on("delete", () => {
      neuronNode.node.remove();
    });
    neuron.events.on("location", location => {
      const { x, y } = location;
      neuronNode.node.position = new paper.Point(x, y);
    });
    neuronNode.node.onMouseDown = () => neuronNode.node.bringToFront();
  }
}
