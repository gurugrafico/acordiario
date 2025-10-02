// js/audioManager.js

/**
 * Manages loading and playing sound effects for the UI.
 */
export const audioManager = {
    sounds: {},
    isInitialized: false,

    init() {
        // Preload sounds to avoid delay on first play.
        // IMPORTANT: You must place click.mp3 and success.mp3 in an /audio/ folder.
        this.sounds.click = new Audio('audio/click.mp3');
        this.sounds.success = new Audio('audio/success.mp3');
        this.sounds.metronomeClick = new Audio('audio/metronome_click.mp3'); // Nuevo sonido para el metrónomo
        
        Object.values(this.sounds).forEach(sound => {
            sound.preload = 'auto';
        });

        this.isInitialized = true;
    },

    playSound(name) {
        if (!this.isInitialized || !this.sounds[name]) return;

        const sound = this.sounds[name];
        sound.currentTime = 0; // Rewind to the start
        const playPromise = sound.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn(`Could not play sound "${name}":`, error);
            });
        }
    },

    playClick() { this.playSound('click'); },
    playSuccess() { this.playSound('success'); },
    playMetronomeClick() { this.playSound('metronomeClick'); } // Nuevo método para el clic del metrónomo
};