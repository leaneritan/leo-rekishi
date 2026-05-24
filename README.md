# Leo の歴史 Study App

A study app for Japanese middle school history, built for Leo.

## Live App
https://YOUR_USERNAME.github.io/leo-rekishi-app/

## Run locally
```bash
npm install
npm run dev
```

## How to add a new unit (no coding needed)
1. Copy any file from `src/content/units/` as a template.
2. Fill in the JSON with new content following the schema below.
3. Add one entry to `src/content/manifest.json`.
4. Push to GitHub — the app deploys automatically.

## Content schema

### Unit JSON (`src/content/units/unit-id.json`)
```json
{
  "id": "unit-id",
  "title": "Unit Title",
  "chapter": 1,
  "section": 1,
  "color": "#HEXCODE",
  "dayTag": "Day X",
  "learningGoal": "Goal text",
  "slides": [
    {
      "id": "slide-1",
      "title": "Slide Title",
      "type": "concept | formula | era-list | period-list | naming | comparison",
      "body": "Description",
      "cards": [ { "num": "①", "heading": "Heading", "text": "Text" } ]
    }
  ],
  "flashcards": [
    { "id": "fc1", "term": "Term", "definition": "Definition" }
  ],
  "quiz": [
    {
      "id": "q1",
      "section": "Section",
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "answer": 0,
      "explanation": "Explanation text"
    }
  ],
  "timeline": [
    {
      "id": "tl1",
      "year": "Year text",
      "bc": true,
      "event": "Event name",
      "detail": "Detail text"
    }
  ]
}
```

### Manifest (`src/content/manifest.json`)
Add an object to the `units` array:
```json
{
  "id": "unit-id",
  "title": "Unit Title",
  "chapter": 1,
  "section": 1,
  "dayTag": "Day X",
  "color": "#HEXCODE",
  "description": "Short description"
}
```

## Tech stack
Vite + React + Tailwind CSS + React Router + GitHub Pages
