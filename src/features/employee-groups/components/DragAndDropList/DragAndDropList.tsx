import { Button, Icon } from "@canonical/react-components";
import React, { useState, useRef, useEffect, useCallback } from "react";
import classes from "./DragAndDropList.module.scss";
import classNames from "classnames";

interface ListItem {
  id: number;
  name: string;
  priority: number;
}

const initialList: ListItem[] = [
  { id: 1, name: "Item 1", priority: 1 },
  { id: 2, name: "Item 2", priority: 2 },
  { id: 3, name: "Item 3", priority: 3 },
  // Add more items as needed
];

const DragAndDropList: React.FC = () => {
  const [list, setList] = useState<ListItem[]>(initialList);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  // Sort the list based on priority
  const sortedList = [...list].sort((a, b) => a.priority - b.priority);

  // Handle Drag Start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    // Needed for Firefox
    e.dataTransfer.setData("text/plain", id.toString());
  };

  // Handle Drag Over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.preventDefault();
    if (draggingId === null || draggingId === id) return;
    const draggedItem = list.find((item) => item.id === draggingId);
    const targetItem = list.find((item) => item.id === id);
    if (draggedItem && targetItem) {
      const updatedList = list.map((item) => {
        if (item.id === draggedItem.id) {
          return { ...item, priority: targetItem.priority };
        }
        if (item.id === targetItem.id) {
          return { ...item, priority: draggedItem.priority };
        }
        return item;
      });
      setList(updatedList);
    }
  };

  // Handle Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggingId(null);
  };

  // Handle Drag End
  const handleDragEnd = () => {
    setDraggingId(null);
  };

  // Handle Increment/Decrement
  const handleChangePriority = (id: number, delta: number) => {
    setList((prevList) => {
      const item = prevList.find((i) => i.id === id);
      if (!item) return prevList;
      let newPriority = item.priority + delta;
      newPriority = Math.max(1, Math.min(newPriority, prevList.length));
      return prevList.map((i) => {
        if (i.id === id) return { ...i, priority: newPriority };
        if (i.priority === newPriority && delta > 0)
          return { ...i, priority: i.priority - 1 };
        if (i.priority === newPriority && delta < 0)
          return { ...i, priority: i.priority + 1 };
        return i;
      });
    });
  };

  // Handle Input Change
  const handleInputChange = (id: number, value: number) => {
    setList((prevList) => {
      const item = prevList.find((i) => i.id === id);
      if (!item) return prevList;
      let newPriority = value;
      newPriority = Math.max(1, Math.min(newPriority, prevList.length));
      return prevList.map((i) => {
        if (i.id === id) return { ...i, priority: newPriority };
        if (i.priority === newPriority && i.id !== id) {
          return { ...i, priority: item.priority };
        }
        return i;
      });
    });
  };

  // Auto-scroll when dragging near edges
  const listContainerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (draggingId === null) return;
      const buffer = 50; // px
      const container = listContainerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (e.clientY < rect.top + buffer) {
        container.scrollBy({ top: -10, behavior: "smooth" });
      } else if (e.clientY > rect.bottom - buffer) {
        container.scrollBy({ top: 10, behavior: "smooth" });
      }
    },
    [draggingId],
  );

  useEffect(() => {
    if (draggingId !== null) {
      window.addEventListener("mousemove", handleMouseMove);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [draggingId, handleMouseMove]);

  // Focus management
  useEffect(() => {
    sortedList.forEach((item) => {
      if (
        inputRefs.current[item.id] &&
        document.activeElement === inputRefs.current[item.id]
      ) {
        inputRefs.current[item.id]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
  }, [sortedList]);

  return (
    <div
      ref={listContainerRef}
      style={{
        maxHeight: "80vh",
        overflowY: "auto",
        padding: "10px",
      }}
    >
      {sortedList.map((item) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, item.id)}
          onDragOver={(e) => handleDragOver(e, item.id)}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px",
            marginBottom: "4px",
            backgroundColor:
              draggingId === item.id
                ? "#e0e0e0"
                : hoveredId === item.id
                  ? "#f5f5f5"
                  : "#fff",
            transition: "background-color 0.2s, transform 0.2s",
            position: "relative",
          }}
        >
          {/* Drag Icon */}
          <div
            style={{
              cursor: draggingId === item.id ? "grabbing" : "grab",
              marginRight: "10px",
            }}
          >
            <Icon name="drag" />
          </div>

          {/* Name */}
          <div style={{ flex: 1 }}>{item.name}</div>

          {/* Minus Button */}
          <Button
            appearance="base"
            onClick={() => {
              handleChangePriority(item.id, -1);
              setTimeout(() => {
                inputRefs.current[item.id]?.focus();
              }, 200);
            }}
            style={{
              marginRight: "5px",
              padding: "4px 8px",
              cursor: "pointer",
              border: "none",
              borderRadius: "4px",
              transition: "background-color 0.2s",
            }}
            className={classNames(classes.buttons, "u-no-margin--bottom")}
          >
            -
          </Button>

          {/* Input Field */}
          <input
            type="number"
            value={item.priority}
            onChange={(e) => handleInputChange(item.id, Number(e.target.value))}
            onClick={(e) => e.currentTarget.focus()}
            ref={(el) => (inputRefs.current[item.id] = el)}
            style={{
              width: "50px",
              textAlign: "center",
              marginRight: "5px",
            }}
            className="u-no-margin--bottom"
          />

          {/* Plus Button */}
          <Button
            appearance="base"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => {
              handleChangePriority(item.id, 1);
              setTimeout(() => {
                inputRefs.current[item.id]?.focus();
              }, 200);
            }}
            style={{
              padding: "4px 8px",
              cursor: "pointer",
              border: "none",
              borderRadius: "4px",
              transition: "background-color 0.2s",
            }}
            className={classNames(classes.buttons, "u-no-margin--bottom")}
          >
            +
          </Button>
        </div>
      ))}
    </div>
  );
};

export default DragAndDropList;
