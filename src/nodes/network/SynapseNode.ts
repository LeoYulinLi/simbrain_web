import ScreenElement from "./ScreenElement";
import { Synapse } from "../../model/network/Synapse";
import paper from "paper";

export default class SynapseNode extends ScreenElement {

  private line = new paper.Path({ insert: false });

  private indicator = new paper.Shape.Circle({
    center: [0, 0],
    radius: 3,
    fillColor: "red",
  });

  readonly node = new paper.Group();

  constructor(private synapse: Synapse) {
    super();
    this.line.strokeWidth = 1;
    this.line.strokeColor = new paper.Color("#00000033");
    this.line.closed = true;
    this.node.addChild(this.line);
    this.node.addChild(this.indicator);
    this.repaint();
    synapse.events.on("location", () => {
      this.repaint();
    });
  }

  repaint(): void {
    this.line.removeSegments();

    const source = new paper.Point(this.synapse.source.coordinate);
    const target = new paper.Point(this.synapse.target.coordinate);

    const radiusOffset = target.subtract(source);
    radiusOffset.length = 12;
    this.line.add(source.add(radiusOffset), target.subtract(radiusOffset));
    this.indicator.position = target.subtract(radiusOffset);

    const indicatorSize = this.synapse.weight / 10 * 5 + 3;
    const indicatorColor = new paper.Color(this.synapse.weight > 0 ? "red" : "blue");
    this.indicator.radius = indicatorSize;
    this.indicator.fillColor = indicatorColor;

    const lineColor = new paper.Color(this.synapse.weight > 0 ? "red" : "blue");
    lineColor.brightness = 1;
    lineColor.alpha = 0.1 + Math.abs(this.synapse.weight / 15);
    const strokeWidth = 0.7 + Math.abs(this.synapse.weight / 4);
    this.line.strokeColor = lineColor;
    this.line.strokeWidth = strokeWidth;
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

  intersects(selection: paper.Path.Rectangle): boolean {
    return this.line.intersects(selection);
  }

}