import { Dispatch, RefObject, SetStateAction, useEffect } from "react";

interface UseResizeArgs {
  // Ref that tells us if the user is currently dragging
  isDragging: RefObject<boolean>;

  // State setter to update the height of the top section
  setTopHeight: Dispatch<SetStateAction<number>>;
}

export const useResize = ({ isDragging, setTopHeight }: UseResizeArgs) => {

  useEffect(() => {

    // Called every time the mouse moves
    const onMouseMove = (e: MouseEvent) => {
      // If the user is not dragging, do nothing
      if (!isDragging.current) return;

      // Update the height based on mouse movement
      // movementY = how much the mouse moved vertically
      // Math.max ensures the height never goes below 190
      setTopHeight((prev) => Math.max(190, prev + e.movementY));
    };

    // Called when the mouse button is released
    const onMouseUp = () => {
      // no dragging
      isDragging.current = false;

      // Reset the cursor style
      document.body.style.cursor = "default";
    };

    // Listen to mouse events globally (even outside the component)
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Cleanup: remove listeners when the component unmounts
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);
};
