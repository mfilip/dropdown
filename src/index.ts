export type Placement = 'bottom' | 'top';

export interface PositionConfig {
  placement?: Placement;
  offset?: number;
  flipOnOverflow?: boolean;
}

export interface Position {
  x: number;
  y: number;
  width: number;
  placement: Placement;
}

export interface AutoUpdateOptions {
  ancestorScroll?: boolean;
  ancestorResize?: boolean;
  elementResize?: boolean;
}

function getOverflowAncestors(element: Element): Array<Element | Window> {
  const ancestors: Array<Element | Window> = [];
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

function getViewportRect(): { top: number; bottom: number; height: number } {
  return {
    top: 0,
    bottom: window.innerHeight,
    height: window.innerHeight,
  };
}

export function computePosition(
  reference: HTMLInputElement | HTMLTextAreaElement,
  floating: HTMLElement,
  config: PositionConfig = {}
): Position {
  const { placement = 'bottom', offset = 0, flipOnOverflow = true } = config;

  const refRect = reference.getBoundingClientRect();
  const floatingRect = floating.getBoundingClientRect();
  const viewport = getViewportRect();

  let finalPlacement = placement;
  let x = refRect.left + window.scrollX;
  let y: number;

  if (placement === 'bottom') {
    y = refRect.bottom + window.scrollY + offset;

    if (flipOnOverflow) {
      const spaceBelow = viewport.bottom - refRect.bottom;
      const spaceAbove = refRect.top - viewport.top;

      if (spaceBelow < floatingRect.height && spaceAbove > spaceBelow) {
        finalPlacement = 'top';
        y = refRect.top + window.scrollY - floatingRect.height - offset;
      }
    }
  } else {
    y = refRect.top + window.scrollY - floatingRect.height - offset;

    if (flipOnOverflow) {
      const spaceAbove = refRect.top - viewport.top;
      const spaceBelow = viewport.bottom - refRect.bottom;

      if (spaceAbove < floatingRect.height && spaceBelow > spaceAbove) {
        finalPlacement = 'bottom';
        y = refRect.bottom + window.scrollY + offset;
      }
    }
  }

  return {
    x,
    y,
    width: refRect.width,
    placement: finalPlacement,
  };
}

export function applyPosition(floating: HTMLElement, position: Position): void {
  Object.assign(floating.style, {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${position.width}px`,
  });
}

export function autoUpdate(
  reference: HTMLInputElement | HTMLTextAreaElement,
  floating: HTMLElement,
  update: () => void,
  options: AutoUpdateOptions = {}
): () => void {
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === 'function',
  } = options;

  const ancestors = [
    ...getOverflowAncestors(reference),
    ...getOverflowAncestors(floating),
  ];

  const uniqueAncestors = [...new Set(ancestors)];

  uniqueAncestors.forEach((ancestor) => {
    if (ancestorScroll) {
      ancestor.addEventListener('scroll', update, { passive: true });
    }
    if (ancestorResize) {
      ancestor.addEventListener('resize', update);
    }
  });

  let resizeObserver: ResizeObserver | null = null;

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
        ancestor.removeEventListener('scroll', update);
      }
      if (ancestorResize) {
        ancestor.removeEventListener('resize', update);
      }
    });
    resizeObserver?.disconnect();
  };
}

export interface DropdownInstance {
  update: () => void;
  destroy: () => void;
  show: () => void;
  hide: () => void;
  isVisible: () => boolean;
}

export function createDropdown(
  reference: HTMLInputElement | HTMLTextAreaElement,
  floating: HTMLElement,
  config: PositionConfig & AutoUpdateOptions = {}
): DropdownInstance {
  let cleanup: (() => void) | null = null;
  let visible = false;

  const update = () => {
    if (!visible) return;
    const position = computePosition(reference, floating, config);
    applyPosition(floating, position);
  };

  const show = () => {
    if (visible) return;
    visible = true;
    floating.style.display = '';
    cleanup = autoUpdate(reference, floating, update, config);
  };

  const hide = () => {
    if (!visible) return;
    visible = false;
    floating.style.display = 'none';
    cleanup?.();
    cleanup = null;
  };

  floating.style.display = 'none';

  return {
    update,
    destroy: () => {
      cleanup?.();
      cleanup = null;
    },
    show,
    hide,
    isVisible: () => visible,
  };
}
