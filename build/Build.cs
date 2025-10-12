using System;
using System.Collections.Generic;
using Nuke.Common;
using Nuke.Common.CI;
using Nuke.Common.CI.AppVeyor;
using Nuke.Common.Git;
using Nuke.Common.IO;
using Nuke.Common.ProjectModel;
using Nuke.Common.Tooling;
using Nuke.Common.Tools.DotNet;
using Nuke.Common.Tools.GitVersion;
using Nuke.Common.Tools.NuGet;
using Nuke.Common.Utilities.Collections;
using static Nuke.Common.Tools.DotNet.DotNetTasks;
using static Nuke.Common.Tools.NuGet.NuGetTasks;

// ReSharper disable AllUnderscoreLocalParameterName

[ShutdownDotNetAfterServerBuild]
[AppVeyor(
    AppVeyorImage.VisualStudio2022,
    InvokedTargets =
    [
        nameof(PushNuGet),
        nameof(PushMyGet),
    ])]
[AppVeyorSecret("MYGET_API_KEY", "78qy8e6pKfJlQV7RAG5tJOWegzXpjASkUs3aFdVBoPYA5gi6+mWdjbuAmNa5OQPe")]
[AppVeyorSecret("NUGET_API_KEY", "aMbj+EdePo74elFCi6lrQZcO81mru5j8cqD5FxGoDBWgXFFHwok/z4B+BtS4H1Sw")]
class Build : NukeBuild
{
    public static int Main () => Execute<Build>(x => x.Package);

    [Parameter(Name = "MYGET_API_KEY")] [Secret] string MyGetApiKey { get; set; }
    [Parameter(Name = "NUGET_API_KEY")] [Secret] string NuGetApiKey { get; set; }

    [Solution] readonly Solution Solution;
    [GitRepository] readonly GitRepository GitRepository;
    [GitVersion] readonly GitVersion GitVersion;
    [CI] readonly AppVeyor AppVeyor;

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

    Target Package => _ => _
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
            NuGetPush(s => s
                .SetSource("https://www.myget.org/F/baunegaard/api/v2/package")
                .SetApiKey(MyGetApiKey)
                .CombineWith(Artifacts, (ss, artifact) => ss
                    .SetTargetPath(artifact)),
                degreeOfParallelism: Environment.ProcessorCount);
        });

    Target PushNuGet => _ => _
        .DependsOn(Package)
        .OnlyWhenStatic(() => IsServerBuild && AppVeyor.RepositoryTag)
        .Executes(() =>
        {
            NuGetPush(s => s
                .SetSource("https://api.nuget.org/v3/index.json")
                .SetApiKey(NuGetApiKey)
                .CombineWith(Artifacts, (ss, artifact) => ss
                    .SetTargetPath(artifact)),
                degreeOfParallelism: Environment.ProcessorCount);
        });
}
