# Portfolio OS

A Windows 95 inspired portfolio built with Next.js. The desktop contains folders, notes, bundled HTML applications, and HTML applications created by the visitor.

## Development

```bash
npm install
npm run dev
```

## Structure

- `src/entities/application` defines application data, tree traversal, and the shortcut view. It does not depend on features.
- `src/features/applications` owns creation, editing, window state, and persistence. `model/create-application.ts` creates user files; `model/initial-applications.ts` describes the initial desktop.
- `src/features/settings` owns the settings screen.
- `src/widgets/desktop` assembles windows, folders, and the shortcut grid from entities and features.
- `app` contains the Next.js route and layout; the desktop and taskbar are composed in `widgets/desktop`.
- `src/shared` contains reusable UI, localization, and global styles.

Each application has one `type` that determines how it opens. A user-created executable stores HTML in `src.html` and opens in an editor with a preview. Bundled executables keep a URL to a file under `public/apps`; their HTML is not copied into browser storage. Add bundled shortcuts in `src/features/applications/model/bundled-applications.ts` and `initial-applications.ts`.

The application store persists user files, window state, and shortcut positions under the `user-storage` key in `localStorage`. HTML previews run inside a sandboxed iframe without same-origin access to the desktop.
