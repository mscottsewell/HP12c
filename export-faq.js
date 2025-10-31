// Export FAQ content from help.js to faq-content.md
// This script reads the exampleData from help.js and creates a structured Markdown file

const fs = require('fs');
const path = require('path');

// Read and parse help.js to extract exampleData
function extractExampleData() {
    const helpJsPath = path.join(__dirname, 'help.js');
    const content = fs.readFileSync(helpJsPath, 'utf8');
    
    // Extract the exampleData object
    const match = content.match(/const exampleData = ({[\s\S]*?});(?:\r?\n){2,}let currentCategory/);
    if (!match) {
        throw new Error('Could not find exampleData in help.js');
    }
    
    // Use eval to parse the JavaScript object (safe in this controlled context)
    const exampleData = eval('(' + match[1] + ')');
    return exampleData;
}

// Format a single example as Markdown
function formatExample(example) {
    let md = `### ${example.name}\n\n`;
    md += `**Problem:** ${example.problem}\n\n`;
    md += '**Steps:**\n';
    example.steps.forEach((step, index) => {
        md += `${index + 1}. ${step}\n`;
    });
    md += `\n**Result:** ${example.result}\n\n`;
    return md;
}

// Format a category with all its examples
function formatCategory(categoryKey, categoryData) {
    let md = `\n## ${categoryData.title}\n\n`;
    md += `[//]: # (Category Key: ${categoryKey})\n\n`;
    
    if (categoryData.examples && categoryData.examples.length > 0) {
        categoryData.examples.forEach(example => {
            md += formatExample(example);
        });
    } else {
        md += '*(No examples - handled separately in HTML)*\n\n';
    }
    
    return md;
}

// Main export function
function exportFAQ() {
    console.log('Reading help.js...');
    const exampleData = extractExampleData();
    
    let markdown = '# HP12c Calculator FAQ Content\n\n';
    markdown += '<!-- This file is auto-generated from help.js -->\n';
    markdown += '<!-- Edit this file and run import-faq.js to update help.js -->\n';
    markdown += '<!-- Keep category key metadata unchanged -->\n\n';
    markdown += '> **Instructions for Editing:**\n';
    markdown += '> 1. Edit category titles (## headers), example names (### headers), problems, steps, and results\n';
    markdown += '> 2. Keep the category key metadata unchanged (format: `[//]: # (Category Key: tvm)`)\n';
    markdown += '> 3. Keep backticks (`) around button/key references in steps\n';
    markdown += '> 4. After editing, run: `node import-faq.js`\n\n';
    markdown += '---\n\n';
    
    // Export each category in order
    const categoryOrder = ['tvm', 'math', 'percentage', 'statistics', 'dates', 'loans', 'investment', 'bonds', 'depreciation', 'tips'];
    
    categoryOrder.forEach(key => {
        if (exampleData[key]) {
            markdown += formatCategory(key, exampleData[key]);
        }
    });
    
    // Write to file
    const outputPath = path.join(__dirname, 'faq-content.md');
    fs.writeFileSync(outputPath, markdown, 'utf8');
    
    console.log('✓ Successfully exported FAQ content to faq-content.md');
    console.log(`  Total categories: ${categoryOrder.length}`);
    
    // Count total examples
    let totalExamples = 0;
    categoryOrder.forEach(key => {
        if (exampleData[key] && exampleData[key].examples) {
            totalExamples += exampleData[key].examples.length;
        }
    });
    console.log(`  Total examples: ${totalExamples}`);
}

// Run the export
try {
    exportFAQ();
} catch (error) {
    console.error('Error exporting FAQ:', error.message);
    process.exit(1);
}
