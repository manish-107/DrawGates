export default class Shapes {
  constructor({
    svgId,
    svgName,
    x,
    y,
    style,
    dimensions,
    paths,
    draggedItems,
    selectedIdDelete,
  }) {
    this.svgId = svgId;
    this.svgName = svgName;
    this.x = x || 0;
    this.y = y || 0;
    this.strokeColor = style.strokeColor || "white";
    this.fillColor = style.fillColor || "#000";
    this.strokeWidth = style.strokeWidth || 1;
    this.width = dimensions.width || 90;
    this.height = dimensions.height || 90;
    this.paths = paths;
    this.scaleFactor = 2;
    this.draggedItems = draggedItems;
    this.selectedIdDelete = selectedIdDelete;
    this.selectedSvg = null;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.updateDraggedItem();
  }

  setId(svgId) {
    this.svgId = svgId;
    this.updateDraggedItem();
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.updateDraggedItem();
  }

  setColor(color) {
    this.fillColor = color;
    this.updateDraggedItem();
  }

  setScale(scaleFactor) {
    this.scaleFactor = scaleFactor;
    this.updateDraggedItem();
  }

  updateDraggedItem() {
    const shapeIndex = this.draggedItems.value.findIndex(
      (item) => item.svgId === this.svgId
    );
    if (shapeIndex !== -1) {
      this.draggedItems.value[shapeIndex] = {
        ...this.draggedItems.value[shapeIndex],
        x: this.x,
        y: this.y,
        style: {
          strokeColor: this.strokeColor,
          fillColor: this.fillColor,
          strokeWidth: this.strokeWidth,
        },
        dimensions: {
          width: this.width,
          height: this.height,
        },
      };
    }
  }

  render(svgContainer) {
    const existingGroup = svgContainer.querySelector(
      `[data-svg-id="${this.svgId}"]`
    );
    if (existingGroup) {
      existingGroup.setAttribute(
        "transform",
        `translate(${this.x}, ${this.y}) scale(${this.scaleFactor})`
      );
      return;
    }

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute(
      "transform",
      `translate(${this.x}, ${this.y}) scale(${this.scaleFactor})`
    );
    group.setAttribute("data-svg-id", this.svgId);

    let isDragging = false;
    let startX, startY, initialX, initialY;

    const onMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const transform = group.getAttribute("transform");
      const translateMatch = /translate\(([\d.]+),\s*([\d.]+)\)/.exec(
        transform
      );
      initialX = translateMatch ? parseFloat(translateMatch[1]) : this.x;
      initialY = translateMatch ? parseFloat(translateMatch[2]) : this.y;

      svgContainer.addEventListener("mousemove", onMouseMove);
      svgContainer.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const newX = initialX + deltaX;
      const newY = initialY + deltaY;

      group.setAttribute(
        "transform",
        `translate(${newX}, ${newY}) scale(${this.scaleFactor})`
      );

      this.setPosition(newX, newY);
    };

    const onMouseUp = () => {
      isDragging = false;
      svgContainer.removeEventListener("mousemove", onMouseMove);
      svgContainer.removeEventListener("mouseup", onMouseUp);
    };

    const onClick = () => {
      this.selectedSvg = this.svgId;
      this.selectedIdDelete.value = this.svgId;
    };

    // Hover events for stroke color change
    const onMouseOver = () => {
      group.querySelectorAll("path").forEach((path) => {
        path.setAttribute("stroke", "green"); // Change stroke color on hover
      });
    };

    const onMouseOut = () => {
      group.querySelectorAll("path").forEach((path) => {
        path.setAttribute("stroke", "white"); // Revert stroke color
      });
    };

    group.addEventListener("click", onClick);
    group.addEventListener("mousedown", onMouseDown);
    group.addEventListener("mouseover", onMouseOver);
    group.addEventListener("mouseout", onMouseOut);

    this.paths.forEach((path) => {
      const pathElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      Object.entries(path).forEach(([key, value]) => {
        pathElement.setAttribute(key, value);
      });
      group.appendChild(pathElement);
    });

    svgContainer.appendChild(group);
  }

  delete() {
    if (this.group) {
      this.svgContainer.removeChild(this.group);
    }

    const index = this.draggedItems.value.findIndex(
      (draggedItem) => draggedItem.svgId === this.selectedSvg
    );
    if (index !== -1) {
      this.draggedItems.value.splice(index, 1);
    }
  }
}
