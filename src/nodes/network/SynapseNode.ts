import ScreenElement from "./ScreenElement";
import { Synapse } from "../../model/network/Synapse";
import paper from "paper";
import eventEmitter from "../../events/emitter";

export default class SynapseNode extends ScreenElement {

  private line = new paper.Path({ insert: false });

  private indicator = new paper.Shape.Circle({
    center: [0, 0],
    radius: 3,
    fillColor: "red",
    insert: false
  });

  readonly events = eventEmitter<{
    selected: any
  }>()

  private nodeHandle = new paper.Shape.Rectangle({
    size: this.indicator.bounds.size,
    insert: false
  });

  readonly node = new paper.Group();

  private selected = false;

  constructor(private synapse: Synapse) {
    super();
    this.line.strokeWidth = 1;
    this.line.strokeColor = new paper.Color("#00000033");
    this.line.closed = true;
    this.node.addChild(this.line);
    this.node.addChild(this.indicator);

    this.indicator.on("click", (event: paper.MouseEvent) => {
      console.log("here");
      this.select();
    });

    this.nodeHandle.scale(1.4);
    this.nodeHandle.strokeColor = new paper.Color("green");
    this.nodeHandle.bounds.center = this.indicator.bounds.center;
    this.nodeHandle.size = new paper.Size(this.indicator.bounds);
    this.indicator.addChild(this.nodeHandle);

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
    lineColor.alpha = this.selected ? 1 : 0.1 + Math.abs(this.synapse.weight / 15);
    const strokeWidth = 0.7 + Math.abs(this.synapse.weight / 4);
    this.line.strokeColor = lineColor;
    this.line.strokeWidth = strokeWidth;
  }

  select(event?: any): void {
    if (this.selected) return;
    this.nodeHandle.visible = true;
    this.selected = true;
    this.repaint();
    this.events.fire("selected", event);
  }

  unselect(): void {
    if (!this.selected) return;
    console.log("unselect");
    this.selected = false;
    this.repaint();
    this.nodeHandle.visible = false;
  }

  delete(): void {
    this.synapse.delete();
  }

  intersects(selection: paper.Shape.Rectangle): boolean {
    return this.line.intersects(selection) || this.indicator.isInside(selection.bounds);
  }

}
