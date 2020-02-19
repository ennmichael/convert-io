export function webWorkersSupported(): boolean {
    return window.Worker !== undefined
}

export function serviceWorkersSupported(): boolean {
    return navigator.serviceWorker !== undefined
}
