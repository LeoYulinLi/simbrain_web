import paper from "paper";
import ScreenElement from "./ScreenElement";
import { NeuronNode } from "./NeuronNode";
import difference from "lodash.difference";
import NetworkModel from "../../model/network/interfaces/NetworkModel";
import SynapseNode from "./SynapseNode";


export default class SelectionManager {

  readonly selectedNodes: Set<ScreenElement> = new Set();

  readonly sourceNodes: Set<NeuronNode> = new Set();

  private multiSelect = false;

  private tagObject: any = null;

  constructor() {

    paper.tool.on("keydown", (event: paper.KeyEvent) => {
      if (event.key === "shift") this.multiSelect = true;
    });

    paper.tool.on("keyup", (event: paper.KeyEvent) => {
      if (event.key === "shift") this.multiSelect = false;
    });

  }

  select(screenElements: ScreenElement[], tagObject?: any): void {
    if (!this.multiSelect && (!this.tagObject || tagObject !== this.tagObject)) {
      this.tagObject = tagObject;
      difference(Array.from(this.selectedNodes), screenElements).forEach(e => e.unselect());
      this.selectedNodes.clear();
    }
    screenElements.forEach(e => this.selectedNodes.add(e));
  }

  addSelection(screenElements: ScreenElement[]): void {
    screenElements.forEach(e => this.selectedNodes.add(e));
  }

  markSelectionAsSource(): void {
    this.sourceNodes.forEach(n => n.removeSource());
    this.sourceNodes.clear();
    this.selectedNodes.forEach(e => {
      if (e instanceof NeuronNode) {
        e.markAsSource();
        this.sourceNodes.add(e);
      }
    });
  }

  get selectModel(): NetworkModel[] {
    return Array.from(this.selectedNodes).map(node => {
      if (node instanceof NeuronNode) {
        return node.neuron;
      }
      if (node instanceof SynapseNode) {
        return node.synapse;
      }
      throw "Unsupported Network Model";
    });
  }

}
