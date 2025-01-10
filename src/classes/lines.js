export default class Line {
  constructor({
    lineId,
    startXY,
    endXY,
    lineName,
    svgContainer,
    lines,
    draggedItems,
    selectedIdDelete,
  }) {
    this.lineId = lineId;
    this.startXY = startXY;
    this.endXY = endXY;
    this.lineName = lineName;
    this.svgContainer = svgContainer;
    this.lines = lines;
    this.group = null;
    this.lineElement = null;
    this.startHandle = null;
    this.endHandle = null;
    this.draggedItems = draggedItems;
    this.selectedLine = null;
    this.selectedIdDelete = selectedIdDelete;
  }

  render() {
    // Create group element
    this.group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.group.setAttribute("data-line-id", this.lineId);

    // Create line element
    this.lineElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );

    // Check for shape joins to determine the start and end coordinates
    const startCoordinates = this.calculateCoordinates("startXY");
    const endCoordinates = this.calculateCoordinates("endXY");

    this.lineElement.setAttribute("x1", startCoordinates[0]);
    this.lineElement.setAttribute("y1", startCoordinates[1]);
    this.lineElement.setAttribute("x2", endCoordinates[0]);
    this.lineElement.setAttribute("y2", endCoordinates[1]);
    this.lineElement.setAttribute("stroke", "white");
    this.lineElement.setAttribute("stroke-width", "2");

    // Hover effects
    this.lineElement.addEventListener("mouseover", () => {
      this.lineElement.setAttribute("stroke", "green");
    });

    this.lineElement.addEventListener("mouseleave", () => {
      this.lineElement.setAttribute("stroke", "white");
    });

    // Selection event
    this.group.addEventListener("click", () => {
      this.selectedLine = this.lineId;
      this.selectedIdDelete.value = this.lineId;
    });

    // Append the line to the group
    this.group.appendChild(this.lineElement);

    // Create drag handles
    this.startHandle = this.createHandle(startCoordinates, "start");
    this.endHandle = this.createHandle(endCoordinates, "end");

    // Append handles to the group
    this.group.appendChild(this.startHandle);
    this.group.appendChild(this.endHandle);

    // Add drag functionality to handles
    this.enableDrag(this.startHandle, "startXY");
    this.enableDrag(this.endHandle, "endXY");

    // Append group to SVG container
    this.svgContainer.appendChild(this.group);
  }

  calculateCoordinates(handleType) {
    const lineIndex = this.lines.value.findIndex(
      (line) => line.lineId === this.lineId
    );

    if (lineIndex !== -1) {
      const shapeJoin =
        handleType === "startXY"
          ? this.lines.value[lineIndex].startShapeJoin
          : this.lines.value[lineIndex].endShapeJoin;

      if (shapeJoin && shapeJoin.sid) {
        const matchedItem = this.draggedItems.value.find(
          (item) => item.svgId === shapeJoin.sid
        );

        if (matchedItem) {
          return [
            matchedItem.x + shapeJoin.diffX,
            matchedItem.y + shapeJoin.diffY,
          ];
        }
      }
    }

    return handleType === "startXY" ? this.startXY : this.endXY;
  }

  createHandle([cx, cy], handleType) {
    const handle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    handle.setAttribute("cx", cx);
    handle.setAttribute("cy", cy);
    handle.setAttribute("r", "3");
    handle.setAttribute("fill", "red");
    handle.setAttribute("class", "drag-handle");

    const handleId = `${this.lineId}${handleType === "start" ? "S" : "E"}`;
    handle.setAttribute("data-handle-id", handleId);

    return handle;
  }

  enableDrag(handle, handleType) {
    handle.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      this.updateLineOnDrag(handle, handleType);
    });
  }

  updateLineOnDrag(handle, handleType) {
    let lineIndex;

    const onMouseMove = (e) => {
      const rect = this.svgContainer.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Update handle position and line attributes
      if (handleType === "startXY") {
        this.startXY = [mouseX, mouseY];
        this.startHandle.setAttribute("cx", mouseX);
        this.startHandle.setAttribute("cy", mouseY);
        this.lineElement.setAttribute("x1", mouseX);
        this.lineElement.setAttribute("y1", mouseY);
      } else if (handleType === "endXY") {
        this.endXY = [mouseX, mouseY];
        this.endHandle.setAttribute("cx", mouseX);
        this.endHandle.setAttribute("cy", mouseY);
        this.lineElement.setAttribute("x2", mouseX);
        this.lineElement.setAttribute("y2", mouseY);
      }

      lineIndex = this.lines.value.findIndex(
        (line) => line.lineId === this.lineId
      );

      if (lineIndex !== -1) {
        if (handleType === "startXY") {
          this.lines.value[lineIndex].startXY = [mouseX, mouseY];
        } else if (handleType === "endXY") {
          this.lines.value[lineIndex].endXY = [mouseX, mouseY];
        }
      }
    };

    const onMouseUp = (e) => {
      this.svgContainer.removeEventListener("mousemove", onMouseMove);
      this.svgContainer.removeEventListener("mouseup", onMouseUp);

      const elementUnderCursor = document.elementFromPoint(
        e.clientX,
        e.clientY
      );
      const parentGroup = elementUnderCursor?.closest("g[data-svg-id]");

      if (parentGroup) {
        const svgId = parentGroup.getAttribute("data-svg-id");

        const matchedItem = this.draggedItems.value.find(
          (item) => item.svgId === svgId
        );

        if (matchedItem) {
          const rect = this.svgContainer.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          const offsetX = mouseX - matchedItem.x;
          const offsetY = mouseY - matchedItem.y;

          if (handleType === "startXY") {
            this.lines.value[lineIndex].startShapeJoin = {
              sid: svgId,
              diffX: offsetX,
              diffY: offsetY,
            };
          } else if (handleType === "endXY") {
            this.lines.value[lineIndex].endShapeJoin = {
              sid: svgId,
              diffX: offsetX,
              diffY: offsetY,
            };
          }
        } else {
          if (handleType === "startXY") {
            this.lines.value[lineIndex].startShapeJoin = {
              sid: null,
              diffX: null,
              diffY: null,
            };
          } else if (handleType === "endXY") {
            this.lines.value[lineIndex].endShapeJoin = {
              sid: null,
              diffX: null,
              diffY: null,
            };
          }
        }
      }
    };

    this.svgContainer.addEventListener("mousemove", onMouseMove);
    this.svgContainer.addEventListener("mouseup", onMouseUp);
  }

  delete() {
    if (this.group) {
      this.svgContainer.removeChild(this.group);
    }

    const index = this.lines.value.findIndex(
      (line) => line.lineId === this.lineId
    );
    if (index !== -1) {
      this.lines.value.splice(index, 1);
    }
  }
}

/*
 while dragging when mouse(when mouse up) if mouse is over svgshape when move up it should get the id of that svgshape and from the draggedItems array get the offset of that svgshape get the difference of that svgshape offset and that dragging handel store the difference along with the id of that svg, when you render the line if that line points is contains any joinedsvg id it should calculate the offset and change when the svgshape is moved, while dragging the svg shape that line axies should also chnage  

*/
