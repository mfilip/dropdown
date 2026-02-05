type Placement = 'bottom' | 'top';
interface PositionConfig {
    placement?: Placement;
    offset?: number;
    flipOnOverflow?: boolean;
}
interface Position {
    x: number;
    y: number;
    width: number;
    placement: Placement;
}
interface AutoUpdateOptions {
    ancestorScroll?: boolean;
    ancestorResize?: boolean;
    elementResize?: boolean;
}
declare function computePosition(reference: HTMLInputElement | HTMLTextAreaElement, floating: HTMLElement, config?: PositionConfig): Position;
declare function applyPosition(floating: HTMLElement, position: Position): void;
declare function autoUpdate(reference: HTMLInputElement | HTMLTextAreaElement, floating: HTMLElement, update: () => void, options?: AutoUpdateOptions): () => void;
interface DropdownInstance {
    update: () => void;
    destroy: () => void;
    show: () => void;
    hide: () => void;
    isVisible: () => boolean;
}
declare function createDropdown(reference: HTMLInputElement | HTMLTextAreaElement, floating: HTMLElement, config?: PositionConfig & AutoUpdateOptions): DropdownInstance;

export { type AutoUpdateOptions, type DropdownInstance, type Placement, type Position, type PositionConfig, applyPosition, autoUpdate, computePosition, createDropdown };
