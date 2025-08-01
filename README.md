# AspNet.Frontends

This project is a minimal template for using ASP.NET Core with modern frontend build tools (Webpack only for now).  
It is built upon the original MVC template and can be customized any way you want.

Additional related repos:
* [AspNet.AssetManager](https://github.com/Baune8D/AspNet.AssetManager) - C# code for working with the generated assets.
* [aspnet-buildtools](https://github.com/Baune8D/aspnet-buildtools) - NPM package that helps with build tool configuration.

View-specific bundles are created for each `.cshtml` file with a corresponding `.cshtml.{js,ts}` file.  
The `_Layout.cshtml` view is configured to automatically include a view-specific bundle if it exists.

Bundles can also be created by creating a file using a `.bundle.{js,ts}` suffix anywhere in the project directory.  
The `.bundle` part will be stripped of the resulting bundle name.

Bundles will not be generated for partial views and view components.

Import aliases are automatically configured so root can be resolved using: `@/`.  
If using areas, they are automatically aliased also using: `@<area>/`.

The Webpack configuration is configured to split all `node_modules` code into a reusable `Vendor.js` bundle.
It also uses content hashes for resulting non-development bundle names.

Source maps are enabled for easy debugging.

Start development server with hot-reload using `npm start` script in project folder.  
Build production assets using `npm run build` script in project folder.