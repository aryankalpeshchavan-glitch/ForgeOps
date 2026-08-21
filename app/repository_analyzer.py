def analyze_repository_tree(tree):
    """
    Analyze repository files and detect
    technologies, testing, CI/CD and DevOps signals.
    """

    files = [
        item["path"]
        for item in tree.get("tree", [])
        if item["type"] == "blob"
    ]

    directories = [
        item["path"]
        for item in tree.get("tree", [])
        if item["type"] == "tree"
    ]

    def exists(filename):
        return filename in files

    def contains(path):
        return any(
            file_path.startswith(path)
            for file_path in files
        )

    # -----------------------------
    # Documentation
    # -----------------------------

    documentation = {
        "readme": exists("README.md")
        or exists("README"),
    }

    # -----------------------------
    # Languages / technologies
    # -----------------------------

    technologies = []

    if exists("requirements.txt"):
        technologies.append("Python")

    if exists("pyproject.toml"):
        technologies.append("Python")

    if exists("package.json"):
        technologies.append("Node.js")

    if exists("pom.xml"):
        technologies.append("Java")

    if exists("build.gradle"):
        technologies.append("Java/Gradle")

    if exists("go.mod"):
        technologies.append("Go")

    # -----------------------------
    # Testing
    # -----------------------------

    testing = {
        "detected": (
            contains("tests/")
            or contains("test/")
            or exists("pytest.ini")
            or exists("jest.config.js")
        )
    }

    # -----------------------------
    # CI/CD
    # -----------------------------

    ci_cd = {
        "github_actions": contains(
            ".github/workflows/"
        )
    }

    # -----------------------------
    # Containerization
    # -----------------------------

    devops = {
        "docker": exists("Dockerfile"),
        "docker_compose": (
            exists("docker-compose.yml")
            or exists("compose.yml")
        ),
    }

    # -----------------------------
    # Dependency management
    # -----------------------------

    dependencies = {
        "python": (
            exists("requirements.txt")
            or exists("pyproject.toml")
        ),
        "node": exists("package.json"),
    }

    # -----------------------------
    # Potential secret files
    # -----------------------------

    suspicious_files = []

    for file_path in files:

        filename = file_path.lower()

        if filename.endswith(".pem"):
            suspicious_files.append(file_path)

        if filename.endswith(".key"):
            suspicious_files.append(file_path)

        if filename == ".env":
            suspicious_files.append(file_path)

    # -----------------------------
    # Summary
    # -----------------------------

    return {
        "file_count": len(files),

        "directory_count": len(directories),

        "documentation": documentation,

        "technologies": list(set(technologies)),

        "testing": testing,

        "ci_cd": ci_cd,

        "devops": devops,

        "dependencies": dependencies,

        "security": {
            "suspicious_files": suspicious_files,
            "potential_secret_files": len(
                suspicious_files
            ),
        },

        "files": files,
    }