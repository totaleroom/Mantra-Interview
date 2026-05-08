const fs = require('fs');

const csvPath = '../from_lovable/prompts-export-2026-05-08_21-34-37.csv';
const jsonPath = './data/prompts.json';

const currentPrompts = JSON.parse(fs.readFileSync(jsonPath, 'utf8')).prompts;
const existingTitles = new Set(currentPrompts.map(p => p.title.trim().toLowerCase()));

const csvContent = fs.readFileSync(csvPath, 'utf8');

// Parse CSV (semicolon delimited)
function parseCSV(content) {
  const lines = [];
  let currentLine = '';
  let insideQuotes = false;
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '"' && (i === 0 || content[i-1] !== '\\')) {
      insideQuotes = !insideQuotes;
      currentLine += char;
    } else if (char === '\n' && !insideQuotes) {
      lines.push(currentLine);
      currentLine = '';
    } else {
      currentLine += char;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  const headers = lines[0].split(';');
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Quick split taking quotes into account
    let cols = [];
    let curCol = '';
    let inQuote = false;
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '"') {
        inQuote = !inQuote;
      } else if (line[j] === ';' && !inQuote) {
        cols.push(curCol);
        curCol = '';
      } else {
        curCol += line[j];
      }
    }
    cols.push(curCol);
    
    if (cols.length >= 4) {
      result.push({
        id: cols[0],
        category: cols[1],
        title: cols[2],
        prompt_text: cols[3].replace(/^"|"$/g, '').replace(/""/g, '"'),
        sort_order: cols[4] ? parseInt(cols[4]) : 99
      });
    }
  }
  return result;
}

const csvPrompts = parseCSV(csvContent);
let addedCount = 0;

for (const cp of csvPrompts) {
  if (!existingTitles.has(cp.title.trim().toLowerCase())) {
    currentPrompts.push(cp);
    existingTitles.add(cp.title.trim().toLowerCase());
    addedCount++;
  }
}

fs.writeFileSync(jsonPath, JSON.stringify({ prompts: currentPrompts }, null, 2));
console.log('Successfully merged ' + addedCount + ' new prompts from CSV into prompts.json');
console.log('Total prompts now: ' + currentPrompts.length);
