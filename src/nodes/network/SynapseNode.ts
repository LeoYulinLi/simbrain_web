import ScreenElement from "./ScreenElement";
import { Synapse } from "../../model/network/Synapse";
import paper from "paper";

export default class SynapseNode extends ScreenElement {

  private line = new paper.Path();

  readonly node = new paper.Group([this.line]);

  constructor(private synapse: Synapse) {
    super();
    this.line.add(new paper.Point(this.synapse.source.coordinate), new paper.Point(this.synapse.target.coordinate));
    this.line.strokeWidth = 1;
    this.line.strokeColor = new paper.Color("black");
    this.line.closed = true;
    this.node.addChild(this.line);

    synapse.events.on("location", () => {
      this.line.removeSegments();
      this.line.add(new paper.Point(this.synapse.source.coordinate), new paper.Point(this.synapse.target.coordinate));
    });
  }

  select(): void {
    console.log("selected");
  }

  unselect(): void {
    console.log("unselected");
  }

  delete(): void {
    this.synapse.delete();
  }

}
