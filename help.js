// HP12c Help System - Examples and Documentation

/** @type {Object.<string, {title: string, examples: Array<{name: string, problem: string, steps: string[], result: string}>}>} */
let exampleData = {};

// Load FAQ data from JSON file
async function loadFAQData() {
    try {
        // Add cache-busting timestamp to ensure fresh data
        const response = await fetch(`./faq-data.json?v=${Date.now()}`);
        if (!response.ok) {
            throw new Error('Failed to load FAQ data');
        }
        exampleData = await response.json();
    } catch (error) {
        console.error('Error loading FAQ data:', error);
        // Provide minimal fallback
        exampleData = {
            tips: { title: "Practice Tips & Common Errors", examples: [] }
        };
    }
}

// Initialize FAQ data when script loads
loadFAQData();

let currentCategory = null;
let currentCategoryKey = null;
let helpExpanded = false;

function toggleFAQ() {
    const helpContent = document.getElementById('help-content');
    const helpSection = document.querySelector('.help-section');
    const faqBtn = document.getElementById('faq-btn');
    
    if (helpExpanded) {
        // Collapse everything
        collapseFAQ();
    } else {
        // Expand and show category menu
        helpContent.style.display = 'block';
        helpSection.classList.remove('collapsed');
        faqBtn.style.display = 'none';
        showCategoryMenu();
        helpExpanded = true;
    }
}

function collapseFAQ() {
    const helpContent = document.getElementById('help-content');
    const helpSection = document.querySelector('.help-section');
    const faqBtn = document.getElementById('faq-btn');
    
    helpContent.style.display = 'none';
    helpSection.classList.add('collapsed');
    faqBtn.style.display = 'block';
    helpExpanded = false;
}

function showCategoryMenu() {
    document.getElementById('help-categories-view').style.display = 'block';
    document.getElementById('help-tips').style.display = 'none';
    document.getElementById('help-example-list').style.display = 'none';
    document.getElementById('help-example-detail').style.display = 'none';
}

function backToCategoryMenu() {
    showCategoryMenu();
}

function toggleHelp(mode) {
    // Deprecated - kept for compatibility if needed
    toggleFAQ();
}

function showHelpDefault() {
    // Deprecated - replaced by category menu
    showCategoryMenu();
}

function showExamplesMenu() {
    // Deprecated - replaced by category menu
    showCategoryMenu();
}

function showCategory(categoryKey) {
    currentCategoryKey = categoryKey;
    
    // Handle tips specially - show the tips view instead of example list
    if (categoryKey === 'tips') {
        document.getElementById('help-categories-view').style.display = 'none';
        document.getElementById('help-tips').style.display = 'block';
        document.getElementById('help-example-list').style.display = 'none';
        document.getElementById('help-example-detail').style.display = 'none';
        return;
    }
    
    currentCategory = exampleData[categoryKey];
    
    // Check if data is loaded
    if (!currentCategory) {
        console.warn('Category not loaded yet:', categoryKey);
        return;
    }
    
    document.getElementById('help-categories-view').style.display = 'none';
    document.getElementById('help-tips').style.display = 'none';
    document.getElementById('help-example-list').style.display = 'block';
    document.getElementById('help-example-detail').style.display = 'none';
    
    document.getElementById('category-title').textContent = currentCategory.title;
    
    const buttonContainer = document.getElementById('example-buttons');
    buttonContainer.innerHTML = '';
    
    currentCategory.examples.forEach((example, index) => {
        const btn = document.createElement('button');
        btn.className = 'help-example-btn';
        btn.textContent = example.name;
        btn.onclick = () => showExample(index);
        buttonContainer.appendChild(btn);
    });
}

function formatStep(step) {
    // Replace backtick content with code tags for shaded background
    return step.replace(/`([^`]+)`/g, (match, content) => {
        // Wrap all content in code tag for shaded background
        return `<code>${content}</code>`;
    });
}

function showExample(exampleIndex) {
    const example = currentCategory.examples[exampleIndex];
    
    document.getElementById('help-example-list').style.display = 'none';
    document.getElementById('help-example-detail').style.display = 'block';
    
    // Set the title in the header
    document.getElementById('example-title').textContent = example.name;
    
    const content = document.getElementById('example-content');
    content.innerHTML = `
        <div class="example-problem">
            <strong>Problem:</strong> ${example.problem}
        </div>
        <div class="example-steps">
            <div class="steps-header" onclick="toggleSteps(this)">
                <strong>Steps</strong> <span class="toggle-icon">▶ Click to show</span>
            </div>
            <ol class="steps-list" style="display: none;">
                ${example.steps.map(step => `<li>${formatStep(step)}</li>`).join('')}
            </ol>
        </div>
        <div class="example-result">
            <strong>Result:</strong> ${example.result}
        </div>
    `;
}

function toggleSteps(header) {
    const stepsList = header.nextElementSibling;
    const icon = header.querySelector('.toggle-icon');
    const helpContent = document.getElementById('help-content');
    
    if (stepsList.style.display === 'none') {
        stepsList.style.display = 'block';
        icon.textContent = '▼ Click to hide';
        // Expand the help content area to fit the steps
        helpContent.style.maxHeight = '600px';
    } else {
        stepsList.style.display = 'none';
        icon.textContent = '▶ Click to show';
        // Restore original max height
        helpContent.style.maxHeight = '400px';
    }
}

function backToExampleList() {
    document.getElementById('help-example-detail').style.display = 'none';
    document.getElementById('help-example-list').style.display = 'block';
}
