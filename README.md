# AspNet.Frontend.Templates

This project contains minimal templates for using ASP.NET Core with modern frontend build tools.  

It is built upon the original ASP.NET Core templates and can be customized any way you want.

Additional related repos:
* [AspNet.AssetManager](https://github.com/Baune8D/AspNet.AssetManager) - C# code for working with the generated assets. **See for more documentation.**
* [aspnet-buildtools](https://github.com/Baune8D/aspnet-buildtools) - NPM package that helps with build tool configuration. **See for more documentation**

## Quick start

1. `dotnet new install AspNet.Frontend.Templates` (Install templates)
2. `mkdir my-project && cd my-project` (Create project folder)
3. `dotnet new mvcwebpackts` (Scaffold: ASP.NET MVC with Webpack and TypeScript)
4. `npm install` (Install npm dependencies)
5. `npm start` (Start development server)
6. `dotnet run` (Run project)

## How it works

View-specific bundles are automatically created for each `.cshtml` file with a corresponding `.cshtml.{js,ts}` file in the same path.  

**Bundles will not be generated for partial views and view components.**

Bundles can also be created manually by creating a file using a `.bundle.{js,ts}` suffix anywhere in the project.  
**Note:** The `.bundle` part will be stripped of the resulting bundle name.

The `_Layout.cshtml` view is configured to automatically include a view-specific bundle if it exists.
If not, the `Layout` bundle in `Assets/bundles` will be loaded instead (See `AspNet.AssetManager` for documentation).

Import aliases are automatically configured so the project root can be resolved using: `@/`.  
If using areas, they are also automatically aliased using: `@<area>/`.

Start development server with hot-reload using `npm start` script in project folder.  
Build production assets using `npm run build` script in project folder.
