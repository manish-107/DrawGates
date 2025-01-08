export default class Line {
  constructor({ lineId, startXY, endXY, lineName, svgContainer, lines }) {
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
    this.lineElement.setAttribute("x1", this.startXY[0]);
    this.lineElement.setAttribute("y1", this.startXY[1]);
    this.lineElement.setAttribute("x2", this.endXY[0]);
    this.lineElement.setAttribute("y2", this.endXY[1]);
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
      console.log("Selected Line ID:", this.lineId);
    });

    // Append the line to the group
    this.group.appendChild(this.lineElement);

    // Create drag handles
    this.startHandle = this.createHandle(this.startXY, "start");
    this.endHandle = this.createHandle(this.endXY, "end");

    // Append handles to the group
    this.group.appendChild(this.startHandle);
    this.group.appendChild(this.endHandle);

    // Add drag functionality to handles
    this.enableDrag(this.startHandle, "startXY");
    this.enableDrag(this.endHandle, "endXY");

    // Append group to SVG container
    this.svgContainer.appendChild(this.group);
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
    handle.addEventListener("mousedown", () => {
      this.updateLineOnDrag(handle, handleType);
    });
  }

  updateLineOnDrag(handle, handleType) {
    const onMouseMove = (e) => {
      const rect = this.svgContainer.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Update the handle position and line attributes
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

      // Update the corresponding line in the lines array
      const lineIndex = this.lines.value.findIndex(
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

    const onMouseUp = () => {
      this.svgContainer.removeEventListener("mousemove", onMouseMove);
      this.svgContainer.removeEventListener("mouseup", onMouseUp);
    };

    this.svgContainer.addEventListener("mousemove", onMouseMove);
    this.svgContainer.addEventListener("mouseup", onMouseUp);
  }
}

/*
 while dragging when mouse(when mouse up) if mouse is over svgshape when move up it should get the id of that svgshape and from the draggedItems array get the offset of that svgshape get the difference of that svgshape offset and that dragging handel store the difference along with the id of that svg, when you render the line if that line points is contains any joinedsvg id it should calculate the offset and change when the svgshape is moved, while dragging the svg shape that line axies should also chnage  

*/
