import paper from "paper";
import ScreenElement from "./ScreenElement";
import { NeuronNode } from "./NeuronNode";


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
    console.log(tagObject !== this.tagObject);
    if (!this.multiSelect && (!this.tagObject || tagObject !== this.tagObject)) {
      this.tagObject = tagObject;
      this.selectedNodes.forEach(e => e.unselect());
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

}
