# 🎵 Acordiario - Metrónomo Musical Inteligente

Una aplicación web moderna para practicar música con metrónomo integrado, seguimiento de progreso y plan de estudio personalizable.

![Dashboard](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Características Principales

- 🎯 **Dashboard Intuitivo**: Vista general de tu práctica diaria y progreso
- ⏱️ **Metrónomo Avanzado**: Con sonido personalizable y indicador visual
- 📊 **Seguimiento de Progreso**: Gráficas y estadísticas de tu desarrollo musical
- 📅 **Calendario de Práctica**: Visualiza tu consistencia y rachas
- 📚 **Plan de Estudio**: Estructura personalizable de aprendizaje
- 🌙 **Modo Oscuro/Claro**: Interfaz adaptable a tus preferencias
- 🎉 **Efectos Visuales**: Animaciones y confetti para celebrar logros
- 📱 **Responsive Design**: Funciona en desktop, tablet y móvil

## 🚀 Demo en Vivo

[Ver Demo](https://tu-usuario.github.io/acordiario) *(Próximamente)*

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Estilos**: Tailwind CSS
- **Gráficas**: Chart.js
- **Efectos**: Canvas Confetti
- **Audio**: Web Audio API
- **Fuentes**: Google Fonts (Inter, Plus Jakarta Sans)

## 📁 Estructura del Proyecto

```
acordiario/
├── index.html          # Página principal
├── audio/              # Archivos de sonido
│   ├── click.mp3
│   ├── metronome_click.mp3
│   └── success.mp3
├── js/                 # Módulos JavaScript
│   ├── app.js          # Controlador principal
│   ├── audioManager.js # Gestión de audio
│   ├── dataManager.js  # Manejo de datos
│   ├── effects.js      # Efectos visuales
│   ├── metronome.js    # Lógica del metrónomo
│   ├── timerManager.js # Temporizador
│   └── uiManager.js    # Interfaz de usuario
├── .gitignore
└── README.md
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (para desarrollo)

### Ejecución Local

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/acordiario.git
   cd acordiario
   ```

2. **Inicia un servidor local**:
   
   **Opción A - Con Node.js**:
   ```bash
   npx serve . -l 8080
   ```
   
   **Opción B - Con Python**:
   ```bash
   # Python 3
   python -m http.server 8080
   
   # Python 2
   python -m SimpleHTTPServer 8080
   ```

3. **Abre tu navegador** y ve a `http://localhost:8080`

### Despliegue en GitHub Pages

1. Ve a tu repositorio en GitHub
2. Dirígete a **Settings** > **Pages**
3. En **Source**, selecciona **Deploy from a branch**
4. Elige **main** branch y **/ (root)**
5. Haz clic en **Save**

## 📖 Cómo Usar

1. **Dashboard**: Revisa tu práctica del día y metas
2. **Iniciar Sesión**: Usa el timer integrado con metrónomo
3. **Calendario**: Visualiza tu consistencia de práctica
4. **Progreso**: Analiza tus estadísticas y mejoras
5. **Plan de Estudio**: Sigue tu programa personalizado
6. **Ajustes**: Personaliza la aplicación a tu gusto

## 🎯 Funcionalidades Detalladas

### Metrónomo
- BPM ajustable (40-200)
- Sonido activable/desactivable
- Indicador visual sincronizado
- Integración con timer de práctica

### Sistema de Progreso
- Seguimiento de tiempo de práctica
- Cálculo de rachas diarias
- Metas configurables
- Gráficas de progreso semanal/mensual

### Plan de Estudio
- Categorías organizadas (Técnica, Repertorio, Teoría, etc.)
- Tareas diarias automáticas
- Progreso por categoría
- Estructura accordion expandible

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Roadmap

- [ ] Sistema de usuarios y autenticación
- [ ] Sincronización en la nube
- [ ] Exportación de datos
- [ ] Más tipos de metrónomo (compases complejos)
- [ ] Integración con servicios musicales
- [ ] Modo offline (PWA)

## 🐛 Reportar Bugs

Si encuentras algún error, por favor [abre un issue](https://github.com/tu-usuario/acordiario/issues) con:
- Descripción del problema
- Pasos para reproducirlo
- Navegador y versión
- Screenshots si es necesario

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: tu-email@ejemplo.com

## 🙏 Agradecimientos

- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Chart.js](https://www.chartjs.org/) - Librería de gráficas
- [Canvas Confetti](https://github.com/catdad/canvas-confetti) - Efectos de confetti
- [Google Fonts](https://fonts.google.com/) - Tipografías

---

⭐ **¡Si te gusta este proyecto, dale una estrella!** ⭐