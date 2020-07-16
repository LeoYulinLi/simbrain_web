import paper from "paper";

export default abstract class ScreenElement {
  abstract select(): void
  abstract unselect(): void
  abstract delete(): void
  abstract intersects(selection: paper.Path.Rectangle): boolean;
}
