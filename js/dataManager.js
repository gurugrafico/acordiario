// js/dataManager.js

/**
 * Manages all application state and data, including localStorage.
 */
export const dataManager = {
    practiceLogs: [],
    calendarDate: new Date(2025, 5, 1),
    userSettings: { dailyGoal: 30, weeklyGoal: 180 }, // Default settings
    studyPlan: {
        rotation: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map(day => {
            const dayIndex = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].indexOf(day);
            const rotationMap = { 0: "Composición", 1: "Teoría Musical", 2: "Guitarra", 3: "Teclado", 4: "Batería", 5: "Violín", 6: "Canto" };
            return rotationMap[dayIndex];
        }),
        categories: ["Teoría Musical", "Guitarra", "Teclado", "Batería", "Violín", "Canto", "Composición"],
        phases: [
            { name: "Fase 1: Junio - Julio (Teoría y Fundamentos)", weeks: [
                { range: "24-30 Jun", startDate: "2025-06-24", focus: { "Lunes": "Lectura de partituras", "Martes": "Postura y acordes abiertos", "Miércoles": "Digitación y escalas", "Jueves": "Técnica de baquetas", "Viernes": "Postura y arco", "Sábado": "Respiración y vocalización", "Domingo": "Construcción de melodías" } },
                { range: "1-7 Jul", startDate: "2025-07-01", focus: { "Lunes": "Claves, figuras rítmicas", "Martes": "Progresiones básicas", "Miércoles": "Acordes mayores y menores", "Jueves": "Ritmos en 4/4", "Viernes": "Ejercicios de coordinación", "Sábado": "Expresión vocal", "Domingo": "Análisis de canciones" } },
                { range: "8-14 Jul", startDate: "2025-07-08", focus: { "Lunes": "Escalas mayores y menores", "Martes": "Técnica de rasgueo", "Miércoles": "Lectura en clave de sol y fa", "Jueves": "Independencia de manos", "Viernes": "Afinación y cambios de cuerdas", "Sábado": "Control de volumen", "Domingo": "Creación de progresiones" } },
                { range: "15-21 Jul", startDate: "2025-07-15", focus: { "Lunes": "Armonía funcional", "Martes": "Arpegios y escalas pentatónicas", "Miércoles": "Inversión de acordes", "Jueves": "Ritmos avanzados", "Viernes": "Vibrato y cambios de posición", "Sábado": "Interpretación vocal", "Domingo": "Desarrollo de secciones" } }
            ]},
            { name: "Fase 2: Julio - Septiembre (Desarrollo Técnico y Expresivo)", weeks: [
                { range: "22-28 Jul", startDate: "2025-07-22", focus: { "Lunes": "Intervalos y modos", "Martes": "Técnicas avanzadas", "Miércoles": "Acordes extendidos", "Jueves": "Fills y polirritmias", "Viernes": "Ejercicios de velocidad", "Sábado": "Rango vocal", "Domingo": "Composición armónica" } },
                { range: "29 Jul - 4 Ago", startDate: "2025-07-29", focus: { "Lunes": "Progresiones armónicas", "Martes": "Fingerpicking", "Miércoles": "Acompañamientos básicos", "Jueves": "Coordinación avanzada", "Viernes": "Cambio de posición y arco", "Sábado": "Control de tono", "Domingo": "Creación de letras" } }
            ]},
            { name: "Fase 3: Octubre - Noviembre (Aplicación y Fusión de Habilidades)", weeks: [] },
            { name: "Fase 4: Diciembre (Consolidación y Creación)", weeks: [] }
        ]
    },
    categoryToIcon: { "Composición": "✍️", "Teoría Musical": "📖", "Guitarra": "🎸", "Teclado": "🎹", "Batería": "🥁", "Violín": "🎻", "Canto": "🎤" },

    init() {
        this.practiceLogs = JSON.parse(localStorage.getItem('practiceLogs')) || [
            { date: '2025-06-18', duration: 30, category: 'Guitarra', focus: 'Acordes básicos', notes: '' },
            { date: '2025-06-19', duration: 45, category: 'Teclado', focus: 'Escalas C Mayor', notes: '' },
            { date: '2025-06-20', duration: 25, category: 'Teoría Musical', focus: 'Lectura rítmica', notes: '' },
        ];
        const savedSettings = localStorage.getItem('userSettings');
        this.userSettings = savedSettings ? JSON.parse(savedSettings) : { dailyGoal: 30, weeklyGoal: 180 };
    },
    saveLogs() {
        localStorage.setItem('practiceLogs', JSON.stringify(this.practiceLogs));
    },
    addLog(log) {
        this.practiceLogs.push(log);
        this.saveLogs();
    },
    updateLog(index, log) {
        this.practiceLogs[index] = log;
        this.saveLogs();
    },
    deleteLog(index) {
        this.practiceLogs.splice(index, 1);
        this.saveLogs();
    },
    saveSettings() {
        localStorage.setItem('userSettings', JSON.stringify(this.userSettings));
    },
    updateSettings(newSettings) {
        this.userSettings = { ...this.userSettings, ...newSettings };
        this.saveSettings();
    },
    getTodayString: () => new Date().toISOString().split('T')[0],
    formatMinutes: (minutes) => {
        if (minutes < 60) return `${minutes}m`;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    },
    getTodayTask() {
        const today = new Date();
        const dayOfWeekIndex = today.getDay();
        const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const category = this.studyPlan.rotation[dayOfWeekIndex];
        let focus = `Práctica libre de ${category}.`;

        for (const phase of this.studyPlan.phases) {
            for (const week of phase.weeks) {
                const startDate = new Date(week.startDate + 'T00:00:00');
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);
                if (today >= startDate && today <= endDate) {
                    focus = week.focus[dayNames[dayOfWeekIndex]] || focus;
                    break;
                }
            }
        }
        return { category, focus };
    },
    calculateStreak() {
        const sortedLogs = [...this.practiceLogs].sort((a,b) => new Date(b.date) - new Date(a.date));
        const uniqueDates = [...new Set(sortedLogs.map(log => log.date))];
        if (uniqueDates.length === 0) return 0;

        let streak = 0;
        let lastDate = new Date();
        const todayStr = this.getTodayString();
        const yesterdayStr = new Date(lastDate.setDate(lastDate.getDate() - 1)).toISOString().split('T')[0];

        if (uniqueDates[0] === todayStr || uniqueDates[0] === yesterdayStr) {
            streak = 1;
            lastDate = new Date(uniqueDates[0] + 'T00:00:00');
            for(let i = 1; i < uniqueDates.length; i++){
                const currentDate = new Date(uniqueDates[i] + 'T00:00:00');
                const diffDays = Math.round((lastDate - currentDate) / (1000 * 60 * 60 * 24));
                if(diffDays === 1){
                    streak++;
                    lastDate = currentDate;
                } else {
                    break;
                }
            }
        }
        return streak;
    },
    getGoalProgress() {
        // Daily Progress
        const todayStr = this.getTodayString();
        const dailyProgress = this.practiceLogs
            .filter(log => log.date === todayStr)
            .reduce((sum, log) => sum + log.duration, 0);

        // Weekly Progress
        const today = new Date();
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
        startOfWeek.setHours(0, 0, 0, 0);

        const weeklyProgress = this.practiceLogs
            .filter(log => {
                const logDate = new Date(log.date + 'T00:00:00');
                return logDate >= startOfWeek;
            })
            .reduce((sum, log) => sum + log.duration, 0);

        return {
            daily: {
                progress: dailyProgress,
                goal: this.userSettings.dailyGoal,
                percentage: this.userSettings.dailyGoal > 0 ? Math.min(100, (dailyProgress / this.userSettings.dailyGoal) * 100) : 0,
            },
            weekly: {
                progress: weeklyProgress,
                goal: this.userSettings.weeklyGoal,
                percentage: this.userSettings.weeklyGoal > 0 ? Math.min(100, (weeklyProgress / this.userSettings.weeklyGoal) * 100) : 0,
            }
        };
    },
    exportLogsToCSV() {
        if (this.practiceLogs.length === 0) {
            alert('No hay datos para exportar.');
            return;
        }

        const headers = ['Fecha', 'Categoría', 'Foco', 'Duración (min)', 'Notas'];
        
        const escapeCSV = (field) => {
            if (field === null || field === undefined) return '';
            let str = String(field);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                str = str.replace(/"/g, '""');
                return `"${str}"`;
            }
            return str;
        };

        const csvRows = [
            headers.join(','),
            ...this.practiceLogs.map(log => [
                escapeCSV(log.date), escapeCSV(log.category), escapeCSV(log.focus),
                escapeCSV(log.duration), escapeCSV(log.notes)
            ].join(','))
        ];

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'acordiario_progreso.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    importLogsFromCSV(csvString) {
        const parseCSVLine = (line) => {
            const result = [];
            let currentField = '';
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    if (inQuotes && line[i+1] === '"') {
                        currentField += '"';
                        i++;
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (char === ',' && !inQuotes) {
                    result.push(currentField);
                    currentField = '';
                } else {
                    currentField += char;
                }
            }
            result.push(currentField);
            return result;
        };

        try {
            const lines = csvString.trim().split(/\r?\n/);
            if (lines.length < 2) {
                alert('El archivo CSV está vacío o no tiene registros.');
                return false;
            }

            const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
            const expectedHeaders = ['fecha', 'categoría', 'foco', 'duración (min)', 'notas'];
            if (headers.length !== expectedHeaders.length || !headers.every((h, i) => h === expectedHeaders[i])) {
                 alert('Las cabeceras del CSV no coinciden con el formato esperado: Fecha, Categoría, Foco, Duración (min), Notas');
                 return false;
            }

            const newLogs = lines.slice(1).map((line, index) => {
                const values = parseCSVLine(line);
                if (values.length !== 5) throw new Error(`Error en la línea ${index + 2}: se esperaban 5 columnas.`);
                
                const [date, category, focus, duration, notes] = values;
                const log = { date, category, focus, duration: parseInt(duration, 10), notes };

                if (!/^\d{4}-\d{2}-\d{2}$/.test(log.date) || isNaN(new Date(log.date))) throw new Error(`Error en la línea ${index + 2}: Formato de fecha inválido. Se esperaba YYYY-MM-DD.`);
                if (isNaN(log.duration) || log.duration < 0) throw new Error(`Error en la línea ${index + 2}: La duración debe ser un número positivo.`);
                if (!log.category) throw new Error(`Error en la línea ${index + 2}: La categoría no puede estar vacía.`);
                return log;
            });

            if (confirm('¿Deseas reemplazar todos tus registros actuales con los del archivo? Presiona "Cancelar" para fusionarlos.')) {
                this.practiceLogs = newLogs;
            } else {
                this.practiceLogs.push(...newLogs);
            }

            this.saveLogs();
            alert(`¡Importación exitosa! Se han procesado ${newLogs.length} registros.`);
            return true;

        } catch (error) {
            alert(`Error durante la importación: ${error.message}`);
            return false;
        }
    }
};