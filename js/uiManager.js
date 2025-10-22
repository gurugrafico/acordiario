// js/uiManager.js
import { dataManager } from './dataManager.js';

/**
 * Manages all DOM elements and rendering logic.
 */
export const uiManager = {
    DOMElements: {
        // Views
        views: document.querySelectorAll('.view'),
        // Navigation
        navLinks: document.querySelectorAll('.nav-link'),
        // Theme
        themeToggle: document.getElementById('theme-toggle'),
        themeIconSun: document.getElementById('theme-icon-sun'),
        themeIconMoon: document.getElementById('theme-icon-moon'),
        // Dashboard
        todayCategory: document.getElementById('today-category'),
        todayFocus: document.getElementById('today-focus'),
        streakDays: document.getElementById('streak-days'),
        weeklyChartCanvas: document.getElementById('weekly-chart'),
        // Calendar
        calendarGrid: document.getElementById('calendar-grid'),
        monthYearHeader: document.getElementById('month-year-header'),
        prevMonthBtn: document.getElementById('prev-month-btn'),
        nextMonthBtn: document.getElementById('next-month-btn'),
        // Progress
        progressDonutChartCanvas: document.getElementById('progress-donut-chart'),
        statsTotalTime: document.getElementById('stats-total-time'),
        statsTotalSessions: document.getElementById('stats-total-sessions'),
        statsAvgTime: document.getElementById('stats-avg-time'),
        statsBestStreak: document.getElementById('stats-best-streak'),
        sessionHistoryList: document.getElementById('session-history-list'),
        exportCsvBtn: document.getElementById('export-csv-btn'),
        importCsvBtn: document.getElementById('import-csv-btn'),
        importCsvInput: document.getElementById('import-csv-input'),
        // Plan
        studyPlanContainer: document.getElementById('study-plan-container'),
        // Modals
        practiceModal: document.getElementById('practice-modal'),
        logModal: document.getElementById('log-modal'),
        editLogModal: document.getElementById('edit-log-modal'),
        // Timer
        timerDisplay: document.getElementById('timer'),
        timerCategory: document.getElementById('timer-category'),
        // Metronome
        metronomeIndicator: document.getElementById('metronome-indicator'),
        metronomeBpm: document.getElementById('metronome-bpm'),
        metronomeBpmDisplay: document.getElementById('metronome-bpm-display'),
        metronomeToggleBtn: document.getElementById('metronome-toggle-btn'),
        metronomeSoundToggle: document.getElementById('metronome-sound-toggle'), // Nuevo elemento
        // Goals
        dailyGoalProgressBar: document.getElementById('daily-goal-progress-bar'),
        dailyGoalProgressText: document.getElementById('daily-goal-progress-text'),
        weeklyGoalProgressBar: document.getElementById('weekly-goal-progress-bar'),
        weeklyGoalProgressText: document.getElementById('weekly-goal-progress-text'),
        // Settings
        settingsForm: document.getElementById('settings-form'),
        dailyGoalInput: document.getElementById('daily-goal-input'),
        weeklyGoalInput: document.getElementById('weekly-goal-input'),
        // Forms & Buttons
        startPracticeBtn: document.getElementById('start-practice-btn'),
        finishPracticeBtn: document.getElementById('finish-practice-btn'),
        cancelPracticeBtn: document.getElementById('cancel-practice-btn'),
        logForm: document.getElementById('log-form'),
        logCategory: document.getElementById('log-category'),
        logFocus: document.getElementById('log-focus'),
        logDuration: document.getElementById('log-duration'),
        logNotes: document.getElementById('log-notes'),
        cancelLogBtn: document.getElementById('cancel-log-btn'),
        editLogForm: document.getElementById('edit-log-form'),
        cancelEditLogBtn: document.getElementById('cancel-edit-log-btn'),
    },
    chartInstances: { weekly: null, donut: null },
    currentView: 'dashboard',

    switchView(viewId) {
        this.currentView = viewId;
        this.DOMElements.views.forEach(view => view.classList.add('hidden'));
        document.getElementById(viewId).classList.remove('hidden');
        this.DOMElements.navLinks.forEach(navLink => {
            navLink.classList.toggle('active', navLink.dataset.view === viewId);
        });
    },

    updateDashboard(task, streak) {
        this.DOMElements.todayCategory.textContent = task.category;
        this.DOMElements.todayFocus.textContent = task.focus;
        this.DOMElements.streakDays.textContent = streak;
    },

    updateGoalsView(progressData) {
        // Daily
        const daily = progressData.daily;
        if (this.DOMElements.dailyGoalProgressBar) {
            this.DOMElements.dailyGoalProgressBar.style.width = `${daily.percentage}%`;
            this.DOMElements.dailyGoalProgressText.textContent = `${daily.progress} / ${daily.goal} min`;
        }

        // Weekly
        const weekly = progressData.weekly;
        if (this.DOMElements.weeklyGoalProgressBar) {
            this.DOMElements.weeklyGoalProgressBar.style.width = `${weekly.percentage}%`;
            this.DOMElements.weeklyGoalProgressText.textContent = `${weekly.progress} / ${weekly.goal} min`;
        }
    },

    renderSettings(settings) {
        if (this.DOMElements.dailyGoalInput) this.DOMElements.dailyGoalInput.value = settings.dailyGoal;
        if (this.DOMElements.weeklyGoalInput) this.DOMElements.weeklyGoalInput.value = settings.weeklyGoal;
    },

    renderWeeklyChart(logs) {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

        const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        const data = Array(7).fill(0).map((_, i) => {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const dateString = currentDate.toISOString().split('T')[0];
            return logs.filter(log => log.date === dateString).reduce((sum, log) => sum + log.duration, 0);
        });

        const isDarkMode = document.documentElement.classList.contains('dark');
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = isDarkMode ? '#A8A8A8' : '#6E6E6E';

        if (this.chartInstances.weekly) this.chartInstances.weekly.destroy();
        this.chartInstances.weekly = new Chart(this.DOMElements.weeklyChartCanvas.getContext('2d'), {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Minutos Practicados', data, backgroundColor: 'rgba(58, 134, 255, 0.8)', borderRadius: 5 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: textColor } }, x: { grid: { display: false }, ticks: { color: textColor } } } }
        });
    },
    
    renderCalendar(logs, date) {
        const grid = this.DOMElements.calendarGrid;
        grid.innerHTML = '';
        this.DOMElements.monthYearHeader.textContent = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

        const month = date.getMonth();
        const year = date.getFullYear();
        const firstDay = (new Date(year, month, 1).getDay() + 6) % 7; // Monday as 0
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].forEach(day => {
            grid.innerHTML += `<div class="font-bold text-sm text-[var(--text-secondary)]">${day}</div>`;
        });
        grid.innerHTML += '<div></div>'.repeat(firstDay);

        for (let i = 1; i <= daysInMonth; i++) {
            const dateString = new Date(year, month, i).toISOString().split('T')[0];
            const hasLog = logs.some(log => log.date === dateString);
            const dayEl = document.createElement('div');
            dayEl.textContent = i;
            dayEl.className = "p-2 rounded-full cursor-pointer hover:bg-white/20 transition-colors";
            if (hasLog) dayEl.classList.add('bg-[var(--accent-primary)]', 'text-white', 'font-bold');
            grid.appendChild(dayEl);
        }
    },

    updateProgressView(logs, categories, streak) {
        const categoryData = categories.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {});
        logs.forEach(log => { if(categoryData.hasOwnProperty(log.category)) categoryData[log.category] += log.duration; });

        const isDarkMode = document.documentElement.classList.contains('dark');
        const textColor = isDarkMode ? '#FFFFFF' : '#121212';

        if (this.chartInstances.donut) this.chartInstances.donut.destroy();
        this.chartInstances.donut = new Chart(this.DOMElements.progressDonutChartCanvas.getContext('2d'), {
            type: 'doughnut',
            data: { labels: Object.keys(categoryData), datasets: [{ data: Object.values(categoryData), backgroundColor: ['#3A86FF', '#FF006E', '#8338EC', '#FFBE0B', '#FB5607', '#3a5a40', '#0077b6'], borderColor: isDarkMode ? '#1E1E1E' : '#FFFFFF', borderWidth: 4 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: textColor } } } }
        });

        const totalMinutes = logs.reduce((sum, log) => sum + log.duration, 0);
        const uniquePracticeDays = [...new Set(logs.map(log => log.date))].length;
        this.DOMElements.statsTotalTime.textContent = dataManager.formatMinutes(totalMinutes);
        this.DOMElements.statsTotalSessions.textContent = logs.length;
        this.DOMElements.statsAvgTime.textContent = uniquePracticeDays > 0 ? `${Math.round(totalMinutes/uniquePracticeDays)}m` : '0m';
        this.DOMElements.statsBestStreak.textContent = `${streak} días`;
    },

    renderSessionHistory(logs, categoryToIcon) {
        const listContainer = this.DOMElements.sessionHistoryList;
        listContainer.innerHTML = '';
        if (logs.length === 0) {
            listContainer.innerHTML = `<p class="text-[var(--text-secondary)] text-center">Aún no has registrado ninguna sesión.</p>`;
            return;
        }
        [...logs].sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(log => {
            const originalIndex = logs.indexOf(log);
            const icon = categoryToIcon[log.category] || '🎵';
            const formattedDate = new Date(log.date + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
            listContainer.innerHTML += `
                <div class="flex justify-between items-center p-4 bg-white/5 rounded-lg flex-wrap gap-2">
                    <div class="flex-grow">
                        <p class="font-bold">${icon} ${log.category} - <span class="font-normal text-[var(--text-secondary)]">${formattedDate}</span></p>
                        <p class="text-sm text-[var(--text-secondary)] mt-1"><strong>Foco:</strong> ${log.focus || 'N/A'} | <strong>Duración:</strong> ${log.duration}m</p>
                        ${log.notes ? `<p class="text-sm text-gray-400 mt-1"><strong>Notas:</strong> ${log.notes}</p>` : ''}
                    </div>
                    <div class="flex gap-2 flex-shrink-0">
                        <button class="edit-log-btn p-2 rounded hover:bg-white/20 transition-colors" data-index="${originalIndex}" title="Editar">✏️</button>
                        <button class="delete-log-btn p-2 rounded hover:bg-white/20 transition-colors" data-index="${originalIndex}" title="Eliminar">🗑️</button>
                    </div>
                </div>`;
        });
    },

    renderStudyPlan(plan, categoryToIcon) {
        const container = this.DOMElements.studyPlanContainer;
        container.innerHTML = '';
        const dayNameToIndex = { "Domingo": 0, "Lunes": 1, "Martes": 2, "Miércoles": 3, "Jueves": 4, "Viernes": 5, "Sábado": 6 };

        plan.phases.forEach((phase, index) => {
            const phaseEl = document.createElement('div');
            phaseEl.className = 'bg-[var(--bg-secondary)] rounded-xl';
            let contentHTML = '';
            if (phase.weeks.length > 0) {
                contentHTML = `<ul class="space-y-3">${phase.weeks.map(week => {
                    const dayDetails = Object.entries(week.focus).map(([day, task]) => {
                        // Ensure dayNameToIndex[day] is valid before accessing plan.rotation
                        const dayIndex = dayNameToIndex[day];
                        const category = (dayIndex !== undefined && dayIndex >= 0 && dayIndex < plan.rotation.length) 
                                         ? plan.rotation[dayIndex] : 'General'; // Fallback to 'General' or a default category
                        const icon = categoryToIcon[category] || '🎵';
                        return `<div class="flex items-start gap-3"><span class="w-6 text-center text-xl">${icon}</span><div><strong class="text-[var(--text-primary)]">${day}:</strong> <span class="text-[var(--text-secondary)]">${task}</span></div></div>`;
                    }).join('');
                    return `<li class="p-3 bg-white/5 rounded-lg"><h4 class="font-bold mb-2">Semana del ${week.range}</h4><div class="space-y-2">${dayDetails}</div></li>`;
                }).join('')}</ul>`;
            } else {
                contentHTML = 'Detalles para esta fase se añadirán pronto.';
            }

            // Expand the first phase that has content by default
            const isExpanded = index === 0 && phase.weeks.length > 0;
            const hiddenClass = isExpanded ? '' : 'hidden';
            const rotateClass = isExpanded ? 'rotate-180' : '';

            phaseEl.innerHTML = `
                <button class="w-full text-left p-4 font-bold text-lg flex justify-between items-center">
                    <span>${phase.name}</span><span class="transform transition-transform ${rotateClass}">▼</span>
                </button>
                <div class="p-4 border-t border-white/10 ${hiddenClass}">${contentHTML}</div>`;
            
            phaseEl.querySelector('button').addEventListener('click', (e) => {
                const btn = e.currentTarget;
                btn.nextElementSibling.classList.toggle('hidden');
                btn.querySelector('span:last-child').classList.toggle('rotate-180');
            });
            container.appendChild(phaseEl);
        });
    },

    toggleTheme() {
        document.documentElement.classList.toggle('dark');
        document.documentElement.classList.toggle('light');
        this.DOMElements.themeIconSun.classList.toggle('hidden');
        this.DOMElements.themeIconMoon.classList.toggle('hidden');
    },

    openModal(modalId) { document.getElementById(modalId).classList.remove('hidden'); },
    closeModal(modalId) { document.getElementById(modalId).classList.add('hidden'); },
};