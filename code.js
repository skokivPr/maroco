// --- DOM Elements ---
const elements = {
    previewIframe: document.getElementById('preview-iframe'),
    fileStatus: document.getElementById('file-status'),
    editorStatus: document.getElementById('editor-status'),
    themeBtn: document.getElementById('theme-btn'),
    modal: {
        container: document.getElementById('modal-container'),
        title: document.getElementById('modal-title'),
        body: document.getElementById('modal-body'),
        actions: document.getElementById('modal-actions'),
        confirmBtn: document.getElementById('modal-confirm-btn'),
        cancelBtn: document.getElementById('modal-cancel-btn'),
    }
};

// --- State ---
let currentTab = 'html';
let autoSaveInterval;
let editors = {}; // To hold Monaco instances

// --- Editor Settings ---
let editorSettings = {
    fontSize: 15,
    fontFamily: '"JetBrains Mono", monospace',
    wordWrap: 'on',
    minimap: true,
    lineNumbers: 'on',
    autoClosingBrackets: 'always',
    autoClosingQuotes: 'always',
    tabSize: 4,
    insertSpaces: true,
    renderWhitespace: 'none',
    cursorStyle: 'line',
    scrollBeyondLastLine: true,
    smoothScrolling: false,
    mouseWheelZoom: false
};

// Kolorowe nawiasy - zawsze włączone (nie można wyłączyć)
const bracketSettings = {
    bracketPairColorization: true,
    matchingBrackets: 'always',
    coloredBrackets: true
};

// --- Default Content ---
const defaultContent = {
    html: `<h1>Witaj w Code Editor!</h1>
<p>Zacznij pisać swój kod HTML, CSS i JavaScript.</p>
<button onclick="sayHello()">Kliknij mnie!</button>`,
    css: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}

h1 {
    color: #fff;
    margin-bottom: 20px;
}

p {
    font-size: 18px;
    line-height: 1.6;
    margin-bottom: 30px;
}

button {
    padding: 12px 24px;
    background: #ff7300;
    color: white;
    border: none;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s ease;
}

button:hover {
    background: #e65c00;
}`,
    js: `function sayHello() {
    // Używamy niestandardowego modala zamiast alert()
    const modal = window.parent.document.getElementById('modal-container');
    if (modal) {
        window.parent.showAlertModal('Sukces!', 'Witaj! Twój kod JavaScript działa! 🎉');
    } else {
        alert('Witaj! Twój kod JavaScript działa! 🎉');
    }
    
    // Przykład zagnieżdżonych nawiasów - sprawdź kolorowe nawiasy!
    const colors = ['red', 'blue', 'green'];
    const result = colors.map((color) => {
        return {
            name: color,
            rgb: getRgbValue(color),
            styles: {
                background: \`linear-gradient(135deg, \${color} 0%, #333 100%)\`,
                transform: 'scale(1.1)'
            }
        };
    });
    
    document.body.style.background = 'linear-gradient(135deg, #ff7300 0%, #e65c00 100%)';
    const h1 = document.querySelector('h1');
    h1.style.transform = 'scale(1.1)';
    h1.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
        h1.style.transform = 'scale(1)';
    }, 300);
}

function getRgbValue(color) {
    const colorMap = {
        'red': [255, 0, 0],
        'blue': [0, 0, 255], 
        'green': [0, 255, 0]
    };
    return colorMap[color] || [0, 0, 0];
}

console.log('Strona załadowana! Sprawdź kolorowe nawiasy w edytorze!');`
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initializeEditors();
    setupEventListeners();
    loadTheme();
    loadSettings();
});

function initializeEditors() {
    console.log('Initializing Monaco Editor...');

    // Check if Monaco is already loaded
    if (window.monaco) {
        console.log('Monaco already loaded, creating editors...');
        createEditors();
        return;
    }

    require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.49.0/min/vs' } });
    require(['vs/editor/editor.main'], () => {
        console.log('Monaco Editor loaded successfully');
        createEditors();
    }, (error) => {
        console.error('Failed to load Monaco Editor:', error);
        showNotification('Błąd ładowania edytora. Sprawdź połączenie internetowe.', 'error');
    });
}

function createEditors() {
    try {
        console.log('Creating editors...');

        const sharedEditorOptions = getEditorOptions();

        editors.html = monaco.editor.create(document.getElementById('html-editor'), {
            ...sharedEditorOptions,
            value: defaultContent.html,
            language: 'html',
        });

        editors.css = monaco.editor.create(document.getElementById('css-editor'), {
            ...sharedEditorOptions,
            value: defaultContent.css,
            language: 'css',
        });

        editors.js = monaco.editor.create(document.getElementById('js-editor'), {
            ...sharedEditorOptions,
            value: defaultContent.js,
            language: 'javascript',
        });

        // Set theme after creation
        const savedTheme = localStorage.getItem('codeEditorTheme') || 'light';
        const monacoTheme = savedTheme === 'dark' ? 'vs-dark' : 'vs';
        monaco.editor.setTheme(monacoTheme);

        console.log('Editors created successfully');

        loadInitialContent(); // Load from localStorage after editors are ready
        updatePreview();
        setupAutoSave();
        configureBracketColors(); // Configure bracket colors after editors are ready

        Object.values(editors).forEach(editor => {
            editor.onDidChangeModelContent(() => {
                updatePreview();
            });
        });

        showNotification('Edytor załadowany pomyślnie!', 'success');

    } catch (error) {
        console.error('Error creating editors:', error);
        showNotification('Błąd tworzenia edytorów: ' + error.message, 'error');
    }
}

function loadInitialContent() {
    const autoSaved = localStorage.getItem('autoSavedProject');
    if (autoSaved) {
        const project = JSON.parse(autoSaved);
        editors.html.setValue(project.html);
        editors.css.setValue(project.css);
        editors.js.setValue(project.js);
        updateStatus('Załadowano auto-zapisaną sesję');
    }
}

// --- Event Listeners ---
function setupEventListeners() {
    document.querySelectorAll('.editor-tab').forEach(tab => {
        tab.addEventListener('click', (e) => switchTab(e.currentTarget.dataset.tab, e.currentTarget));
    });

    document.getElementById('new-btn').addEventListener('click', newProject);
    document.getElementById('save-btn').addEventListener('click', saveProject);
    document.getElementById('load-btn').addEventListener('click', loadProject);
    document.getElementById('download-btn').addEventListener('click', downloadProject);
    elements.themeBtn.addEventListener('click', toggleTheme);

    document.getElementById('run-btn').addEventListener('click', runCode);
    document.getElementById('format-btn').addEventListener('click', formatCode);
    document.getElementById('clear-btn').addEventListener('click', clearCode);
    document.getElementById('snippet-btn').addEventListener('click', insertSnippet);
    document.getElementById('shortcuts-btn').addEventListener('click', showShortcuts);
    document.getElementById('settings-btn').addEventListener('click', showSettings);

    document.getElementById('refresh-btn').addEventListener('click', refreshPreview);
    document.getElementById('new-window-btn').addEventListener('click', openInNewWindow);

    elements.modal.cancelBtn.addEventListener('click', closeModal);
    elements.modal.container.addEventListener('click', (e) => {
        if (e.target === elements.modal.container) closeModal();
    });

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey) {
            switch (e.key) {
                case 's': e.preventDefault(); saveProject(); break;
                case 'n': e.preventDefault(); newProject(); break;
                case 'o': e.preventDefault(); loadProject(); break;
                case 'Enter': e.preventDefault(); runCode(); break;
            }
        }
        // Close any open modal with Escape
        if (e.key === 'Escape' && elements.modal.container.classList.contains('visible')) {
            e.preventDefault();
            closeModal();
        }
    });
}

// --- Core Functions ---

function switchTab(tab, tabElement) {
    currentTab = tab;
    document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
    tabElement.classList.add('active');

    document.querySelectorAll('.editor-content').forEach(c => c.classList.remove('active'));
    document.getElementById(tab + '-editor').classList.add('active');

    updateStatus(`Przełączono na ${tab.toUpperCase()}`);
}

function updatePreview() {
    const fullHtml = `
                <!DOCTYPE html>
                <html lang="pl">
                <head>
                    <meta charset="UTF-8">
                    <style>${editors.css.getValue()}</style>
                </head>
                <body>
                    ${editors.html.getValue()}
                    <script>
                        try {
                            // Provide access to parent's modal functions
                            window.parent.showAlertModal = window.parent.showAlertModal || alert;
                            ${editors.js.getValue()}
                        } catch(e) {
                            console.error("JavaScript Error:", e);
                        }
                    <\/script>
                </body>
                </html>
            `;
    elements.previewIframe.srcdoc = fullHtml;
    updateStatus('Podgląd zaktualizowany', 1500);
}

function runCode() {
    updatePreview();
    showNotification('Kod uruchomiony!', 'success');
}

// --- Project Management ---

function newProject() {
    showConfirmModal('Nowy Projekt', 'Czy na pewno chcesz utworzyć nowy projekt?', () => {
        editors.html.setValue(defaultContent.html.replace("Witaj w Code Editor!", "Nowy Projekt"));
        editors.css.setValue(defaultContent.css);
        editors.js.setValue('console.log("Nowy projekt utworzony!");');
        updatePreview();
        showNotification('Nowy projekt utworzony!', 'success');
    });
}

function saveProject() {
    showSaveProjectModal();
}

function showSaveProjectModal() {
    const modalHTML = `
        <div class="command-center-grid save-project-grid">
            <!-- Project Info Panel -->
            <div class="panel">
                <div class="panel-header">PROJECT INFO</div>
                <div class="panel-content project-info-content">
                    <div class="info-card project-info-card">
                        <div class="card-header">
                            <span>NAME</span>
                            <span class="card-status">REQUIRED</span>
                        </div>
                        <input type="text" id="project-name" placeholder="My Awesome Project" class="modal-input">
                    </div>
                    
                    <div class="info-card project-info-card">
                        <div class="card-header">
                            <span>CATEGORY</span>
                            <span class="card-status">TYPE</span>
                        </div>
                        <select id="project-category" class="modal-input">
                            <option value=""><i class="fas fa-tag"></i> Select Category</option>
                            <option value="Website"><i class="fas fa-globe"></i> Website</option>
                            <option value="Component"><i class="fas fa-puzzle-piece"></i> Component</option>
                            <option value="Experiment"><i class="fas fa-flask"></i> Experiment</option>
                            <option value="Tutorial"><i class="fas fa-book"></i> Tutorial</option>
                            <option value="Game"><i class="fas fa-gamepad"></i> Game</option>
                            <option value="Tool"><i class="fas fa-wrench"></i> Tool</option>
                            <option value="Portfolio"><i class="fas fa-briefcase"></i> Portfolio</option>
                            <option value="Landing"><i class="fas fa-rocket"></i> Landing Page</option>
                        </select>
                    </div>
                    
                    <div class="info-card project-description-card">
                        <div class="card-header">
                            <span>TAGS</span>
                            <span class="card-status">KEYWORDS</span>
                        </div>
                        <input type="text" id="project-tags" placeholder="html, css, javascript, responsive, modern" class="modal-input">
                    </div>
                </div>
            </div>

            <!-- Project Details Panel -->
            <div class="panel">
                <div class="panel-header">DESCRIPTION</div>
                <div class="panel-content project-description-content">
                    <div class="info-card project-description-card">
                        <div class="card-header">
                            <span>PROJECT NOTES</span>
                            <span class="card-status">OPTIONAL</span>
                        </div>
                        <textarea id="project-description" placeholder="Describe your project...

What does it do?
What technologies are used?
Any special features or notes?

Example:
A modern responsive website with dark mode support, animated transitions, and mobile-first design. Built with vanilla JavaScript and CSS Grid." rows="12" class="modal-textarea"></textarea>
                    </div>
                </div>
            </div>

            <!-- Project Stats Panel -->
            <div class="panel">
                <div class="panel-header">CODE STATS</div>
                <div class="panel-content">
                    <div class="info-card">
                        <div class="card-header">
                            <span>HTML</span>
                            <span class="card-status active" id="html-size">0 B</span>
                        </div>
                        <div class="card-body">
                            <div class="card-icon"><i class="fab fa-html5"></i></div>
                            <div class="card-title-section">
                                <div class="card-title" id="html-lines">0</div>
                                <div class="card-subtitle">Lines of markup</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card">
                        <div class="card-header">
                            <span>CSS</span>
                            <span class="card-status active" id="css-size">0 B</span>
                        </div>
                        <div class="card-body">
                            <div class="card-icon"><i class="fab fa-css3-alt"></i></div>
                            <div class="card-title-section">
                                <div class="card-title" id="css-lines">0</div>
                                <div class="card-subtitle">Lines of styles</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card">
                        <div class="card-header">
                            <span>JAVASCRIPT</span>
                            <span class="card-status active" id="js-size">0 B</span>
                        </div>
                        <div class="card-body">
                            <div class="card-icon"><i class="fab fa-js-square"></i></div>
                            <div class="card-title-section">
                                <div class="card-title" id="js-lines">0</div>
                                <div class="card-subtitle">Lines of code</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card card-accent">
                        <div class="card-header">
                            <span>TOTAL SIZE</span>
                            <span class="card-status" id="total-size">0 B</span>
                        </div>
                        <div class="card-body">
                            <div class="card-icon"><i class="fas fa-hdd"></i></div>
                            <div class="card-title-section">
                                <div class="card-title" id="total-lines">0</div>
                                <div class="card-subtitle">Total lines</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions Panel -->
            <div class="panel">
                <div class="panel-header">ACTIONS</div>
                <div class="panel-content">
                    <div class="info-card action-card" onclick="closeModal()">
                        <div class="card-header">
                            <span>CANCEL</span>
                            <span class="card-status">ESC</span>
                        </div>
                        <div class="card-body">
                            <div class="card-icon"><i class="fas fa-times"></i></div>
                            <div class="card-title-section">
                                <div class="card-title">Cancel</div>
                                <div class="card-subtitle">Discard changes</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card card-accent action-card" onclick="confirmSaveProject()">
                        <div class="card-header">
                            <span>SAVE PROJECT</span>
                            <span class="card-status">CTRL+S</span>
                        </div>
                        <div class="card-body">
                            <div class="card-icon"><i class="fas fa-save"></i></div>
                            <div class="card-title-section">
                                <div class="card-title">Save</div>
                                <div class="card-subtitle">Store in browser</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card action-card" onclick="previewCurrentProject()">
                        <div class="card-header">
                            <span>PREVIEW</span>
                            <span class="card-status">F5</span>
                        </div>
                        <div class="card-body">
                            <div class="card-icon"><i class="fas fa-eye"></i></div>
                            <div class="card-title-section">
                                <div class="card-title">Test</div>
                                <div class="card-subtitle">Run preview</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card action-card" onclick="exportCurrentProject()">
                        <div class="card-header">
                            <span>EXPORT HTML</span>
                            <span class="card-status">FILE</span>
                        </div>
                        <div class="card-body">
                            <div class="card-icon"><i class="fas fa-download"></i></div>
                            <div class="card-title-section">
                                <div class="card-title">Download</div>
                                <div class="card-subtitle">Save as file</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    showCustomModal('SAVE PROJECT', modalHTML, () => {
        updateProjectStats();
        document.getElementById('project-name').focus();
    });
}

function updateProjectStats() {
    const htmlCode = editors.html.getValue();
    const cssCode = editors.css.getValue();
    const jsCode = editors.js.getValue();

    const htmlLines = htmlCode.split('\n').length;
    const cssLines = cssCode.split('\n').length;
    const jsLines = jsCode.split('\n').length;
    const totalLines = htmlLines + cssLines + jsLines;

    const htmlSize = new Blob([htmlCode]).size;
    const cssSize = new Blob([cssCode]).size;
    const jsSize = new Blob([jsCode]).size;
    const totalSize = htmlSize + cssSize + jsSize;

    document.getElementById('html-lines').textContent = htmlLines;
    document.getElementById('css-lines').textContent = cssLines;
    document.getElementById('js-lines').textContent = jsLines;
    document.getElementById('total-lines').textContent = totalLines;

    document.getElementById('html-size').textContent = formatBytes(htmlSize);
    document.getElementById('css-size').textContent = formatBytes(cssSize);
    document.getElementById('js-size').textContent = formatBytes(jsSize);
    document.getElementById('total-size').textContent = formatBytes(totalSize);
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function previewCurrentProject() {
    updatePreview();
    showNotification('Preview updated!', 'success');
}

function exportCurrentProject() {
    downloadProject();
    showNotification('Project exported!', 'success');
}

function confirmSaveProject() {
    const name = document.getElementById('project-name').value.trim();
    const category = document.getElementById('project-category').value;
    const tagsInput = document.getElementById('project-tags').value.trim();
    const description = document.getElementById('project-description').value.trim();

    if (!name) {
        showNotification('Podaj nazwę projektu!', 'warning');
        return;
    }

    const htmlCode = editors.html.getValue();
    const cssCode = editors.css.getValue();
    const jsCode = editors.js.getValue();

    // Walidacja - sprawdź czy projekt ma jakąkolwiek treść
    if (!htmlCode.trim() && !cssCode.trim() && !jsCode.trim()) {
        showNotification('Projekt jest pusty! Dodaj trochę kodu przed zapisaniem.', 'warning');
        return;
    }

    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    // Generuj unikalny ID projektu
    const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const project = {
        id: projectId,
        name: name,
        html: htmlCode,
        css: cssCode,
        js: jsCode,
        category: category || 'Inne',
        tags: tags,
        description: description,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: '1.0'
    };

    try {
        const projects = JSON.parse(localStorage.getItem('savedProjects') || '[]');

        // Sprawdź czy nazwa już istnieje
        const existingProject = projects.find(p => p.name === name);
        if (existingProject) {
            if (!confirm(`Projekt o nazwie "${name}" już istnieje. Czy chcesz go zastąpić?`)) {
                return;
            }
            // Usuń stary projekt
            const index = projects.findIndex(p => p.name === name);
            projects.splice(index, 1);
        }

        projects.push(project);
        localStorage.setItem('savedProjects', JSON.stringify(projects));
        closeModal();
        showNotification(`Projekt "${project.name}" zapisany pomyślnie!`, 'success');
    } catch (error) {
        console.error('Błąd podczas zapisywania projektu:', error);
        showNotification('Błąd podczas zapisywania projektu!', 'warning');
    }
}

function loadProject() {
    const projects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
    if (projects.length === 0) return showNotification('Brak zapisanych projektów!', 'warning');

    showProjectCatalog();
}

function showProjectCatalog() {
    const projects = JSON.parse(localStorage.getItem('savedProjects') || '[]');

    if (projects.length === 0) {
        showEmptyProjectsModal();
        return;
    }

    // Sortuj projekty według daty modyfikacji (najnowsze pierwsze)
    const sortedProjects = projects.sort((a, b) => {
        const dateA = new Date(a.lastModified || a.created);
        const dateB = new Date(b.lastModified || b.created);
        return dateB - dateA;
    });

    const projectsPerPage = 8;
    const totalPages = Math.ceil(sortedProjects.length / projectsPerPage);
    let currentPage = 0;

    const generateProjectGrid = (pageProjects) => {
        return pageProjects.map((project, index) => {
            const originalIndex = projects.findIndex(p => p.id === project.id || p.name === project.name);
            const createdDate = new Date(project.created).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });

            const categoryIcons = {
                'Website': '<i class="fas fa-globe"></i>',
                'Component': '<i class="fas fa-puzzle-piece"></i>',
                'Experiment': '<i class="fas fa-flask"></i>',
                'Tutorial': '<i class="fas fa-book"></i>',
                'Game': '<i class="fas fa-gamepad"></i>',
                'Tool': '<i class="fas fa-wrench"></i>',
                'Portfolio': '<i class="fas fa-briefcase"></i>',
                'Landing': '<i class="fas fa-rocket"></i>'
            };

            const totalLines = (project.html.split('\n').length +
                project.css.split('\n').length +
                project.js.split('\n').length);

            const totalSize = new Blob([project.html + project.css + project.js]).size;

            return `
                <div class="info-card project-card-clickable" onclick="loadProjectByIndex(${originalIndex})" data-project-name="${project.name.toLowerCase()}" data-project-category="${(project.category || '').toLowerCase()}">
                    <div class="card-header">
                        <span>${project.category || 'PROJECT'}</span>
                        <span class="card-status active">${formatBytes(totalSize)}</span>
                    </div>
                    <div class="card-body">
                        <div class="card-icon">${categoryIcons[project.category] || '<i class="fas fa-folder"></i>'}</div>
                        <div class="card-title-section">
                            <div class="card-title">${project.name}</div>
                            <div class="card-subtitle">${totalLines} lines • ${createdDate}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    };

    const catalogHTML = `
        <div class="catalog-grid">
            <!-- Search Panel -->
            <div class="panel">
                <div class="panel-header">SEARCH & FILTER</div>
                <div class="panel-content search-filter-content">
                    <div class="info-card filter-card">
                        <div class="card-header">
                            <span>SEARCH</span>
                            <span class="card-status">LIVE</span>
                        </div>
                        <input type="text" id="project-search" placeholder="Search projects..." class="modal-input" onkeyup="filterProjectsGrid()">
                    </div>
                    
                    <div class="info-card filter-card">
                        <div class="card-header">
                            <span>CATEGORY</span>
                            <span class="card-status">FILTER</span>
                        </div>
                        <select id="category-filter" onchange="filterProjectsGrid()" class="modal-input">
                            <option value=""><i class="fas fa-folder"></i> All Categories</option>
                            <option value="Website"><i class="fas fa-globe"></i> Website</option>
                            <option value="Component"><i class="fas fa-puzzle-piece"></i> Component</option>
                            <option value="Experiment"><i class="fas fa-flask"></i> Experiment</option>
                            <option value="Tutorial"><i class="fas fa-book"></i> Tutorial</option>
                            <option value="Game"><i class="fas fa-gamepad"></i> Game</option>
                            <option value="Tool"><i class="fas fa-wrench"></i> Tool</option>
                            <option value="Portfolio"><i class="fas fa-briefcase"></i> Portfolio</option>
                            <option value="Landing"><i class="fas fa-rocket"></i> Landing Page</option>
                        </select>
                    </div>
                    
                    <div class="info-card card-accent stats-card">
                        <div class="card-header">
                            <span>TOTAL</span>
                            <span class="card-status">${projects.length}</span>
                        </div>
                        <div class="card-body">
                            <div class="card-icon"><i class="fas fa-chart-bar"></i></div>
                            <div class="card-title-section">
                                <div class="card-title">${projects.length}</div>
                                <div class="card-subtitle">Projects stored</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Header Info -->
            <div class="panel catalog-header-panel">
                <div class="panel-header">PROJECT LIBRARY</div>
                <div class="panel-content catalog-header-content">
                    <div class="info-card catalog-welcome-card">
                        <div class="card-header">
                            <span>BROWSE YOUR PROJECTS</span>
                        </div>
                        <div class="card-body catalog-welcome-body">
                            <div class="card-icon catalog-welcome-icon"><i class="fas fa-archive"></i></div>
                            <div class="card-title-section">
                                <div class="card-title">Click any project to load it</div>
                                <div class="card-subtitle">Use search and filters to find specific projects</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions Panel -->
            <div class="panel">
                <div class="panel-header">ACTIONS</div>
                <div class="panel-content">
                    <div class="info-card action-card" onclick="importProjects()">
                        <div class="card-header">
                            <span>IMPORT</span>
                            <span class="card-status">JSON</span>
                        </div>
                        <div class="card-body">
                            <div class="card-icon"><i class="fas fa-file-import"></i></div>
                            <div class="card-title-section">
                                <div class="card-title">Import</div>
                                <div class="card-subtitle">Load backup</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card action-card" onclick="exportProjects()">
                        <div class="card-header">
                            <span>EXPORT</span>
                            <span class="card-status">${projects.length}</span>
                        </div>
                        <div class="card-body">
                            <div class="card-icon"><i class="fas fa-file-export"></i></div>
                            <div class="card-title-section">
                                <div class="card-title">Backup</div>
                                <div class="card-subtitle">Save all</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card action-card" onclick="sortProjectsGrid('name')">
                        <div class="card-header">
                            <span>SORT A-Z</span>
                            <span class="card-status">NAME</span>
                        </div>
                        <div class="card-body">
                            <div class="card-icon"><i class="fas fa-sort-alpha-down"></i></div>
                            <div class="card-title-section">
                                <div class="card-title">Sort</div>
                                <div class="card-subtitle">By name</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card danger-action-card" onclick="clearAllProjects()">
                        <div class="card-header">
                            <span>DELETE ALL</span>
                            <span class="card-status"><i class="fas fa-exclamation-triangle"></i></span>
                        </div>
                        <div class="card-body">
                            <div class="card-icon"><i class="fas fa-trash-alt"></i></div>
                            <div class="card-title-section">
                                <div class="card-title">Clear</div>
                                <div class="card-subtitle">Remove all</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Projects Grid Panel - spans 2 columns and full height -->
            <div class="panel projects-grid-panel">
                <div class="panel-header">YOUR PROJECTS (${projects.length})</div>
                <div class="panel-content projects-grid-content" id="projects-grid">
                    ${generateProjectGrid(sortedProjects)}
                </div>
            </div>
        </div>
    `;

    showCustomModal('PROJECT CATALOG', catalogHTML, () => {
        // Store projects data for filtering
        window.currentProjects = sortedProjects;
        window.allProjects = projects;
    });
}

function showEmptyProjectsModal() {
    const emptyHTML = `
        <div class="command-center-grid empty-projects-grid">
            <!-- Empty State Info -->
            <div class="panel empty-state-panel">
                <div class="panel-header">PROJECT CATALOG</div>
                <div class="panel-content empty-state-content">
                    <div class="info-card card-accent empty-state-card">
                        <div class="card-header">
                            <span>NO PROJECTS</span>
                            <span class="card-status">0</span>
                        </div>
                        <div class="card-body empty-state-body">
                            <div class="card-icon empty-state-icon"><i class="fas fa-folder-open"></i></div>
                            <div class="card-title-section">
                                <div class="card-title empty-state-title">No Projects Found</div>
                                <div class="card-subtitle empty-state-subtitle">
                                    Your project library is empty.<br>
                                    Create your first project by writing some code and clicking the <strong>Save</strong> button in the main interface.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Start Guide -->
            <div class="panel quick-start-panel">
                <div class="panel-header">QUICK START GUIDE</div>
                <div class="panel-content">
                    <div class="info-card">
                        <div class="card-header">
                            <span>STEP 1</span>
                            <span class="card-status">CODE</span>
                        </div>
                        <div class="card-body">
                            <div class="card-icon"><i class="fas fa-code"></i></div>
                            <div class="card-title-section">
                                <div class="card-title">Write Code</div>
                                <div class="card-subtitle">Create HTML, CSS, or JavaScript</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card">
                        <div class="card-header">
                            <span>STEP 2</span>
                            <span class="card-status">SAVE</span>
                        </div>
                        <div class="card-body">
                            <div class="card-icon"><i class="fas fa-save"></i></div>
                            <div class="card-title-section">
                                <div class="card-title">Save Project</div>
                                <div class="card-subtitle">Click Save button or Ctrl+S</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card">
                        <div class="card-header">
                            <span>STEP 3</span>
                            <span class="card-status">MANAGE</span>
                        </div>
                        <div class="card-body">
                            <div class="card-icon"><i class="fas fa-folder"></i></div>
                            <div class="card-title-section">
                                <div class="card-title">Browse Projects</div>
                                <div class="card-subtitle">View and load saved projects</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card action-card" onclick="closeModal()">
                        <div class="card-header">
                            <span>START</span>
                            <span class="card-status">NOW</span>
                        </div>
                        <div class="card-body">
                            <div class="card-icon"><i class="fas fa-rocket"></i></div>
                            <div class="card-title-section">
                                <div class="card-title">Begin Coding</div>
                                <div class="card-subtitle">Close and start creating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    showCustomModal('PROJECT CATALOG', emptyHTML);
}

function filterProjectsGrid() {
    const searchTerm = document.getElementById('project-search')?.value.toLowerCase() || '';
    const selectedCategory = document.getElementById('category-filter')?.value || '';

    if (!window.currentProjects) return;

    const filteredProjects = window.currentProjects.filter(project => {
        const matchesSearch = !searchTerm ||
            project.name.toLowerCase().includes(searchTerm) ||
            (project.description && project.description.toLowerCase().includes(searchTerm)) ||
            (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchTerm)));

        const matchesCategory = !selectedCategory || project.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Regenerate grid
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
        const projectsHTML = filteredProjects.map((project, index) => {
            const originalIndex = window.allProjects.findIndex(p => p.id === project.id || p.name === project.name);
            const createdDate = new Date(project.created).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });

            const categoryIcons = {
                'Website': '<i class="fas fa-globe"></i>',
                'Component': '<i class="fas fa-puzzle-piece"></i>',
                'Experiment': '<i class="fas fa-flask"></i>',
                'Tutorial': '<i class="fas fa-book"></i>',
                'Game': '<i class="fas fa-gamepad"></i>',
                'Tool': '<i class="fas fa-wrench"></i>',
                'Portfolio': '<i class="fas fa-briefcase"></i>',
                'Landing': '<i class="fas fa-rocket"></i>'
            };

            const totalLines = (project.html.split('\n').length +
                project.css.split('\n').length +
                project.js.split('\n').length);

            const totalSize = new Blob([project.html + project.css + project.js]).size;

            return `
                <div class="info-card project-card-clickable" onclick="loadProjectByIndex(${originalIndex})">
                    <div class="card-header">
                        <span>${project.category || 'PROJECT'}</span>
                        <span class="card-status active">${formatBytes(totalSize)}</span>
                    </div>
                    <div class="card-body">
                        <div class="card-icon">${categoryIcons[project.category] || '<i class="fas fa-folder"></i>'}</div>
                        <div class="card-title-section">
                            <div class="card-title">${project.name}</div>
                            <div class="card-subtitle">${totalLines} lines • ${createdDate}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        projectsGrid.innerHTML = projectsHTML || `
            <div class="info-card no-results-card">
                <div class="card-header">
                    <span>NO RESULTS</span>
                </div>
                <div class="card-body">
                    <div class="card-icon"><i class="fas fa-search"></i></div>
                    <div class="card-title-section">
                        <div class="card-title">No matches found</div>
                        <div class="card-subtitle">Try different search terms</div>
                    </div>
                </div>
            </div>
        `;
    }
}

function sortProjectsGrid(type) {
    if (!window.currentProjects) return;

    if (type === 'name') {
        window.currentProjects.sort((a, b) => a.name.localeCompare(b.name));
    } else {
        window.currentProjects.sort((a, b) => new Date(b.created) - new Date(a.created));
    }

    filterProjectsGrid(); // Refresh display
    showNotification(`Projects sorted by ${type === 'name' ? 'name' : 'date'}!`, 'info');
}

function downloadProject() {
    const fullHtml = elements.previewIframe.srcdoc;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projekt.html';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Projekt pobrany!', 'success');
}

// --- Editor Features ---

async function formatCode() {
    await editors[currentTab].getAction('editor.action.formatDocument').run();
    showNotification('Kod sformatowany!', 'success');
}

function clearCode() {
    showConfirmModal('Wyczyść Edytor', `Czy na pewno chcesz wyczyścić edytor ${currentTab.toUpperCase()}?`, () => {
        editors[currentTab].setValue('');
        updatePreview();
        showNotification('Kod wyczyszczony!', 'info');
    }, 'Wyczyść', 'btn-danger');
}

function insertSnippet() {
    // Sprawdź czy snippet.js jest załadowany
    if (!window.codeSnippets) {
        showNotification('Błąd: Biblioteka snippetów nie jest załadowana!', 'warning');
        return;
    }

    const snippets = window.codeSnippets;

    const modalContent = `
        <div class="snippets-grid">
            <div class="snippets-sidebar">
                <div class="snippets-header">Kategorie</div>
                <button class="snippet-button snippet-category" data-category="html">
                    <i class="fab fa-html5 snippet-category-icon"></i> HTML
                </button>
                <button class="snippet-button snippet-category" data-category="css">
                    <i class="fab fa-css3-alt snippet-category-icon"></i> CSS
                </button>
                <button class="snippet-button snippet-category" data-category="js">
                    <i class="fab fa-js snippet-category-icon"></i> JavaScript
                </button>
            </div>
            <div class="snippets-content">
                <div class="snippets-header" id="snippets-header-title">${currentTab.toUpperCase()} Snippets</div>
                <div id="snippet-list" class="snippet-list"></div>
            </div>
        </div>`;

    showCustomModal('Code Snippets', modalContent, () => {
        const modalBody = elements.modal.body;
        const headerTitle = modalBody.querySelector('#snippets-header-title');
        const listEl = modalBody.querySelector('#snippet-list');

        function render(category) {
            modalBody.querySelectorAll('.snippet-category').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.category === category);
            });
            headerTitle.textContent = `${category.toUpperCase()} Snippets`;
            const items = (category === 'html' ? snippets.html : category === 'css' ? snippets.css : snippets.js) || [];

            // Funkcja do escape'owania HTML
            const escapeHtml = (text) => {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            };

            listEl.innerHTML = items.map((snip, idx) => {
                const codePreview = snip.code.substring(0, 100) + (snip.code.length > 100 ? '...' : '');
                return `
                    <div class="snippet-item" data-index="${idx}" data-category="${category}">
                        <div class="snippet-title">${snip.name}</div>
                        <div class="snippet-description">${snip.description || 'Kliknij, aby wstawić do edytora'}</div>
                        <pre class="snippet-code">${escapeHtml(codePreview)}</pre>
                    </div>
                `;
            }).join('');
        }

        modalBody.addEventListener('click', (e) => {
            const categoryBtn = e.target.closest('.snippet-category');
            if (categoryBtn) {
                render(categoryBtn.dataset.category);
                return;
            }
            const item = e.target.closest('.snippet-item');
            if (item) {
                const idx = parseInt(item.dataset.index, 10);
                const cat = item.dataset.category;
                insertSnippetCode(idx, cat);
            }
        });

        render(currentTab);
        const activeBtn = modalBody.querySelector(`.snippet-category[data-category="${currentTab}"]`);
        if (activeBtn) activeBtn.focus();
    }, 'snippets-modal');
}

function insertSnippetCode(index, category) {
    // Sprawdź czy snippet.js jest załadowany
    if (!window.codeSnippets) {
        showNotification('Błąd: Biblioteka snippetów nie jest załadowana!', 'warning');
        return;
    }

    const snippets = window.codeSnippets;

    const snippet = snippets[category][index];
    if (editors[category]) {
        const editor = editors[category];
        const selection = editor.getSelection();
        const id = { major: 1, minor: 1 };
        const op = { identifier: id, range: selection, text: snippet.code, forceMoveMarkers: true };
        editor.executeEdits("snippet-insert", [op]);
        editor.focus();
        closeModal();
        showNotification(`Snippet "${snippet.name}" dodany!`, 'success');
    }
}

function showShortcuts() {
    const shortcutsHTML = `
        <div class="shortcuts-grid">
            <div class="shortcuts-section">
                <div class="shortcuts-section-header"><i class="fas fa-keyboard"></i> Edytor</div>
                <div class="shortcuts-list">
                    <div class="shortcut-item">
                        <span class="shortcut-description">Zapisz projekt</span>
                        <div class="shortcut-keys">
                            <span class="shortcut-key">Ctrl</span>
                            <span class="shortcut-key">S</span>
                        </div>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-description">Formatuj kod</span>
                        <div class="shortcut-keys">
                            <span class="shortcut-key">Shift</span>
                            <span class="shortcut-key">Alt</span>
                            <span class="shortcut-key">F</span>
                        </div>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-description">Komentarz</span>
                        <div class="shortcut-keys">
                            <span class="shortcut-key">Ctrl</span>
                            <span class="shortcut-key">/</span>
                        </div>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-description">Znajdź</span>
                        <div class="shortcut-keys">
                            <span class="shortcut-key">Ctrl</span>
                            <span class="shortcut-key">F</span>
                        </div>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-description">Cofnij / Ponów</span>
                        <div class="shortcut-keys">
                            <span class="shortcut-key">Ctrl</span>
                            <span class="shortcut-key">Z</span>
                            <span class="shortcut-key">/</span>
                            <span class="shortcut-key">Y</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="shortcuts-section">
                <div class="shortcuts-section-header"><i class="fas fa-window-maximize"></i> Aplikacja</div>
                <div class="shortcuts-list">
                    <div class="shortcut-item">
                        <span class="shortcut-description">Snippety</span>
                        <div class="shortcut-keys">
                            <span class="shortcut-key">Ctrl</span>
                            <span class="shortcut-key">Space</span>
                        </div>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-description">Skróty</span>
                        <div class="shortcut-keys">
                            <span class="shortcut-key">F1</span>
                        </div>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-description">Pełny ekran</span>
                        <div class="shortcut-keys">
                            <span class="shortcut-key">F11</span>
                        </div>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-description">Odśwież podgląd</span>
                        <div class="shortcut-keys">
                            <span class="shortcut-key">F5</span>
                        </div>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-description">Tryb ciemny</span>
                        <div class="shortcut-keys">
                            <span class="shortcut-key">Ctrl</span>
                            <span class="shortcut-key">T</span>
                        </div>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-description">Zamknij modal</span>
                        <div class="shortcut-keys">
                            <span class="shortcut-key">Escape</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    showCustomModal('Keyboard Shortcuts', shortcutsHTML, null, 'shortcuts-modal');
}

// --- Settings Functions ---

function loadSettings() {
    const savedSettings = localStorage.getItem('codeEditorSettings');
    if (savedSettings) {
        try {
            const parsed = JSON.parse(savedSettings);
            editorSettings = { ...editorSettings, ...parsed };
        } catch (error) {
            console.warn('Failed to load settings:', error);
        }
    }
}

function saveSettings() {
    localStorage.setItem('codeEditorSettings', JSON.stringify(editorSettings));
}

function getEditorOptions() {
    return {
        fontSize: editorSettings.fontSize + 'px',
        fontFamily: editorSettings.fontFamily,
        automaticLayout: true,
        wordWrap: editorSettings.wordWrap,
        minimap: { enabled: editorSettings.minimap },
        lineNumbers: editorSettings.lineNumbers,
        autoClosingBrackets: editorSettings.autoClosingBrackets,
        autoClosingQuotes: editorSettings.autoClosingQuotes,
        tabSize: editorSettings.tabSize,
        insertSpaces: editorSettings.insertSpaces,
        renderWhitespace: editorSettings.renderWhitespace,
        cursorStyle: editorSettings.cursorStyle,
        scrollBeyondLastLine: editorSettings.scrollBeyondLastLine,
        smoothScrolling: editorSettings.smoothScrolling,
        mouseWheelZoom: editorSettings.mouseWheelZoom,
        // Kolorowe nawiasy - zawsze włączone
        'bracketPairColorization.enabled': bracketSettings.bracketPairColorization,
        'bracketPairColorization.independentColorPoolPerBracketType': true,
        matchBrackets: bracketSettings.matchingBrackets,
        guides: {
            bracketPairs: bracketSettings.coloredBrackets,
            bracketPairsHorizontal: bracketSettings.coloredBrackets,
            highlightActiveBracketPair: bracketSettings.coloredBrackets,
            indentation: true
        },
        'editor.bracketPairColorization.enabled': bracketSettings.bracketPairColorization
    };
}

function applySettingsToEditors() {
    const options = getEditorOptions();
    Object.values(editors).forEach(editor => {
        if (editor && editor.updateOptions) {
            editor.updateOptions(options);
        }
    });

    // Configure bracket pair colorization colors - zawsze włączone
    if (window.monaco) {
        configureBracketColors();
    }
}

function configureBracketColors() {
    // Define custom bracket colors
    const bracketColors = [
        '#ffd700', // Gold
        '#da70d6', // Orchid  
        '#87ceeb', // SkyBlue
        '#dda0dd', // Plum
        '#98fb98', // PaleGreen
        '#f0e68c'  // Khaki
    ];

    try {
        // Configure bracket pair colors for each editor
        Object.values(editors).forEach(editor => {
            if (editor && editor.updateOptions) {
                editor.updateOptions({
                    'bracketPairColorization.enabled': bracketSettings.bracketPairColorization,
                    'bracketPairColorization.independentColorPoolPerBracketType': true
                });
            }
        });

        // Apply custom CSS for bracket colors if not already applied
        if (!document.getElementById('bracket-colors-style')) {
            const style = document.createElement('style');
            style.id = 'bracket-colors-style';
            style.textContent = `
                .monaco-editor .bracket-highlighting-0 { color: ${bracketColors[0]} !important; }
                .monaco-editor .bracket-highlighting-1 { color: ${bracketColors[1]} !important; }
                .monaco-editor .bracket-highlighting-2 { color: ${bracketColors[2]} !important; }
                .monaco-editor .bracket-highlighting-3 { color: ${bracketColors[3]} !important; }
                .monaco-editor .bracket-highlighting-4 { color: ${bracketColors[4]} !important; }
                .monaco-editor .bracket-highlighting-5 { color: ${bracketColors[5]} !important; }
                .monaco-editor .bracket-highlighting-6 { color: ${bracketColors[0]} !important; }
                .monaco-editor .bracket-highlighting-7 { color: ${bracketColors[1]} !important; }
                .monaco-editor .bracket-highlighting-8 { color: ${bracketColors[2]} !important; }
            `;
            document.head.appendChild(style);
        }
    } catch (error) {
        console.warn('Could not configure bracket colors:', error);
    }
}

function showSettings() {
    const settingsHTML = `
        <div class="settings-grid">
            <!-- Appearance Panel -->
            <div class="panel">
                <div class="panel-header">WYGLĄD</div>
                <div class="panel-content settings-content">
                    <div class="info-card setting-card">
                        <div class="card-header">
                            <span>ROZMIAR CZCIONKI</span>
                            <span class="card-status" id="font-size-value">${editorSettings.fontSize}px</span>
                        </div>
                        <div class="card-body setting-body">
                            <div class="card-icon"><i class="fas fa-font"></i></div>
                            <div class="card-title-section">
                                <input type="range" id="font-size" min="10" max="24" value="${editorSettings.fontSize}" 
                                       class="setting-slider" onchange="updateSetting('fontSize', parseInt(this.value))"
                                       title="Dostosuj rozmiar czcionki w edytorze (10-24px)">
                                <div class="card-subtitle">Zmień rozmiar tekstu w edytorze dla lepszej czytelności</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card setting-card">
                        <div class="card-header">
                            <span>RODZAJ CZCIONKI</span>
                            <span class="card-status">FONT</span>
                        </div>
                        <div class="card-body setting-body">
                            <div class="card-icon"><i class="fas fa-font"></i></div>
                            <div class="card-title-section">
                                <select id="font-family" class="setting-select" onchange="updateSetting('fontFamily', this.value)"
                                        title="Wybierz czcionkę monoszerokościową dla kodu">
                                    <option value='"JetBrains Mono", monospace' ${editorSettings.fontFamily.includes('JetBrains') ? 'selected' : ''}>JetBrains Mono</option>
                                    <option value='"Fira Code", monospace' ${editorSettings.fontFamily.includes('Fira') ? 'selected' : ''}>Fira Code</option>
                                    <option value='"Source Code Pro", monospace' ${editorSettings.fontFamily.includes('Source') ? 'selected' : ''}>Source Code Pro</option>
                                    <option value='"Consolas", monospace' ${editorSettings.fontFamily.includes('Consolas') ? 'selected' : ''}>Consolas</option>
                                    <option value='"Monaco", monospace' ${editorSettings.fontFamily.includes('Monaco') ? 'selected' : ''}>Monaco</option>
                                </select>
                                <div class="card-subtitle">Czcionki monoszerokościowe zapewniają równe odstępy między znakami</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card setting-card">
                        <div class="card-header">
                            <span>NUMERACJA LINII</span>
                            <span class="card-status">${editorSettings.lineNumbers === 'on' ? 'ON' : 'OFF'}</span>
                        </div>
                        <div class="card-body setting-body">
                            <div class="card-icon"><i class="fas fa-list-ol"></i></div>
                            <div class="card-title-section">
                                <select id="line-numbers" class="setting-select" onchange="updateSetting('lineNumbers', this.value)"
                                        title="Sposób wyświetlania numerów linii w edytorze">
                                    <option value="on" ${editorSettings.lineNumbers === 'on' ? 'selected' : ''}>Włączone</option>
                                    <option value="off" ${editorSettings.lineNumbers === 'off' ? 'selected' : ''}>Wyłączone</option>
                                    <option value="relative" ${editorSettings.lineNumbers === 'relative' ? 'selected' : ''}>Względne</option>
                                </select>
                                <div class="card-subtitle">Numery linii ułatwiają nawigację i debugowanie kodu</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card setting-card">
                        <div class="card-header">
                            <span>MAPA KODU</span>
                            <span class="card-status">${editorSettings.minimap ? 'ON' : 'OFF'}</span>
                        </div>
                        <div class="card-body setting-body">
                            <div class="card-icon"><i class="fas fa-map"></i></div>
                            <div class="card-title-section">
                                <input type="checkbox" id="minimap" ${editorSettings.minimap ? 'checked' : ''} 
                                       class="setting-checkbox" onchange="updateSetting('minimap', this.checked)"
                                       title="Pokaż/ukryj minimapę kodu">
                                <label for="minimap" class="setting-label">Wyświetlaj minimapę kodu</label>
                                <div class="card-subtitle">Mała mapa po prawej stronie ułatwia nawigację w długich plikach</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Behavior Panel -->
            <div class="panel">
                <div class="panel-header">ZACHOWANIE</div>
                <div class="panel-content settings-content">
                    <div class="info-card setting-card">
                        <div class="card-header">
                            <span>ZAWIJANIE TEKSTU</span>
                            <span class="card-status">${editorSettings.wordWrap.toUpperCase()}</span>
                        </div>
                        <div class="card-body setting-body">
                            <div class="card-icon"><i class="fas fa-file-alt"></i></div>
                            <div class="card-title-section">
                                <select id="word-wrap" class="setting-select" onchange="updateSetting('wordWrap', this.value)"
                                        title="Sposób zawijania długich linii kodu">
                                    <option value="off" ${editorSettings.wordWrap === 'off' ? 'selected' : ''}>Wyłączone</option>
                                    <option value="on" ${editorSettings.wordWrap === 'on' ? 'selected' : ''}>Włączone</option>
                                    <option value="wordWrapColumn" ${editorSettings.wordWrap === 'wordWrapColumn' ? 'selected' : ''}>Przy kolumnie</option>
                                    <option value="bounded" ${editorSettings.wordWrap === 'bounded' ? 'selected' : ''}>Ograniczone</option>
                                </select>
                                <div class="card-subtitle">Automatyczne łamanie długich linii dla lepszej czytelności</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card setting-card">
                        <div class="card-header">
                            <span>SZEROKOŚĆ WCIĘCIA</span>
                            <span class="card-status" id="tab-size-value">${editorSettings.tabSize}</span>
                        </div>
                        <div class="card-body setting-body">
                            <div class="card-icon"><i class="fas fa-indent"></i></div>
                            <div class="card-title-section">
                                <input type="range" id="tab-size" min="2" max="8" value="${editorSettings.tabSize}" 
                                       class="setting-slider" onchange="updateSetting('tabSize', parseInt(this.value))"
                                       title="Liczba spacji lub szerokość tabulacji (2-8)">
                                <div class="card-subtitle">Określa ile spacji odpowiada jednemu poziomowi wcięcia</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card setting-card">
                        <div class="card-header">
                            <span>RODZAJ WCIĘCIA</span>
                            <span class="card-status">${editorSettings.insertSpaces ? 'SPACJE' : 'TABY'}</span>
                        </div>
                        <div class="card-body setting-body">
                            <div class="card-icon"><i class="fas fa-space-shuttle"></i></div>
                            <div class="card-title-section">
                                <input type="checkbox" id="insert-spaces" ${editorSettings.insertSpaces ? 'checked' : ''} 
                                       class="setting-checkbox" onchange="updateSetting('insertSpaces', this.checked)"
                                       title="Używaj spacji zamiast znaków tabulacji">
                                <label for="insert-spaces" class="setting-label">Używaj spacji zamiast tabów</label>
                                <div class="card-subtitle">Spacje zapewniają jednakowy wygląd w różnych edytorach</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card setting-card">
                        <div class="card-header">
                            <span>AUTOMATYCZNE ZAMYKANIE</span>
                            <span class="card-status">${editorSettings.autoClosingBrackets !== 'never' ? 'ON' : 'OFF'}</span>
                        </div>
                        <div class="card-body setting-body">
                            <div class="card-icon"><i class="fas fa-link"></i></div>
                            <div class="card-title-section">
                                <select id="auto-closing" class="setting-select" onchange="updateAutoClosing(this.value)"
                                        title="Kiedy automatycznie zamykać nawiasy i cudzysłowy">
                                    <option value="always" ${editorSettings.autoClosingBrackets === 'always' ? 'selected' : ''}>Zawsze</option>
                                    <option value="languageDefined" ${editorSettings.autoClosingBrackets === 'languageDefined' ? 'selected' : ''}>Według języka</option>
                                    <option value="beforeWhitespace" ${editorSettings.autoClosingBrackets === 'beforeWhitespace' ? 'selected' : ''}>Przed spacją</option>
                                    <option value="never" ${editorSettings.autoClosingBrackets === 'never' ? 'selected' : ''}>Nigdy</option>
                                </select>
                                <div class="card-subtitle">Automatycznie dodaje zamykające nawiasy i cudzysłowy</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Advanced Panel -->
            <div class="panel">
                <div class="panel-header">ZAAWANSOWANE</div>
                <div class="panel-content settings-content">
                    <div class="info-card setting-card">
                        <div class="card-header">
                            <span>WYGLĄD KURSORA</span>
                            <span class="card-status">${editorSettings.cursorStyle.toUpperCase()}</span>
                        </div>
                        <div class="card-body setting-body">
                            <div class="card-icon"><i class="fas fa-mouse-pointer"></i></div>
                            <div class="card-title-section">
                                <select id="cursor-style" class="setting-select" onchange="updateSetting('cursorStyle', this.value)"
                                        title="Wybierz styl wyświetlania kursora w edytorze">
                                    <option value="line" ${editorSettings.cursorStyle === 'line' ? 'selected' : ''}>Linia</option>
                                    <option value="block" ${editorSettings.cursorStyle === 'block' ? 'selected' : ''}>Blok</option>
                                    <option value="underline" ${editorSettings.cursorStyle === 'underline' ? 'selected' : ''}>Podkreślenie</option>
                                    <option value="line-thin" ${editorSettings.cursorStyle === 'line-thin' ? 'selected' : ''}>Cienka linia</option>
                                    <option value="block-outline" ${editorSettings.cursorStyle === 'block-outline' ? 'selected' : ''}>Obrys bloku</option>
                                    <option value="underline-thin" ${editorSettings.cursorStyle === 'underline-thin' ? 'selected' : ''}>Cienkie podkreślenie</option>
                                </select>
                                <div class="card-subtitle">Zmień sposób wyświetlania kursora tekstu</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card setting-card">
                        <div class="card-header">
                            <span>WIDOCZNOŚĆ SPACJI</span>
                            <span class="card-status">${editorSettings.renderWhitespace.toUpperCase()}</span>
                        </div>
                        <div class="card-body setting-body">
                            <div class="card-icon"><i class="fas fa-eye"></i></div>
                            <div class="card-title-section">
                                <select id="render-whitespace" class="setting-select" onchange="updateSetting('renderWhitespace', this.value)"
                                        title="Kiedy pokazywać białe znaki (spacje, taby)">
                                    <option value="none" ${editorSettings.renderWhitespace === 'none' ? 'selected' : ''}>Nie pokazuj</option>
                                    <option value="boundary" ${editorSettings.renderWhitespace === 'boundary' ? 'selected' : ''}>Granice</option>
                                    <option value="selection" ${editorSettings.renderWhitespace === 'selection' ? 'selected' : ''}>W zaznaczeniu</option>
                                    <option value="trailing" ${editorSettings.renderWhitespace === 'trailing' ? 'selected' : ''}>Na końcu</option>
                                    <option value="all" ${editorSettings.renderWhitespace === 'all' ? 'selected' : ''}>Wszystkie</option>
                                </select>
                                <div class="card-subtitle">Kontroluje widoczność spacji, tabów i innych białych znaków</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card setting-card">
                        <div class="card-header">
                            <span>PŁYNNE PRZEWIJANIE</span>
                            <span class="card-status">${editorSettings.smoothScrolling ? 'ON' : 'OFF'}</span>
                        </div>
                        <div class="card-body setting-body">
                            <div class="card-icon"><i class="fas fa-arrows-alt-v"></i></div>
                            <div class="card-title-section">
                                <input type="checkbox" id="smooth-scrolling" ${editorSettings.smoothScrolling ? 'checked' : ''} 
                                       class="setting-checkbox" onchange="updateSetting('smoothScrolling', this.checked)"
                                       title="Włącz animowane przewijanie w edytorze">
                                <label for="smooth-scrolling" class="setting-label">Animowane przewijanie</label>
                                <div class="card-subtitle">Płynne animacje podczas przewijania kodu</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card setting-card">
                        <div class="card-header">
                            <span>POWIĘKSZANIE MYSZĄ</span>
                            <span class="card-status">${editorSettings.mouseWheelZoom ? 'ON' : 'OFF'}</span>
                        </div>
                        <div class="card-body setting-body">
                            <div class="card-icon"><i class="fas fa-search-plus"></i></div>
                            <div class="card-title-section">
                                <input type="checkbox" id="mouse-wheel-zoom" ${editorSettings.mouseWheelZoom ? 'checked' : ''} 
                                       class="setting-checkbox" onchange="updateSetting('mouseWheelZoom', this.checked)"
                                       title="Włącz powiększanie czcionki kółkiem myszy + Ctrl">
                                <label for="mouse-wheel-zoom" class="setting-label">Ctrl + kółko myszy</label>
                                <div class="card-subtitle">Powiększaj czcionkę trzymając Ctrl i kręcąc kółkiem</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions Panel -->
            <div class="panel">
                <div class="panel-header">AKCJE</div>
                <div class="panel-content settings-content">
                    <div class="info-card action-card" onclick="resetSettings()">
                        <div class="card-header">
                            <span>RESET</span>
                            <span class="card-status"><i class="fas fa-exclamation-triangle"></i></span>
                        </div>
                        <div class="card-body">
                            <div class="card-icon"><i class="fas fa-undo"></i></div>
                            <div class="card-title-section">
                                <div class="card-title">Przywróć domyślne</div>
                                <div class="card-subtitle">Resetuj wszystkie ustawienia</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card action-card" onclick="exportSettings()">
                        <div class="card-header">
                            <span>EKSPORT</span>
                            <span class="card-status">JSON</span>
                        </div>
                        <div class="card-body">
                            <div class="card-icon"><i class="fas fa-file-export"></i></div>
                            <div class="card-title-section">
                                <div class="card-title">Eksportuj</div>
                                <div class="card-subtitle">Zapisz ustawienia</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card action-card" onclick="importSettings()">
                        <div class="card-header">
                            <span>IMPORT</span>
                            <span class="card-status">FILE</span>
                        </div>
                        <div class="card-body">
                            <div class="card-icon"><i class="fas fa-file-import"></i></div>
                            <div class="card-title-section">
                                <div class="card-title">Importuj</div>
                                <div class="card-subtitle">Wczytaj ustawienia</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-card card-accent action-card" onclick="closeModal()">
                        <div class="card-header">
                            <span>ZAPISZ</span>
                            <span class="card-status"><i class="fas fa-check"></i></span>
                        </div>
                        <div class="card-body">
                            <div class="card-icon"><i class="fas fa-save"></i></div>
                            <div class="card-title-section">
                                <div class="card-title">Zamknij</div>
                                <div class="card-subtitle">Zapisz i zamknij</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    showCustomModal('USTAWIENIA EDYTORA', settingsHTML, null, 'settings-modal');
}

function updateSetting(key, value) {
    editorSettings[key] = value;
    saveSettings();
    applySettingsToEditors();

    // Update UI indicators
    if (key === 'fontSize') {
        document.getElementById('font-size-value').textContent = value + 'px';
    } else if (key === 'tabSize') {
        document.getElementById('tab-size-value').textContent = value;
    }

    // Update status indicators
    updateSettingsStatusIndicators();
    showNotification(`Ustawienie ${key} zostało zaktualizowane!`, 'success');
}

function updateAutoClosing(value) {
    editorSettings.autoClosingBrackets = value;
    editorSettings.autoClosingQuotes = value;
    saveSettings();
    applySettingsToEditors();
    updateSettingsStatusIndicators();
    showNotification('Ustawienia auto-zamykania zostały zaktualizowane!', 'success');
}


function updateSettingsStatusIndicators() {
    // Update all status indicators in the settings modal
    const indicators = [
        { id: 'line-numbers', key: 'lineNumbers', transform: val => val === 'on' ? 'ON' : 'OFF' },
        { id: 'minimap', key: 'minimap', transform: val => val ? 'ON' : 'OFF' },
        { id: 'word-wrap', key: 'wordWrap', transform: val => val.toUpperCase() },
        { id: 'auto-closing', key: 'autoClosingBrackets', transform: val => val !== 'never' ? 'ON' : 'OFF' },
        { id: 'cursor-style', key: 'cursorStyle', transform: val => val.toUpperCase() },
        { id: 'render-whitespace', key: 'renderWhitespace', transform: val => val.toUpperCase() },
        { id: 'smooth-scrolling', key: 'smoothScrolling', transform: val => val ? 'ON' : 'OFF' },
        { id: 'mouse-wheel-zoom', key: 'mouseWheelZoom', transform: val => val ? 'ON' : 'OFF' },
        { id: 'insert-spaces', key: 'insertSpaces', transform: val => val ? 'ON' : 'OFF' }
    ];

    indicators.forEach(({ id, key, transform }) => {
        const element = document.querySelector(`#${id}`).closest('.info-card').querySelector('.card-status');
        if (element) {
            element.textContent = transform(editorSettings[key]);
        }
    });
}

function resetSettings() {
    showConfirmModal('Resetuj Ustawienia', 'Czy na pewno chcesz przywrócić domyślne ustawienia edytora?', () => {
        // Reset to defaults
        editorSettings = {
            fontSize: 15,
            fontFamily: '"JetBrains Mono", monospace',
            wordWrap: 'on',
            minimap: true,
            lineNumbers: 'on',
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            tabSize: 4,
            insertSpaces: true,
            renderWhitespace: 'none',
            cursorStyle: 'line',
            scrollBeyondLastLine: true,
            smoothScrolling: false,
            mouseWheelZoom: false
        };
        // Kolorowe nawiasy pozostają zawsze włączone

        saveSettings();
        applySettingsToEditors();
        showNotification('Ustawienia zostały przywrócone do domyślnych!', 'success');
        closeModal();
        setTimeout(() => showSettings(), 100); // Refresh the modal
    }, 'Resetuj', 'btn-danger');
}

function exportSettings() {
    const settingsData = {
        exportDate: new Date().toISOString(),
        settings: editorSettings
    };

    const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `editor-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Ustawienia zostały wyeksportowane!', 'success');
}

function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    if (importData.settings) {
                        editorSettings = { ...editorSettings, ...importData.settings };
                        saveSettings();
                        applySettingsToEditors();
                        showNotification('Ustawienia zostały zaimportowane!', 'success');
                        closeModal();
                        setTimeout(() => showSettings(), 100); // Refresh the modal
                    } else {
                        showNotification('Nieprawidłowy format pliku ustawień!', 'warning');
                    }
                } catch (error) {
                    showNotification('Błąd podczas importu ustawień!', 'warning');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// --- Preview ---

function refreshPreview() {
    updatePreview();
    showNotification('Podgląd odświeżony!', 'info');
}

function openInNewWindow() {
    const newWindow = window.open();
    newWindow.document.write(elements.previewIframe.srcdoc);
    newWindow.document.close();
}

// --- Theme ---

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('codeEditorTheme', newTheme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('codeEditorTheme') || 'light';
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('theme', theme);
    const monacoTheme = theme === 'dark' ? 'vs-dark' : 'vs';
    if (window.monaco) {
        monaco.editor.setTheme(monacoTheme);
    }
    const icon = elements.themeBtn.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// --- Utilities ---

function setupAutoSave() {
    autoSaveInterval = setInterval(() => {
        const project = {
            html: editors.html.getValue(),
            css: editors.css.getValue(),
            js: editors.js.getValue(),
            timestamp: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };
        localStorage.setItem('autoSavedProject', JSON.stringify(project));
        updateStatus('Auto-zapisano', 1500);
    }, 30000);
}

function updateStatus(message, duration = 3000) {
    elements.fileStatus.textContent = message;
    setTimeout(() => {
        elements.fileStatus.textContent = 'Gotowy do kodowania';
    }, duration);
}

/**
     * Wyświetla powiadomienie na ekranie, dodając je do stosu.
     * @param {string} message - Wiadomość do wyświetlenia.
     * @param {'success' | 'warning' | 'info'} type - Typ powiadomienia, wpływa na kolor.
     */
function showNotification(message, type) {
    // Pobranie kontenera na powiadomienia.
    const container = document.getElementById('notification-container');
    if (!container) {
        console.error('Nie znaleziono kontenera na powiadomienia.');
        return;
    }

    const notification = document.createElement('div');

    const colorVar = type === 'success' ? 'var(--success-color)' : type === 'warning' ? 'var(--warning-color)' : 'var(--info-color)';

    // Zaktualizowane style: usunięto właściwości pozycjonowania,
    // które są teraz dziedziczone z kontenera.
    notification.style.cssText = `
                background: ${colorVar}; 
                color: white; 
                padding: 1rem 1.5rem; 
                box-shadow: var(--shadow-lg); 
                font-size: 0.9rem; 
                width: 320px;
                max-width: 90vw;
                animation: fadeInGrow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; 
                font-family: "JetBrains Mono", "Share Tech Mono", monaco, courier, sans-serif;
                font-weight: 500;
                text-align: center;
                backdrop-filter: blur(8px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            `;

    notification.textContent = message;
    // Dodanie powiadomienia do kontenera, a nie bezpośrednio do body.
    container.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOutShrink 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53) both';
        notification.addEventListener('animationend', () => notification.remove());
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// --- Custom Modal Functions ---
let onConfirmCallback = null;
let currentModalSizeClass = null;

function openModal() {
    elements.modal.container.classList.remove('closing');
    elements.modal.container.classList.add('visible');
}

function closeModal() {
    elements.modal.container.classList.add('closing');
    elements.modal.container.classList.remove('visible');

    // Poczekaj na zakończenie animacji przed resetowaniem
    setTimeout(() => {
        elements.modal.container.classList.remove('closing');
        onConfirmCallback = null;
        elements.modal.body.innerHTML = '';
        elements.modal.actions.style.display = 'flex';
        elements.modal.confirmBtn.style.display = 'inline-flex';
        elements.modal.confirmBtn.className = 'btn btn-primary';
        // Remove any size class that was applied
        const modalEl = elements.modal.container.querySelector('.modal');
        if (currentModalSizeClass && modalEl) {
            modalEl.classList.remove(currentModalSizeClass);
            currentModalSizeClass = null;
        }
    }, 400); // Czas animacji fadeOutShrink
}

function showConfirmModal(title, message, onConfirm, confirmText = 'Potwierdź', confirmClass = 'btn-primary') {
    elements.modal.title.textContent = title;
    elements.modal.body.textContent = message;
    elements.modal.confirmBtn.textContent = confirmText;
    elements.modal.confirmBtn.className = `btn ${confirmClass}`;
    elements.modal.confirmBtn.style.display = 'inline-flex';
    elements.modal.cancelBtn.style.display = 'inline-flex';
    elements.modal.confirmBtn.onclick = () => { onConfirm(); closeModal(); };
    openModal();
}

function showAlertModal(title, message) {
    elements.modal.title.textContent = title;
    elements.modal.body.textContent = message;
    elements.modal.confirmBtn.textContent = 'OK';
    elements.modal.confirmBtn.style.display = 'inline-flex';
    elements.modal.cancelBtn.style.display = 'none';
    elements.modal.confirmBtn.onclick = closeModal;
    openModal();
}

function showPromptModal(title, message, defaultValue, onConfirm) {
    elements.modal.title.textContent = title;
    elements.modal.body.innerHTML = `<p>${message}</p><input type="text" id="modal-input-field" class="modal-input" value="${defaultValue}">`;
    elements.modal.confirmBtn.textContent = 'Zapisz';
    elements.modal.confirmBtn.onclick = () => { onConfirm(document.getElementById('modal-input-field').value); closeModal(); };
    openModal();
    document.getElementById('modal-input-field').focus();
}

function showListModal(title, listHTML, onSelect) {
    elements.modal.title.textContent = title;
    elements.modal.body.innerHTML = listHTML;
    elements.modal.actions.style.display = 'none';
    elements.modal.body.onclick = (e) => {
        const button = e.target.closest('button[data-index]');
        if (button) { onSelect(button.dataset.index); closeModal(); }
    };
    openModal();
}

function showCustomModal(title, contentHTML, onOpen = null, sizeClass = null) {
    elements.modal.title.textContent = title;
    elements.modal.body.innerHTML = contentHTML;
    elements.modal.actions.style.display = 'none';
    const modalEl = elements.modal.container.querySelector('.modal');
    if (sizeClass && modalEl) {
        modalEl.classList.add(sizeClass);
        currentModalSizeClass = sizeClass;
    }
    openModal();
    if (onOpen) onOpen();
}

// --- Project Management Functions ---

function loadProjectByIndex(index) {
    try {
        const projects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
        const project = projects[index];

        if (!project) {
            showNotification('Projekt nie został znaleziony!', 'warning');
            return;
        }

        // Walidacja danych projektu
        const html = project.html || '';
        const css = project.css || '';
        const js = project.js || '';

        editors.html.setValue(html);
        editors.css.setValue(css);
        editors.js.setValue(js);
        updatePreview();
        closeModal();
        showNotification(`Projekt "${project.name}" załadowany pomyślnie!`, 'success');

        // Aktualizuj status
        updateStatus(`Załadowano: ${project.name}`);
    } catch (error) {
        console.error('Błąd podczas ładowania projektu:', error);
        showNotification('Błąd podczas ładowania projektu!', 'warning');
    }
}

function deleteProject(index) {
    try {
        const projects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
        const project = projects[index];

        if (!project) {
            showNotification('Projekt nie został znaleziony!', 'warning');
            return;
        }

        showConfirmModal(
            'Usuń Projekt',
            `Czy na pewno chcesz usunąć projekt "${project.name}"?\n\nTa operacja jest nieodwracalna.`,
            () => {
                projects.splice(index, 1);
                localStorage.setItem('savedProjects', JSON.stringify(projects));
                showNotification(`Projekt "${project.name}" został usunięty!`, 'info');
                showProjectCatalog(); // Refresh catalog
            },
            'Usuń',
            'btn-danger'
        );
    } catch (error) {
        console.error('Błąd podczas usuwania projektu:', error);
        showNotification('Błąd podczas usuwania projektu!', 'warning');
    }
}

function editProjectName(index) {
    try {
        const projects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
        const project = projects[index];

        if (!project) {
            showNotification('Projekt nie został znaleziony!', 'warning');
            return;
        }

        showPromptModal(
            'Edytuj Projekt',
            `Podaj nową nazwę dla projektu:`,
            project.name,
            (newName) => {
                const trimmedName = newName.trim();
                if (!trimmedName) {
                    showNotification('Nazwa projektu nie może być pusta!', 'warning');
                    return;
                }

                if (trimmedName === project.name) {
                    showNotification('Nazwa nie została zmieniona.', 'info');
                    return;
                }

                // Sprawdź czy nazwa już istnieje
                const existingProject = projects.find((p, i) => p.name === trimmedName && i !== index);
                if (existingProject) {
                    showNotification('Projekt o tej nazwie już istnieje!', 'warning');
                    return;
                }

                project.name = trimmedName;
                project.lastModified = new Date().toISOString();
                localStorage.setItem('savedProjects', JSON.stringify(projects));
                showNotification(`Nazwa projektu zmieniona na "${project.name}"!`, 'success');
                showProjectCatalog(); // Refresh catalog
            }
        );
    } catch (error) {
        console.error('Błąd podczas edycji projektu:', error);
        showNotification('Błąd podczas edycji projektu!', 'warning');
    }
}

function duplicateProject(index) {
    try {
        const projects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
        const project = projects[index];

        if (!project) {
            showNotification('Projekt nie został znaleziony!', 'warning');
            return;
        }

        // Wygeneruj unikalną nazwę kopii
        let copyName = `${project.name} (kopia)`;
        let counter = 1;
        while (projects.find(p => p.name === copyName)) {
            counter++;
            copyName = `${project.name} (kopia ${counter})`;
        }

        const duplicatedProject = {
            ...project,
            id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: copyName,
            created: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            version: '1.0'
        };

        projects.push(duplicatedProject);
        localStorage.setItem('savedProjects', JSON.stringify(projects));
        showNotification(`Projekt zduplikowany jako "${duplicatedProject.name}"!`, 'success');
        showProjectCatalog(); // Refresh catalog
    } catch (error) {
        console.error('Błąd podczas duplikowania projektu:', error);
        showNotification('Błąd podczas duplikowania projektu!', 'warning');
    }
}

function previewProject(index) {
    const projects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
    const project = projects[index];
    if (project) {
        const fullHtml = `
                    <!DOCTYPE html>
                    <html lang="pl">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${project.name}</title>
                        <style>${project.css}</style>
                    </head>
                    <body>
                        ${project.html}
                        <script>
                            try {
                                ${project.js}
                            } catch(e) {
                                console.error("JavaScript Error:", e);
                            }
    </script>
</body>

</html>
`;
        const newWindow = window.open();
        newWindow.document.write(fullHtml);
        newWindow.document.close();
        newWindow.document.title = `Podgląd: ${project.name}`;
    }
}

function exportProjects() {
    const projects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
    if (projects.length === 0) {
        showNotification('Brak projektów do eksportu!', 'warning');
        return;
    }

    const exportData = {
        exportDate: new Date().toISOString(),
        projectsCount: projects.length,
        projects: projects
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projekty_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification(`Wyeksportowano ${projects.length} projektów!`, 'success');
}

function importProjects() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    if (importData.projects && Array.isArray(importData.projects)) {
                        const existingProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
                        const newProjects = [...existingProjects, ...importData.projects];
                        localStorage.setItem('savedProjects', JSON.stringify(newProjects));
                        showNotification(`Zaimportowano ${importData.projects.length} projektów!`, 'success');
                        showProjectCatalog(); // Refresh catalog
                    } else {
                        showNotification('Nieprawidłowy format pliku!', 'warning');
                    }
                } catch (error) {
                    showNotification('Błąd podczas importu!', 'warning');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function sortProjects(type) {
    const projects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
    if (type === 'name') {
        projects.sort((a, b) => a.name.localeCompare(b.name));
    } else if (type === 'date') {
        projects.sort((a, b) => new Date(b.created) - new Date(a.created));
    }
    localStorage.setItem('savedProjects', JSON.stringify(projects));
    showProjectCatalog(); // Refresh catalog
    showNotification(`Projekty posortowane po ${type === 'name' ? 'nazwie' : 'dacie'}!`, 'info');
}

function setupProjectCatalogEvents() {
    const searchInput = document.getElementById('project-search');
    const categoryFilter = document.getElementById('category-filter');

    if (searchInput) {
        searchInput.addEventListener('input', filterProjects);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProjects);
    }
}

function filterProjects() {
    const searchTerm = document.getElementById('project-search')?.value.toLowerCase() || '';
    const selectedCategory = document.getElementById('category-filter')?.value || '';
    const projectItems = document.querySelectorAll('.project-card');

    let visibleCount = 0;

    projectItems.forEach(item => {
        const projectName = item.dataset.projectName || '';
        const projectCategory = item.dataset.projectCategory || '';
        const projectDescription = item.querySelector('.project-card-description')?.textContent.toLowerCase() || '';
        const projectTags = item.querySelector('.project-card-meta div:nth-child(4)')?.textContent.toLowerCase() || '';

        // Rozszerzone wyszukiwanie w nazwie, kategorii, opisie i tagach
        const matchesSearch = !searchTerm ||
            projectName.includes(searchTerm) ||
            projectCategory.includes(searchTerm) ||
            projectDescription.includes(searchTerm) ||
            projectTags.includes(searchTerm);

        const matchesCategory = !selectedCategory || projectCategory === selectedCategory.toLowerCase();

        const shouldShow = matchesSearch && matchesCategory;

        // Animacja show/hide
        if (shouldShow) {
            item.style.display = 'block';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
            visibleCount++;
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (item.style.opacity === '0') {
                    item.style.display = 'none';
                }
            }, 200);
        }
    });

    // Pokaż informację o liczbie znalezionych projektów
    const searchInfo = document.getElementById('search-results-info');
    if (searchInfo) {
        const totalCount = projectItems.length;
        if (searchTerm || selectedCategory) {
            const categoryText = selectedCategory ? ` w kategorii "${selectedCategory}"` : '';
            searchInfo.innerHTML = `<i class="fas fa-search"></i> Znaleziono <strong>${visibleCount}</strong> z <strong>${totalCount}</strong> projektów${categoryText}`;
            searchInfo.style.display = 'block';
        } else {
            searchInfo.style.display = 'none';
        }
    }

    // Pokaż komunikat gdy brak wyników
    const projectsContainer = document.getElementById('projects-list');
    if (visibleCount === 0 && (searchTerm || selectedCategory) && projectsContainer) {
        const noResults = document.querySelector('.no-results-state');
        if (!noResults) {
            const noResultsHTML = `
                <div class="no-results-state empty-projects-state">
                    <i class="fas fa-search"></i>
                    <h3>Brak wyników</h3>
                    <p>Nie znaleziono projektów pasujących do kryteriów wyszukiwania</p>
                    <button class="btn search-clear-button" onclick="clearSearch()">
                        <i class="fas fa-times"></i> Wyczyść wyszukiwanie
                    </button>
                </div>
            `;
            projectsContainer.insertAdjacentHTML('beforeend', noResultsHTML);
        }
    } else {
        const noResults = document.querySelector('.no-results-state');
        if (noResults) noResults.remove();
    }
}

function clearSearch() {
    const searchInput = document.getElementById('project-search');
    const categoryFilter = document.getElementById('category-filter');

    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';

    filterProjects();
}

function clearAllProjects() {
    const projects = JSON.parse(localStorage.getItem('savedProjects') || '[]');

    if (projects.length === 0) {
        showNotification('Brak projektów do usunięcia!', 'info');
        return;
    }

    showConfirmModal(
        'Wyczyść Wszystkie Projekty',
        `Czy na pewno chcesz usunąć WSZYSTKIE projekty (${projects.length})?\n\nTa operacja jest nieodwracalna i usunie wszystkie zapisane projekty!`,
        () => {
            localStorage.removeItem('savedProjects');
            showNotification(`Usunięto wszystkie projekty (${projects.length})!`, 'info');
            showProjectCatalog(); // Refresh catalog
        },
        'Usuń Wszystkie',
        'btn-danger'
    );
}

// Add CSS keyframe animations
const style = document.createElement('style');
style.textContent = `@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform:
translateX(0); opacity: 1; } } @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform:
translateX(100%); opacity: 0; } }`;
document.head.appendChild(style);
