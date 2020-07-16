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
    nodes: new paper.Layer(),
    connections: new paper.Layer()
  }

  private keyBindings: {[key: string]: () => void} = {
    "p": () => this.network.createNeuron({ coordinate: this.lastClickPosition }),
    "1": () => this.selectionManager.markSelectionAsSource(),
    "2": () => {
      this.selectionManager.sourceNodes.forEach(s => {
        this.selectionManager.selectedNodes.forEach(t => {
          if (t instanceof NeuronNode) {
            this.network.createSynapse({ source: s.neuron, target: t.neuron, weight: Math.random() * 5 - 2 });
          }
        });
      });
    },
    "up": () => {
      this.selectionManager.selectedNodes.forEach(t => {
        if (t instanceof NeuronNode) {
          t.increaseActivation();
        }
      });
    },
    "down": () => {
      this.selectionManager.selectedNodes.forEach(node => {
        if (node instanceof NeuronNode) {
          node.decreaseActivation();
        }
      });
    },
    "space": () => this.network.update(),
    "n": () => Object.values(this.network.neurons).forEach(neuron => neuron.select()),
    "delete": () => this.selectionManager.selectedNodes.forEach(n => n.delete()),
    "d": () => {
      console.log(this.network.neurons);
      console.log(this.network.synapses);
    }
  }

  constructor(private network: Network) {
    network.events.on("neuronAdded", this.addNeuron.bind(this));
    network.events.on("synapseAdded", this.addSynapse.bind(this));

    this.project.addLayer(this.layers.connections);
    this.project.addLayer(this.layers.nodes);
    this.project.addLayer(this.layers.marquee);

    paper.tool.onMouseUp = (event: paper.MouseEvent) => {
      this.lastClickPosition = event.point;
      this.autoZoom();
    };

    paper.tool.on("keydown", (event: paper.KeyEvent) => this.keyBindings[event.key]?.());

  }

  get preferredZoomLevel(): number {
    if (this.layerBound.isEmpty()) return 1;
    const zoomLevel =  Math.min(
      this.project.view.viewSize.width / this.layerBound.width,
      this.project.view.viewSize.height / this.layerBound.height
    );
    if (zoomLevel < 10) return zoomLevel; else return 10;
  }

  get layerBound(): paper.Rectangle {
    return this.layers.nodes.bounds.scale(1.1);
  }

  private addNeuron(neuron: Neuron) {
    const neuronNode = new NeuronNode(neuron);
    this.layers.nodes.addChild(neuronNode.node);
    this.autoZoom();
    neuron.events.on("delete", () => {
      neuronNode.node.remove();
    });
    neuron.events.on("location", location => {
      const { x, y } = location;
      neuronNode.node.position = new paper.Point(x, y);
    });
    neuronNode.events.on("selected", () => {
      this.selectionManager.addSelection([neuronNode]);
    });
    neuronNode.node.onMouseDown = (event: paper.MouseEvent) => {
      event.stopPropagation();
      neuronNode.node.bringToFront();
      this.selectionManager.select([neuronNode]);
    };
    neuronNode.node.on("click", (event: paper.MouseEvent) => event.stopPropagation());
    this.project.view.on("click", () => {
      this.selectionManager.select([]);
    });
  }

  private addSynapse(synapse: Synapse) {
    const synapseNode = new SynapseNode(synapse);
    this.layers.connections.addChild(synapseNode.node);
    synapse.events.on("delete", () => synapseNode.node.remove());
  }

  private autoZoom() {
    this.project.view.zoom = this.preferredZoomLevel;
    this.project.view.center = this.layerBound.center;
  }

}
