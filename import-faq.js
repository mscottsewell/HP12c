// Import FAQ content from faq-content.md and update help.js
// This script reads the edited Markdown file and regenerates the help.js file

const fs = require('fs');
const path = require('path');

// Parse the Markdown file to extract categories and examples
function parseMarkdown() {
    const mdPath = path.join(__dirname, 'faq-content.md');
    const content = fs.readFileSync(mdPath, 'utf8');
    
    const exampleData = {};
    
    // Split by ## headers (categories)
    const lines = content.split('\n');
    let currentCategoryKey = null;
    let currentCategoryTitle = null;
    let currentExample = null;
    let inSteps = false;
    let categoryExamples = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Category header (## Title)
        if (line.startsWith('## ')) {
            // Save previous category if exists
            if (currentCategoryKey && currentExample) {
                categoryExamples.push(currentExample);
                currentExample = null;
            }
            if (currentCategoryKey) {
                exampleData[currentCategoryKey] = {
                    title: currentCategoryTitle,
                    examples: categoryExamples
                };
            }
            
            currentCategoryTitle = line.substring(3).trim();
            categoryExamples = [];
            currentExample = null;
            inSteps = false;
            
            // Look for category key in next lines
            for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
                const keyMatch = lines[j].match(/\[\/\/\]:\s*#\s*\(Category Key:\s*(\w+)\)/);
                if (keyMatch) {
                    currentCategoryKey = keyMatch[1];
                    break;
                }
            }
        }
        // Example header (### Name)
        else if (line.startsWith('### ')) {
            // Save previous example if exists
            if (currentExample && currentCategoryKey) {
                categoryExamples.push(currentExample);
            }
            
            currentExample = {
                name: line.substring(4).trim(),
                problem: '',
                steps: [],
                result: ''
            };
            inSteps = false;
        }
        // Problem line
        else if (line.startsWith('**Problem:**')) {
            if (currentExample) {
                currentExample.problem = line.substring(12).trim();
            }
        }
        // Steps header
        else if (line.trim() === '**Steps:**') {
            inSteps = true;
        }
        // Result line
        else if (line.startsWith('**Result:**')) {
            if (currentExample) {
                currentExample.result = line.substring(11).trim();
            }
            inSteps = false;
        }
        // Step item (list item while in steps section - numbered or bulleted)
        else if (inSteps && (line.trim().startsWith('-') || /^\d+\.\s/.test(line.trim()))) {
            if (currentExample) {
                // Remove leading dash or number
                let step = line.trim();
                if (step.startsWith('-')) {
                    step = step.substring(1).trim();
                } else {
                    step = step.replace(/^\d+\.\s*/, '');
                }
                if (step) {
                    currentExample.steps.push(step);
                }
            }
        }
        // Empty line might signal end of steps
        else if (inSteps && line.trim() === '') {
            inSteps = false;
        }
    }
    
    // Save last example and category
    if (currentExample && currentCategoryKey) {
        categoryExamples.push(currentExample);
    }
    if (currentCategoryKey) {
        exampleData[currentCategoryKey] = {
            title: currentCategoryTitle,
            examples: categoryExamples
        };
    }
    
    return exampleData;
}

// Generate the JavaScript code for exampleData
function generateExampleDataCode(exampleData) {
    let code = 'const exampleData = {\n';
    
    // Maintain order
    const categoryOrder = ['tips', 'tvm', 'cashflow', 'percentage', 'statistics', 'math', 'depreciation', 'amortization', 'dates'];
    
    categoryOrder.forEach((key, index) => {
        const category = exampleData[key];
        if (!category) {
            console.warn(`Category ${key} not found in Markdown, skipping`);
            return;
        }
        
        code += `    ${key}: {\n`;
        code += `        title: "${escapeString(category.title)}",\n`;
        code += `        examples: `;
        
        if (category.examples.length === 0) {
            code += '[] // This is handled differently in the HTML\n';
        } else {
            code += '[\n';
            
            category.examples.forEach((example, exIndex) => {
                code += '            {\n';
                code += `                name: "${escapeString(example.name)}",\n`;
                code += `                problem: "${escapeString(example.problem)}",\n`;
                code += '                steps: [\n';
                
                example.steps.forEach((step, stepIndex) => {
                    const comma = stepIndex < example.steps.length - 1 ? ',' : '';
                    code += `                    "${escapeString(step)}"${comma}\n`;
                });
                
                code += '                ],\n';
                code += `                result: "${escapeString(example.result)}"\n`;
                
                const exampleComma = exIndex < category.examples.length - 1 ? ',' : '';
                code += `            }${exampleComma}\n`;
            });
            
            code += '        ]\n';
        }
        
        const categoryComma = index < categoryOrder.length - 1 ? ',' : '';
        code += `    }${categoryComma}\n`;
    });
    
    code += '};\n';
    
    return code;
}

// Escape special characters in strings
function escapeString(str) {
    return str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
}

// Read the original help.js to preserve functions
function readOriginalHelpJs() {
    const helpJsPath = path.join(__dirname, 'help.js');
    return fs.readFileSync(helpJsPath, 'utf8');
}

// Replace the exampleData in help.js
function updateHelpJs(newExampleDataCode) {
    const originalContent = readOriginalHelpJs();
    
    // Find the exampleData declaration and everything after it
    const beforeExampleData = originalContent.substring(0, originalContent.indexOf('const exampleData'));
    const afterExampleData = originalContent.substring(originalContent.search(/(?:\r?\n){2,}let currentCategory/));
    
    const newContent = beforeExampleData + newExampleDataCode + afterExampleData;
    
    const helpJsPath = path.join(__dirname, 'help.js');
    fs.writeFileSync(helpJsPath, newContent, 'utf8');
}

// Main import function
function importFAQ() {
    console.log('Reading faq-content.md...');
    const exampleData = parseMarkdown();
    
    console.log('Generating JavaScript code...');
    const code = generateExampleDataCode(exampleData);
    
    console.log('Updating help.js...');
    updateHelpJs(code);
    
    console.log('✓ Successfully imported FAQ content to help.js');
    
    // Count totals
    const categoryCount = Object.keys(exampleData).length;
    let totalExamples = 0;
    Object.values(exampleData).forEach(cat => {
        totalExamples += cat.examples.length;
    });
    
    console.log(`  Categories updated: ${categoryCount}`);
    console.log(`  Total examples: ${totalExamples}`);
}

// Run the import
try {
    importFAQ();
} catch (error) {
    console.error('Error importing FAQ:', error.message);
    console.error(error.stack);
    process.exit(1);
}
