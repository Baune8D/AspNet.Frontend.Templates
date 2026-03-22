using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Nuke.Common;
using Nuke.Common.CI;
using Nuke.Common.CI.GitHubActions;
using Nuke.Common.Git;
using Nuke.Common.IO;
using Nuke.Common.ProjectModel;
using Nuke.Common.Tooling;
using Nuke.Common.Tools.DotNet;
using Nuke.Common.Tools.GitVersion;
using Nuke.Common.Tools.Npm;
using Nuke.Common.Utilities.Collections;
using static Nuke.Common.Tools.DotNet.DotNetTasks;
using static Nuke.Common.Tools.Npm.NpmTasks;

[SuppressMessage("ReSharper", "UnusedMember.Local")]
class Build : NukeBuild
{
    public static int Main () => Execute<Build>(x => x.Package);

    [Parameter(Name = "MYGET_API_KEY")] [Secret] string MyGetApiKey { get; set; }
    [Parameter(Name = "NUGET_API_KEY")] [Secret] string NuGetApiKey { get; set; }

    [Solution] readonly Solution Solution;
    [GitRepository] readonly GitRepository GitRepository;
    [GitVersion] readonly GitVersion GitVersion;
    [CI] readonly GitHubActions GitHubActions;

    static AbsolutePath ArtifactsDirectory => RootDirectory / "artifacts";
    
    static IEnumerable<AbsolutePath> Artifacts => ArtifactsDirectory.GlobFiles("*.nupkg");
    
    // ReSharper disable once UnusedMember.Local
    Target Clean => _ => _
        .Executes(() =>
        {
            RootDirectory
                .GlobDirectories("**/bin", "**/obj")
                .ForEach(path => path.DeleteDirectory());

            ArtifactsDirectory.CreateOrCleanDirectory();
        });

    Target Test => _ => _
        .Executes(() =>
        {
            var templates = RootDirectory / "templates";
            
            templates.GlobFiles("*/*.csproj")
                .ForEach(project => DotNetBuild(s => s
                    .SetProjectFile(project)
                    .SetConfiguration("Release")
                    .EnableTreatWarningsAsErrors()));
            
            templates.GlobFiles("*/package.json")
                .ForEach(project =>
                {
                    NpmInstall(s => s
                        .SetProcessWorkingDirectory(project.Parent));
                    
                    NpmRun(s => s
                        .SetProcessWorkingDirectory(project.Parent)
                        .SetCommand("build"));
                });
        });
    
    Target Package => _ => _
        .DependsOn(Test)
        .Produces(ArtifactsDirectory / "*.nupkg")
        .Executes(() =>
        {
            ArtifactsDirectory.CreateOrCleanDirectory();

            DotNetPack(s => s
                .SetProject("AspNet.Frontend.Templates.csproj")
                .SetAssemblyVersion(GitVersion.AssemblySemVer)
                .SetFileVersion(GitVersion.AssemblySemFileVer)
                .SetInformationalVersion(GitVersion.InformationalVersion)
                .SetOutputDirectory(ArtifactsDirectory)
                .SetVersion(GitVersion.SemVer));
        });

    Target PushMyGet => _ => _
        .DependsOn(Package)
        .OnlyWhenStatic(() => IsServerBuild && GitRepository.IsOnMainBranch())
        .Executes(() =>
        {
            DotNetNuGetPush(s => s
                .SetSource("https://www.myget.org/F/baunegaard/api/v2/package")
                .SetApiKey(MyGetApiKey)
                .CombineWith(Artifacts, (ss, artifact) => ss
                    .SetTargetPath(artifact)),
                degreeOfParallelism: Environment.ProcessorCount);
        });

    Target PushNuGet => _ => _
        .DependsOn(Package)
        .OnlyWhenStatic(() => IsServerBuild && GitHubActions.RefType == "tag")
        .Executes(() =>
        {
            DotNetNuGetPush(s => s
                .SetSource("https://api.nuget.org/v3/index.json")
                .SetApiKey(NuGetApiKey)
                .CombineWith(Artifacts, (ss, artifact) => ss
                    .SetTargetPath(artifact)),
                degreeOfParallelism: Environment.ProcessorCount);
        });
}
