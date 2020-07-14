import paper from "paper";
import ScreenElement from "./ScreenElement";


export default class SelectionManager {

  private selectedNodes: Set<ScreenElement> = new Set();

  private multiSelect = false;

  constructor() {

    console.log(paper.tools);

    paper.tool.on("keydown", (event: paper.KeyEvent) => {
      if (event.key === "shift") this.multiSelect = true;
    });

    paper.tool.on("keyup", (event: paper.KeyEvent) => {
      if (event.key === "shift") this.multiSelect = false;
    });

  }

  select(screenElements: ScreenElement[]): void {
    if (!this.multiSelect) {
      this.selectedNodes.forEach(e => e.unselect());
      this.selectedNodes.clear();
    }
    screenElements.forEach(e => e.select());
    screenElements.forEach(e => this.selectedNodes.add(e));
  }

}
