from app.health_analyzer import calculate_health_score
from app.repository_analyzer import analyze_repository_tree


def generate_forgeops_report(
    repository,
    branches,
    commits,
    pull_requests,
    issues,
    workflows,
    tree,
):
    """
    Generate a unified ForgeOps engineering report.
    """

    analysis = analyze_repository_tree(tree)

    health = calculate_health_score(
        repository=repository,
        branches=branches,
        commits=commits,
        pull_requests=pull_requests,
        issues=issues,
        workflows=workflows,
    )

    recommendations = []

    # -----------------------------
    # CI/CD
    # -----------------------------

    if not analysis["ci_cd"]["github_actions"]:

        recommendations.append({
            "priority": "HIGH",
            "category": "CI/CD",
            "message": (
                "Add a GitHub Actions CI/CD workflow "
                "to automatically validate changes."
            ),
        })

    # -----------------------------
    # Testing
    # -----------------------------

    if not analysis["testing"]["detected"]:

        recommendations.append({
            "priority": "HIGH",
            "category": "Testing",
            "message": (
                "Add an automated testing suite "
                "and integrate it with CI."
            ),
        })

    # -----------------------------
    # Documentation
    # -----------------------------

    if not analysis["documentation"]["readme"]:

        recommendations.append({
            "priority": "MEDIUM",
            "category": "Documentation",
            "message": (
                "Add a README explaining the project, "
                "installation and usage."
            ),
        })

    # -----------------------------
    # Docker
    # -----------------------------

    if not analysis["devops"]["docker"]:

        recommendations.append({
            "priority": "MEDIUM",
            "category": "DevOps",
            "message": (
                "Add a Dockerfile to make the application "
                "portable and deployment-ready."
            ),
        })

    # -----------------------------
    # Security
    # -----------------------------

    suspicious_count = (
        analysis["security"]["potential_secret_files"]
    )

    if suspicious_count > 0:

        recommendations.append({
            "priority": "CRITICAL",
            "category": "Security",
            "message": (
                f"Potential secret files detected: "
                f"{suspicious_count}."
            ),
        })

    # -----------------------------
    # Final report
    # -----------------------------

    return {
        "repository": repository["full_name"],

        "health": {
            "score": health["score"],
            "status": health["status"],
            "category_scores": health[
                "category_scores"
            ],
        },

        "technology": {
            "languages": analysis["technologies"],
            "file_count": analysis["file_count"],
        },

        "engineering": {
            "documentation": (
                "good"
                if analysis["documentation"]["readme"]
                else "missing"
            ),

            "testing": (
                "detected"
                if analysis["testing"]["detected"]
                else "missing"
            ),

            "ci_cd": (
                "configured"
                if analysis["ci_cd"]["github_actions"]
                else "missing"
            ),

            "docker": (
                "configured"
                if analysis["devops"]["docker"]
                else "missing"
            ),

            "dependencies": analysis["dependencies"],
        },

        "security": {
            "suspicious_files": suspicious_count,
        },

        "recommendations": recommendations,
    }