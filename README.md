# AspNet.Frontends

This project is a minimal template for using ASP.NET Core with modern frontend build tools.  
It is built upon the original MVC template and can be customized any way you want.

Additional related repos:
* [AspNetWebpack](https://github.com/Baune8D/AspNetWebpack) - C# code for working with the generated assets.
* [aspnet-buildtools](https://github.com/Baune8D/aspnet-buildtools) - NPM package that helps with build tool configuration.

The webpack configuration is configured to split all `node_modules` code into a reusable `Vendor.js` bundle.

The project also creates a view-specific bundle (e.g. `Home_Index.js`) for each view or Razor Page in a corresponding folder structure.
Alternatively bundles can be manually created by using a `.bundle.{js,ts}` suffix.

Bundles will also be built for all cshtml files with a matching `.js` or `.ts` file.  
Bundles will not be built for partial views and view components.

Start development server using `npm start` in project folder.  
Build production files using `npm run build` in project folder.