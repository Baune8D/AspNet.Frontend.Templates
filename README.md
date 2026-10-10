# AspNet.Frontend.Templates

[![Build](https://github.com/Baune8D/AspNet.Frontend.Templates/actions/workflows/pipeline.yml/badge.svg?branch=main)](https://github.com/Baune8D/AspNet.Frontend.Templates/actions/workflows/pipeline.yml)
[![NuGet Version](https://img.shields.io/nuget/v/AspNet.Frontend.Templates)](https://www.nuget.org/packages/AspNet.Frontend.Templates)
[![NuGet Downloads](https://img.shields.io/nuget/dt/AspNet.Frontend.Templates)](https://www.nuget.org/packages/AspNet.Frontend.Templates)
[![License: MIT](https://img.shields.io/github/license/Baune8D/AspNet.Frontend.Templates)](https://github.com/Baune8D/AspNet.Frontend.Templates/blob/main/LICENSE.txt)

**`dotnet new` templates for ASP.NET Core MVC and Razor Pages with Vite or Webpack.** Each template is the standard ASP.NET Core template with its frontend moved to a modern bundler: per-view bundles, hot reload in development, and hashed assets in production.

```bash
dotnet new install AspNet.Frontend.Templates
dotnet new mvcvite -o MyApp
```

## Templates

| Template | Short name | Bundler | Language |
| --- | --- | --- | --- |
| ASP.NET MVC with Vite | `mvcvite` | Vite | JavaScript |
| ASP.NET MVC with Vite and TypeScript | `mvcvitets` | Vite | TypeScript |
| ASP.NET MVC with Webpack | `mvcwebpack` | Webpack | JavaScript |
| ASP.NET MVC with Webpack and TypeScript | `mvcwebpackts` | Webpack | TypeScript |
| ASP.NET Razor Pages with Vite | `razorvite` | Vite | JavaScript |
| ASP.NET Razor Pages with Vite and TypeScript | `razorvitets` | Vite | TypeScript |
| ASP.NET Razor Pages with Webpack | `razorwebpack` | Webpack | JavaScript |
| ASP.NET Razor Pages with Webpack and TypeScript | `razorwebpackts` | Webpack | TypeScript |

All templates target .NET 10 and include Bootstrap, jQuery and jQuery Validation, like the standard templates.

## Requirements

- .NET 10 SDK
- Node.js 22.15 or later

## Quick start

```bash
dotnet new install AspNet.Frontend.Templates
dotnet new mvcvite -o MyApp
cd MyApp
npm install
npm start      # starts the Vite or Webpack dev server
dotnet run     # in a second terminal
```

`npm start` runs the dev server with hot reload (Vite on port 5173, Webpack on port 9000). `npm run build` writes production assets to `wwwroot/dist`.

## How it works

The templates use two packages that work together:

- [aspnet-buildtools](https://github.com/Baune8D/aspnet-buildtools) configures Vite or Webpack: it creates an entry point for each view that has a script file next to it.
- [AspNet.AssetManager](https://github.com/Baune8D/AspNet.AssetManager) reads the bundler's manifest and renders the `<script>` and `<link>` tags in your views, from the dev server in development and from `wwwroot/dist` in production.

### Bundles

| File | Bundle |
| --- | --- |
| `Views/Home/Index.cshtml.js` (or `.ts`) next to `Views/Home/Index.cshtml` | `Views_Home_Index` |
| `Pages/Privacy.cshtml.js` (or `.ts`) next to `Pages/Privacy.cshtml` | `Pages_Privacy` |
| `Assets/bundles/Layout.bundle.js` (or `.ts`), anywhere in the project | `Layout` |

- `_Layout.cshtml` renders the bundle for the current view, and falls back to the `Layout` bundle if the view has none:

  ```cshtml
  <link-bundle fallback="Layout" />
  <script-bundle fallback="Layout" />
  ```

- Partial views (`_*.cshtml`) and view components do not get bundles.
- The `ValidationScripts` bundle contains jQuery Validation. Add `<script-bundle name="ValidationScripts" />` to pages with forms.

### Import aliases

- `@/` resolves to the project root, e.g. `import '@/Assets/css/site.css'`.
- In the JavaScript templates, each area also gets an alias automatically: `@<Area>/` resolves to `Areas/<Area>/`.

#### Areas with TypeScript

In the TypeScript templates, aliases are defined in `paths` in `tsconfig.json`, which only has `@/`. If you add an area, add an alias for it:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@Admin/*": ["./Areas/Admin/*"]
    }
  }
}
```

TypeScript needs this to type-check the import. The Webpack TypeScript templates also use `paths` to resolve imports.

#### Importing other file types with TypeScript

TypeScript checks that every import resolves, including imports of stylesheets. The Vite templates get declarations for stylesheets and other assets from `vite/client`. The Webpack templates declare `*.css` in `global.d.ts`; add a line there for other file types you import, e.g. `declare module '*.scss';`.

## Examples

Example projects with more configuration:

- [Example.Mvc.Vite](https://github.com/Baune8D/AspNet.Frontend.Templates/tree/main/examples/Example.Mvc.Vite): TypeScript, Sass and a view-specific bundle.
- [Example.Mvc.Webpack](https://github.com/Baune8D/AspNet.Frontend.Templates/tree/main/examples/Example.Mvc.Webpack): TypeScript, Sass, a view-specific bundle and a separate `Vendor` bundle for `node_modules`.

## Notes

- **Webpack:** restart the dev server after adding a new entry point.
- **Vite:** in development, CSS is injected by JavaScript, so pages briefly render without styles. Production builds use normal `<link>` tags.

## Developing the templates

```bash
./build.sh            # builds every template and its frontend, then packs the NuGet package
```

`scripts/install.sh` packs the templates from source and installs them locally. Run it from the `scripts` folder.

## License

[MIT](https://github.com/Baune8D/AspNet.Frontend.Templates/blob/main/LICENSE.txt)
