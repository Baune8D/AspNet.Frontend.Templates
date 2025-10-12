# AspNet.Frontend.Templates

This project is a minimal template for using ASP.NET Core with modern frontend build tools.  
It is built upon the original MVC template and can be customized any way you want.

Additional related repos:
* [AspNet.AssetManager](https://github.com/Baune8D/AspNet.AssetManager) - C# code for working with the generated assets. **See for more documentation.**
* [aspnet-buildtools](https://github.com/Baune8D/aspnet-buildtools) - NPM package that helps with build tool configuration. **See for more documentation**

View-specific bundles are automatically created for each `.cshtml` file with a corresponding `.cshtml.{js,ts}` file in the same location.  
**Note:** TypeScript support is not included out of the box. It needs to be configured manually in the build configuration if needed.

Bundles will not be generated for partial views and view components.

Bundles can also be created manually by creating a file using a `.bundle.{js,ts}` suffix anywhere in the project directory.  
**Note:** The `.bundle` part will be stripped of the resulting bundle name.

The `_Layout.cshtml` view is configured to automatically include a view-specific bundle if it exists. If not, the `Layout` bundle in `Assets/bundles` will be loaded instead (See `AspNet.AssetManager` for more documentation).

Import aliases are automatically configured so root can be resolved using: `@/`.  
If using areas, they are also automatically aliased also using: `@<area>/`.

Start development server with hot-reload using `npm start` script in project folder.  
Build production assets using `npm run build` script in project folder.