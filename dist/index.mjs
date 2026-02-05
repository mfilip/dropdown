// src/index.ts
function getOverflowAncestors(element) {
  const ancestors = [];
  let current = element.parentElement;
  while (current) {
    const style = getComputedStyle(current);
    const overflow = style.overflow + style.overflowX + style.overflowY;
    if (/auto|scroll|overlay|hidden/.test(overflow)) {
      ancestors.push(current);
    }
    current = current.parentElement;
  }
  ancestors.push(window);
  return ancestors;
}
function getViewportRect() {
  return {
    top: 0,
    bottom: window.innerHeight,
    height: window.innerHeight
  };
}
function computePosition(reference, floating, config = {}) {
  const { placement = "bottom", offset = 0, flipOnOverflow = true } = config;
  const refRect = reference.getBoundingClientRect();
  const floatingRect = floating.getBoundingClientRect();
  const viewport = getViewportRect();
  let finalPlacement = placement;
  let x = refRect.left + window.scrollX;
  let y;
  if (placement === "bottom") {
    y = refRect.bottom + window.scrollY + offset;
    if (flipOnOverflow) {
      const spaceBelow = viewport.bottom - refRect.bottom;
      const spaceAbove = refRect.top - viewport.top;
      if (spaceBelow < floatingRect.height && spaceAbove > spaceBelow) {
        finalPlacement = "top";
        y = refRect.top + window.scrollY - floatingRect.height - offset;
      }
    }
  } else {
    y = refRect.top + window.scrollY - floatingRect.height - offset;
    if (flipOnOverflow) {
      const spaceAbove = refRect.top - viewport.top;
      const spaceBelow = viewport.bottom - refRect.bottom;
      if (spaceAbove < floatingRect.height && spaceBelow > spaceAbove) {
        finalPlacement = "bottom";
        y = refRect.bottom + window.scrollY + offset;
      }
    }
  }
  return {
    x,
    y,
    width: refRect.width,
    placement: finalPlacement
  };
}
function applyPosition(floating, position) {
  Object.assign(floating.style, {
    position: "absolute",
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${position.width}px`
  });
}
function autoUpdate(reference, floating, update, options = {}) {
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function"
  } = options;
  const ancestors = [
    ...getOverflowAncestors(reference),
    ...getOverflowAncestors(floating)
  ];
  const uniqueAncestors = [...new Set(ancestors)];
  uniqueAncestors.forEach((ancestor) => {
    if (ancestorScroll) {
      ancestor.addEventListener("scroll", update, { passive: true });
    }
    if (ancestorResize) {
      ancestor.addEventListener("resize", update);
    }
  });
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver(() => {
      update();
    });
    resizeObserver.observe(reference);
    resizeObserver.observe(floating);
  }
  update();
  return () => {
    uniqueAncestors.forEach((ancestor) => {
      if (ancestorScroll) {
        ancestor.removeEventListener("scroll", update);
      }
      if (ancestorResize) {
        ancestor.removeEventListener("resize", update);
      }
    });
    resizeObserver?.disconnect();
  };
}
function createDropdown(reference, floating, config = {}) {
  let cleanup = null;
  let visible = false;
  const update = () => {
    if (!visible) return;
    const position = computePosition(reference, floating, config);
    applyPosition(floating, position);
  };
  const show = () => {
    if (visible) return;
    visible = true;
    floating.style.display = "";
    cleanup = autoUpdate(reference, floating, update, config);
  };
  const hide = () => {
    if (!visible) return;
    visible = false;
    floating.style.display = "none";
    cleanup?.();
    cleanup = null;
  };
  floating.style.display = "none";
  return {
    update,
    destroy: () => {
      cleanup?.();
      cleanup = null;
    },
    show,
    hide,
    isVisible: () => visible
  };
}
export {
  applyPosition,
  autoUpdate,
  computePosition,
  createDropdown
};
