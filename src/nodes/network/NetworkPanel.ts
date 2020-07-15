import Network from "../../model/network/Network";
import paper from "paper";
import { NeuronNode } from "./NeuronNode";
import { Neuron } from "../../model/network/Neuron";
import { Coordinate } from "../../utils/geom";
import SelectionManager from "./SelectionManager";
import { Synapse } from "../../model/network/Synapse";
import SynapseNode from "./SynapseNode";

export default class NetworkPanel {

  private project = paper.project;

  private lastClickPosition: Coordinate = { x: 0, y: 0 };

  private selectionManager = new SelectionManager();

  private layers = {
    marquee: new paper.Layer(),
    handles: new paper.Layer(),
    nodes: new paper.Layer(),
    connections: new paper.Layer()
  }

  constructor(private network: Network) {
    network.events.on("neuronAdded", this.addNeuron.bind(this));
    network.events.on("synapseAdded", this.addSynapse.bind(this));

    this.project.addLayer(this.layers.connections);
    this.project.addLayer(this.layers.nodes);
    this.project.addLayer(this.layers.handles);
    this.project.addLayer(this.layers.marquee);

    paper.tool.onMouseUp = (event: paper.MouseEvent) => {
      this.lastClickPosition = event.point;
      this.project.view.zoom = this.preferredZoomLevel;
      this.project.view.center = this.layerBound.center;
    };

    console.log(paper.tools);

    paper.tool.on("keydown", (event: paper.KeyEvent) => {
      switch (event.key) {
        case "p":
          network.createNeuron({ coordinate: this.lastClickPosition });
          break;
        case "1":
          this.selectionManager.markSelectionAsSource();
          break;
        case "2":{
          this.selectionManager.sourceNodes.forEach(s => {
            this.selectionManager.selectedNodes.forEach(t => {
              if (t instanceof NeuronNode) {
                network.createSynapse({ source: s.neuron, target: t.neuron });
              }
            });
          });
        }
      }
    });

  }

  get preferredZoomLevel(): number {
    if (this.layerBound.isEmpty()) return 1;
    return Math.min(
      this.project.view.viewSize.width / this.layerBound.width,
      this.project.view.viewSize.height / this.layerBound.height
    );
  }

  get layerBound(): paper.Rectangle {
    return this.layers.nodes.bounds.scale(1.1);
  }

  private addNeuron(neuron: Neuron) {
    const neuronNode = new NeuronNode(neuron);
    this.layers.nodes.addChild(neuronNode.node);
    neuron.events.on("delete", () => {
      neuronNode.node.remove();
    });
    neuron.events.on("location", location => {
      const { x, y } = location;
      neuronNode.node.position = new paper.Point(x, y);
    });
    neuronNode.node.onMouseDown = () => neuronNode.node.bringToFront();
    neuronNode.node.on("click", (event: paper.MouseEvent) => {
      event.stopPropagation();
      this.selectionManager.select([neuronNode]);
    });
    this.project.view.on("click", () => {
      this.selectionManager.select([]);
    });
  }

  private addSynapse(synapse: Synapse) {
    const synapseNode = new SynapseNode(synapse);
    this.layers.connections.addChild(synapseNode.node);
    synapse.events.on("delete", () => synapseNode.node.remove());
    console.log(this.network.synapses);
  }

}
