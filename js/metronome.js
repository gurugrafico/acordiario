// js/metronome.js

/**
 * Manages the visual metronome.
 */
export const metronomeManager = {
    isPlaying: false,
    bpm: 120,
    intervalId: null,
    localStorageKeyBPM: 'metronomeBPM', // Clave para localStorage
    localStorageKeySound: 'metronomeSoundEnabled', // Nueva clave para localStorage
    isSoundEnabled: false, // Nuevo estado para el sonido
    elements: {
        indicator: null,
        toggleBtn: null,
        bpmInput: null,   // Elemento para el deslizador de BPM
        bpmDisplay: null, // Elemento para la visualización del BPM
        soundToggleInput: null, // Nuevo elemento para el checkbox del sonido
    },
    audioManager: null, // Referencia al módulo de audio

    init(indicatorElement, toggleBtnElement, bpmInputElement, bpmDisplayElement, soundToggleInputElement, audioManagerInstance) {
        this.elements.indicator = indicatorElement;
        this.elements.toggleBtn = toggleBtnElement;
        this.elements.bpmInput = bpmInputElement;
        this.elements.bpmDisplay = bpmDisplayElement;
        this.elements.soundToggleInput = soundToggleInputElement;
        this.audioManager = audioManagerInstance;

        // Cargar BPM desde localStorage o usar el valor predeterminado
        const savedBPM = localStorage.getItem(this.localStorageKeyBPM);
        this.bpm = savedBPM ? parseInt(savedBPM, 10) : 120;
        // Cargar preferencia de sonido desde localStorage
        const savedSoundEnabled = localStorage.getItem(this.localStorageKeySound);
        this.isSoundEnabled = savedSoundEnabled ? JSON.parse(savedSoundEnabled) : false;

        // Actualizar los elementos de la interfaz con el BPM cargado
        if (this.elements.bpmInput) this.elements.bpmInput.value = this.bpm;
        if (this.elements.bpmDisplay) this.elements.bpmDisplay.textContent = this.bpm;
        if (this.elements.soundToggleInput) this.elements.soundToggleInput.checked = this.isSoundEnabled;
    },

    setBPM(newBpm) {
        this.bpm = parseInt(newBpm, 10);
        localStorage.setItem(this.localStorageKeyBPM, this.bpm); // Guardar BPM en localStorage
        if (this.isPlaying) {
            this.stop();
            this.start();
        }
    },

    tick() {
        this.elements.indicator.classList.add('metronome-pulse');
        // Remove the class after the animation is done to allow re-triggering
        setTimeout(() => {
            this.elements.indicator.classList.remove('metronome-pulse');
        }, 100); // Duration of the pulse animation

        if (this.isSoundEnabled && this.audioManager) {
            this.audioManager.playMetronomeClick();
        }
    },

    start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.elements.toggleBtn.textContent = 'Detener Metrónomo';
        const intervalTime = 60000 / this.bpm;
        this.intervalId = setInterval(() => this.tick(), intervalTime);
        this.tick(); // First tick immediately
    },

    stop() {
        if (!this.isPlaying) return;
        this.isPlaying = false;
        this.elements.toggleBtn.textContent = 'Iniciar Metrónomo';
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.elements.indicator.classList.remove('metronome-pulse');
    },

    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.start();
        }
    },

    toggleSound() {
        this.isSoundEnabled = !this.isSoundEnabled;
        localStorage.setItem(this.localStorageKeySound, JSON.stringify(this.isSoundEnabled));
    }
};