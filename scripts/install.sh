#!/bin/zsh
rm -f ../templates/bin/Release/AspNet.Frontend.Templates.*.nupkg || true
dotnet new uninstall AspNet.Frontend.Templates || true
dotnet pack ../templates
dotnet new install ../templates/bin/Release/AspNet.Frontend.Templates.1.0.0.nupkg