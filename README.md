# DHTMLX React Scheduler - Zustand Demo

This demo shows how to wire **DHTMLX React Scheduler** to a **Zustand** store so Scheduler event CRUD flows through a single, predictable state layer.

After you run it, you will see a full-screen Scheduler with a small custom toolbar (view switcher, date navigation, and undo/redo). The demo illustrates where Scheduler styles are imported, where the component is mounted, and how Scheduler's `data.save(...)` callback can be mapped to Zustand actions.

## Features
- Day/week/month views with an external toolbar
- Create, edit, and delete events (stored in Zustand)
- Undo/redo for **event changes** (navigation is not recorded)

## Requirements
- Node.js: **20.19+** (Vite 7 requirement)
- Package manager: **npm** (repo includes `package-lock.json`)

## Quick start

### 1) Install
```bash
# clone
git clone <repo-url>
cd <repo-folder>

# install
npm install
```

### 2) Run
```bash
npm run dev
```

Open: http://localhost:5173

## Try it
- Create a new event in Scheduler → it appears immediately (store-driven)
- Drag or resize an event → the event updates in the store
- Click **Undo** → the last event change is reverted
- Use **Prev/Next/Today** or switch **Day/Week/Month** → navigation changes, but **Undo** still reverts event edits (not navigation)

## Project structure
- `src/components/Scheduler.tsx` – Scheduler init + `data.save(...)` → Zustand mapping
- `src/store.ts` – Zustand store, event actions, and undo/redo history
- `src/seed/data.ts` – deterministic seed events + initial view/date

## Scripts
- `dev` – run the app locally
- `build` – build for production
- `preview` – preview the production build locally
- `lint` - run ESLint

## License

Source code in this repo is released under the **MIT License**.

**DHTMLX React Scheduler** is a commercial library - use it under a valid [DHTMLX license](https://dhtmlx.com/docs/products/licenses.shtml) or evaluation agreement.

## Useful links

[DHTMLX React Scheduler product page](https://dhtmlx.com/docs/products/dhtmlxScheduler-for-React/)

[DHTMLX Scheduler product page](https://dhtmlx.com/docs/products/dhtmlxScheduler/)

[Documentation](https://docs.dhtmlx.com/scheduler/)

[React Scheduler Documentation](https://docs.dhtmlx.com/gantt/integrations/react/)

[Blog](https://dhtmlx.com/blog/)

[Forum](https://forum.dhtmlx.com/)