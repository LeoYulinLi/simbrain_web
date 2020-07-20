import Network from "../../model/network/Network";
import paper from "paper";
import { NeuronNode } from "./NeuronNode";
import { Neuron } from "../../model/network/Neuron";
import { Coordinate } from "../../utils/geom";
import SelectionManager from "./SelectionManager";
import { Synapse } from "../../model/network/Synapse";
import SynapseNode from "./SynapseNode";
import ScreenElement from "./ScreenElement";

export default class NetworkPanel {

  private project = paper.project;

  private screenElements: Set<ScreenElement> = new Set();

  private lastClickPosition: Coordinate = { x: 0, y: 0 };

  private selectionManager = new SelectionManager();

  private marqueeStart = { x: 0, y: 0 };

  private layers = {
    marquee: new paper.Layer(),
    nodes: new paper.Layer(),
    connections: new paper.Layer()
  };

  private selectionMarquee = new paper.Shape.Rectangle({
    point: [0, 0],
    size: [100, 100],
    strokeColor: "#f5c542",
    fillColor: "#f5c54222",
    strokeScaling: false,
    insert: false,
    visible: false
  });

  private keyBindings: {[key: string]: (event: paper.KeyEvent) => void} = {
    "p": () => this.network.createNeuron({ coordinate: this.lastClickPosition }),
    "1": () => this.selectionManager.markSelectionAsSource(),
    "2": () => {
      this.selectionManager.sourceNodes.forEach(s => {
        this.selectionManager.selectedNodes.forEach(t => {
          if (t instanceof NeuronNode) {
            this.network.createSynapse({ source: s.neuron, target: t.neuron, weight: 1 });
          }
        });
      });
    },
    "up": (event) => {
      event.preventDefault();
      this.selectionManager.selectedNodes.forEach(node => {
        if (node instanceof NeuronNode) {
          node.increaseActivation();
        }
        if (node instanceof SynapseNode) {
          node.synapse.increaseWeight();
        }
      });
    },
    "down": (event) => {
      event.preventDefault();
      this.selectionManager.selectedNodes.forEach(node => {
        if (node instanceof NeuronNode) {
          node.decreaseActivation();
        }
        if (node instanceof SynapseNode) {
          node.synapse.decreaseWeight();
        }
      });
    },
    "space": (event) => {
      event.preventDefault();
      this.network.update();
    },
    "n": () => Object.values(this.network.neurons).forEach(neuron => neuron.select("n")),
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

    this.layers.marquee.addChild(this.selectionMarquee);

    paper.tool.on("keydown", (event: paper.KeyEvent) => this.keyBindings[event.key]?.(event));

    paper.view.on("mousedown", (event: paper.MouseEvent) => {
      this.marqueeStart = event.point.clone();
      this.lastClickPosition = event.point.clone();
      this.autoZoom();
    });

    paper.view.on("mousedrag", (event: paper.MouseEvent) => {
      const tempRect = new paper.Rectangle(new paper.Point(this.marqueeStart), event.point.clone());
      this.selectionMarquee.size = new paper.Size(tempRect.size);
      this.selectionMarquee.position = tempRect.center;
      this.selectionMarquee.visible = true;
      const result = Array.from(this.screenElements).filter(element => element.intersects(this.selectionMarquee));
      result.forEach(e => e.select(event));
    });

    paper.view.on("mouseup", () => {
      this.selectionMarquee.visible = false;
      this.autoZoom();
    });

    Object.values(network.neurons).forEach(this.addNeuron.bind(this));
    Object.values(network.synapses).forEach(this.addSynapse.bind(this));

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
    this.screenElements.add(neuronNode);
    this.layers.nodes.addChild(neuronNode.node);

    neuron.events.on("delete", () => {
      this.screenElements.delete(neuronNode);
      neuronNode.node.remove();
    });
    neuron.events.on("location", location => {
      const { x, y } = location;
      neuronNode.node.position = new paper.Point(x, y);
    });

    neuronNode.events.on("selected", (event) => {
      this.selectionManager.select([neuronNode], event);
    });

    neuronNode.node.on("mousedrag", (event: paper.MouseEvent) => event.stopPropagation());
    neuronNode.node.on("click", (event: paper.MouseEvent) => event.stopPropagation());
    neuronNode.node.onMouseDown = (event: paper.MouseEvent) => {
      event.stopPropagation();
      neuronNode.node.bringToFront();
    };

    this.project.view.on("click", () => {
      this.selectionManager.select([]);
    });

    neuronNode.select();
    this.autoZoom();
  }

  private addSynapse(synapse: Synapse) {
    const synapseNode = new SynapseNode(synapse);
    this.screenElements.add(synapseNode);
    this.layers.connections.addChild(synapseNode.node);
    synapseNode.events.on("selected", (event) => {
      this.selectionManager.select([synapseNode], event);
    });
    synapse.events.on("delete", () => {
      this.screenElements.delete(synapseNode);
      synapseNode.node.remove();
    });
  }

  private autoZoom() {
    this.project.view.zoom = this.preferredZoomLevel;
    this.project.view.center = this.layerBound.center;
  }

}
