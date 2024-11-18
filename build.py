import os
import json
import shutil
import subprocess
import tarfile
import argparse
from pathlib import Path

class PluginBuilder:
    def __init__(self):
        self.plugin_id = self._get_plugin_id()
        self.plugin_version = self._get_plugin_version()
        self.bundle_name = f"{self.plugin_id}.tar.gz"
        self.bundle_dist = Path("dist")
        self.api_dist = Path("api/dist")
        self.web_dist = Path("web/dist")

    def _get_plugin_id(self):
        with open("plugin.json", "r") as f:
            return json.load(f)["id"]

    def _get_plugin_version(self):
        with open("version.txt", "r") as f:
            return f.read().strip()

    def clean(self):
        """Clean previous build artifacts"""
        if not self.bundle_dist.exists():
            return
        print("Cleaning previous output...")
        for path in [self.bundle_dist, self.api_dist, self.web_dist]:
            if path.exists():
                shutil.rmtree(path)
        print("Previous output cleaned")

    def build_api(self):
        """Build API module for all supported architectures"""
        print("Building API module...")
        subprocess.run(["go", "mod", "download"], cwd="api", check=True, shell=(os.name == "nt"))
        self.api_dist.mkdir(parents=True, exist_ok=True)

        platforms = [
            ("linux", "amd64", ""),
            ("linux", "arm64", ""),
            ("darwin", "amd64", ""),
            ("darwin", "arm64", ""),
            ("windows", "amd64", ".exe")
        ]
        for goos, goarch, ext in platforms:
            output = self.api_dist.absolute() / f"plugin-{goos}-{goarch}{ext}"
            env = os.environ.copy()
            env.update({
                "GOOS": goos,
                "GOARCH": goarch
            })

            subprocess.run([
                "go", "build",
                "-trimpath",
                "-o", str(output)
            ], cwd="api/src", env=env, check=True, shell=(os.name == "nt"))
        print("API module built")

    def build_web(self):
        """Build web module"""
        print("Building web module...")
        subprocess.run(["npm", "ci", "--silent"], cwd="web", check=True, shell=(os.name == "nt"))
        self.web_dist.mkdir(parents=True, exist_ok=True)

        subprocess.run(["npx", "vite", "build"], cwd="web", check=True, shell=(os.name == "nt"))
        print("Web module built")

    def bundle(self):
        """Create the final plugin bundle"""
        print(f"Bundling plugin...")
        print(f"ID: {self.plugin_id}")
        print(f"VERSION: {self.plugin_version}")

        # Create plugin directory structure
        plugin_dir = self.bundle_dist / Path(self.plugin_id)
        plugin_dir.mkdir(parents=True, exist_ok=True)

        # Update plugin.json with version
        with open("plugin.json", "r") as f:
            plugin_data = json.load(f)
        plugin_data["version"] = self.plugin_version

        with open(plugin_dir / "plugin.json", "w") as f:
            json.dump(plugin_data, f, indent=4)

        # Copy files to distribution directory
        shutil.copy("icon.svg", plugin_dir)

        # Copy API and web builds
        shutil.copytree(self.api_dist, plugin_dir / "api/")
        shutil.copytree(self.web_dist, plugin_dir / "web/")

        # Create tar bundle
        with tarfile.open(self.bundle_dist / self.bundle_name, "w:gz") as tar:
            tar.add(plugin_dir, arcname=plugin_dir.name)

        # Remove the non-bundled directory
        shutil.rmtree(plugin_dir)

        print(f"Plugin bundled to root /{self.bundle_dist} as {self.bundle_name}")

def main():
    parser = argparse.ArgumentParser(description="Simple cross-platform plugin bundler")
    _ = parser.parse_args()

    builder = PluginBuilder()

    builder.clean()
    builder.build_api()
    builder.build_web()
    builder.bundle()

if __name__ == "__main__":
    main()
