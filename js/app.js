// js/app.js
import { dataManager } from './dataManager.js';
import { uiManager } from './uiManager.js';
import { timerManager } from './timerManager.js';
import { triggerConfetti } from './effects.js';
import { audioManager } from './audioManager.js';
import { metronomeManager } from './metronome.js';

/**
 * Connects all modules and handles user input.
 */
const appController = {
    init() {
        dataManager.init();
        audioManager.init();
        metronomeManager.init(
            uiManager.DOMElements.metronomeIndicator,
            uiManager.DOMElements.metronomeToggleBtn,
            uiManager.DOMElements.metronomeBpm,
            uiManager.DOMElements.metronomeBpmDisplay,
            uiManager.DOMElements.metronomeSoundToggle, // Pasar el nuevo elemento del checkbox
            audioManager // Pasar la instancia de audioManager
        );
        this.setupEventListeners();
        uiManager.renderStudyPlan(dataManager.studyPlan, dataManager.categoryToIcon);
        uiManager.renderSettings(dataManager.userSettings); // Populate settings form on init
        this.updateAllUI();
    },

    updateAllUI() {
        const logs = dataManager.practiceLogs;
        const streak = dataManager.calculateStreak();
        const todayTask = dataManager.getTodayTask();
        const goalProgress = dataManager.getGoalProgress();
        
        uiManager.updateDashboard(todayTask, streak);
        uiManager.updateGoalsView(goalProgress); // Update goals display
        uiManager.renderWeeklyChart(logs);
        uiManager.updateProgressView(logs, dataManager.studyPlan.categories, streak);
        uiManager.renderSessionHistory(logs, dataManager.categoryToIcon);
        if (uiManager.currentView === 'calendar') {
            uiManager.renderCalendar(logs, dataManager.calendarDate);
        }
    },

    setupEventListeners() {
        const DOMElements = uiManager.DOMElements;

        // Navigation
        DOMElements.navLinks.forEach(link => link.addEventListener('click', e => {
            e.preventDefault();
            const viewId = e.currentTarget.dataset.view;
            if (viewId) {
                uiManager.switchView(viewId);
                if (viewId === 'settings') uiManager.renderSettings(dataManager.userSettings); // Re-render settings when view is shown
                if (viewId === 'calendar') this.updateAllUI();
            }
        }));

        // Theme Toggle
        DOMElements.themeToggle.addEventListener('click', () => {
            uiManager.toggleTheme();
            this.updateAllUI();
        });

        // Calendar Navigation
        DOMElements.prevMonthBtn.addEventListener('click', () => {
            dataManager.calendarDate.setMonth(dataManager.calendarDate.getMonth() - 1);
            uiManager.renderCalendar(dataManager.practiceLogs, dataManager.calendarDate);
        });
        DOMElements.nextMonthBtn.addEventListener('click', () => {
            dataManager.calendarDate.setMonth(dataManager.calendarDate.getMonth() + 1);
            uiManager.renderCalendar(dataManager.practiceLogs, dataManager.calendarDate);
        });

        // Practice Flow
        DOMElements.startPracticeBtn.addEventListener('click', () => {
            const task = dataManager.getTodayTask();
            uiManager.openModal('practice-modal');
            DOMElements.timerCategory.textContent = task.category;
            timerManager.start(timeString => DOMElements.timerDisplay.textContent = timeString);
            audioManager.playClick();
        });

        DOMElements.finishPracticeBtn.addEventListener('click', () => {
            const duration = timerManager.stop();
            metronomeManager.stop();
            uiManager.closeModal('practice-modal');
            const task = dataManager.getTodayTask();
            DOMElements.logCategory.innerHTML = dataManager.studyPlan.categories.map(c => `<option value="${c}" ${c === task.category ? 'selected' : ''}>${c}</option>`).join('');
            DOMElements.logFocus.value = task.focus.startsWith('Práctica libre') ? '' : task.focus;
            DOMElements.logDuration.value = duration;
            DOMElements.logNotes.value = '';
            uiManager.openModal('log-modal');
        });

        DOMElements.cancelPracticeBtn.addEventListener('click', () => {
            timerManager.stop();
            metronomeManager.stop();
            uiManager.closeModal('practice-modal');
        });

        // Log Submission
        DOMElements.logForm.addEventListener('submit', e => {
            e.preventDefault();
            const newLog = {
                date: dataManager.getTodayString(),
                duration: parseInt(DOMElements.logDuration.value),
                category: DOMElements.logCategory.value,
                focus: DOMElements.logFocus.value,
                notes: DOMElements.logNotes.value,
            };
            dataManager.addLog(newLog);
            uiManager.closeModal('log-modal');
            this.updateAllUI();
            audioManager.playSuccess();
            triggerConfetti();
        });
        DOMElements.cancelLogBtn.addEventListener('click', () => uiManager.closeModal('log-modal'));

        // Metronome Controls
        DOMElements.metronomeToggleBtn.addEventListener('click', () => {
            metronomeManager.toggle();
        });

        DOMElements.metronomeBpm.addEventListener('input', (e) => {
            const bpm = e.target.value;
            DOMElements.metronomeBpmDisplay.textContent = bpm;
            metronomeManager.setBPM(bpm);
        });

        DOMElements.metronomeSoundToggle.addEventListener('change', () => {
            metronomeManager.toggleSound();
        });

        // Settings Form
        if (DOMElements.settingsForm) {
            DOMElements.settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newSettings = {
                    dailyGoal: parseInt(DOMElements.dailyGoalInput.value, 10) || 0,
                    weeklyGoal: parseInt(DOMElements.weeklyGoalInput.value, 10) || 0,
                };
                dataManager.updateSettings(newSettings);
                this.updateAllUI();
                alert('¡Ajustes guardados!');
                uiManager.switchView('dashboard'); // Go back to dashboard after saving
            });
        }

        // Edit/Delete History
        DOMElements.exportCsvBtn.addEventListener('click', () => {
            dataManager.exportLogsToCSV();
        });

        DOMElements.importCsvBtn.addEventListener('click', () => {
            DOMElements.importCsvInput.click();
        });

        DOMElements.importCsvInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const success = dataManager.importLogsFromCSV(e.target.result);
                if (success) {
                    this.updateAllUI();
                }
                event.target.value = ''; 
            };
            reader.onerror = () => alert('Error al leer el archivo.');
            reader.readAsText(file);
        });

        DOMElements.sessionHistoryList.addEventListener('click', e => {
            const editBtn = e.target.closest('.edit-log-btn');
            const deleteBtn = e.target.closest('.delete-log-btn');

            if (deleteBtn) {
                const index = deleteBtn.dataset.index;
                if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
                    dataManager.deleteLog(index);
                    this.updateAllUI();
                }
            }

            if (editBtn) {
                const index = editBtn.dataset.index;
                const log = dataManager.practiceLogs[index];
                document.getElementById('edit-log-index').value = index;
                document.getElementById('edit-log-date').value = log.date;
                document.getElementById('edit-log-category').innerHTML = dataManager.studyPlan.categories.map(c => `<option value="${c}" ${c === log.category ? 'selected' : ''}>${c}</option>`).join('');
                document.getElementById('edit-log-focus').value = log.focus;
                document.getElementById('edit-log-duration').value = log.duration;
                document.getElementById('edit-log-notes').value = log.notes;
                uiManager.openModal('edit-log-modal');
            }
        });

        DOMElements.editLogForm.addEventListener('submit', e => {
            e.preventDefault();
            const index = document.getElementById('edit-log-index').value;
            const updatedLog = {
                date: document.getElementById('edit-log-date').value,
                duration: parseInt(document.getElementById('edit-log-duration').value),
                category: document.getElementById('edit-log-category').value,
                focus: document.getElementById('edit-log-focus').value,
                notes: document.getElementById('edit-log-notes').value,
            };
            dataManager.updateLog(index, updatedLog);
            uiManager.closeModal('edit-log-modal');
            this.updateAllUI();
        });
        DOMElements.cancelEditLogBtn.addEventListener('click', () => uiManager.closeModal('edit-log-modal'));
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    appController.init();
});