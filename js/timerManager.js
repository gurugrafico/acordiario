// js/timerManager.js

/**
 * Encapsulates all timer logic.
 */
export const timerManager = {
    secondsElapsed: 0,
    intervalId: null,
    start(onTickCallback) {
        this.secondsElapsed = 0;
        this.intervalId = setInterval(() => {
            this.secondsElapsed++;
            const h = String(Math.floor(this.secondsElapsed / 3600)).padStart(2, '0');
            const m = String(Math.floor((this.secondsElapsed % 3600) / 60)).padStart(2, '0');
            const s = String(this.secondsElapsed % 60).padStart(2, '0');
            onTickCallback(`${h}:${m}:${s}`);
        }, 1000);
    },
    stop() {
        clearInterval(this.intervalId);
        return Math.max(1, Math.round(this.secondsElapsed / 60));
    }
};