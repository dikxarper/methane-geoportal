let listener: ((value: number) => void) | null = null;
let frame: number | null = null;
let pendingValue = 100;

export function registerPlumeOpacityPreview(callback: (value: number) => void) {
    listener = callback;

    return () => {
        if (listener === callback) listener = null;

        if (frame !== null) {
            cancelAnimationFrame(frame);
            frame = null;
        }
    };
}

export function previewPlumeOpacity(value: number) {
    pendingValue = Math.max(0, Math.min(100, value));

    if (frame !== null) return;

    frame = requestAnimationFrame(() => {
        frame = null;
        listener?.(pendingValue);
    });
}
