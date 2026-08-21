def calculate_health_score(
    repository,
    branches,
    commits,
    pull_requests,
    issues,
    workflows,
):
    score = 0
    signals = []
    recommendations = []

    # --------------------------------
    # 1. Repository basics — 20 points
    # --------------------------------

    repository_score = 0

    if repository.get("description"):
        repository_score += 5
    else:
        recommendations.append(
            "Add a clear repository description."
        )

    if repository.get("default_branch"):
        repository_score += 5

    if not repository.get("fork"):
        repository_score += 5

    if repository.get("private") is not None:
        repository_score += 5

    score += repository_score

    # --------------------------------
    # 2. CI/CD — 20 points
    # --------------------------------

    ci_score = 0

    workflow_list = workflows.get("workflows", [])

    if workflow_list:
        ci_score += 10
        signals.append("GitHub Actions configured.")
    else:
        recommendations.append(
            "Add a GitHub Actions CI/CD workflow."
        )

    active_workflows = [
        workflow
        for workflow in workflow_list
        if workflow.get("state") == "active"
    ]

    if active_workflows:
        ci_score += 10
        signals.append(
            "Active GitHub Actions workflows detected."
        )

    score += ci_score

    # --------------------------------
    # 3. Development activity — 20 points
    # --------------------------------

    development_score = 0

    if commits:
        development_score += 10
        signals.append(
            f"{len(commits)} recent commits detected."
        )

    if branches:
        development_score += 5

    if pull_requests:
        development_score += 5
    else:
        recommendations.append(
            "Consider using pull requests for code review."
        )

    score += development_score

    # --------------------------------
    # 4. Issue management — 20 points
    # --------------------------------

    issue_score = 0

    if issues:
        issue_score += 10
        signals.append(
            f"{len(issues)} open issues detected."
        )

    if len(issues) <= 5:
        issue_score += 10
    else:
        recommendations.append(
            "Review and reduce the number of open issues."
        )

    score += issue_score

    # --------------------------------
    # 5. Repository maturity — 20 points
    # --------------------------------

    maturity_score = 0

    if len(commits) >= 3:
        maturity_score += 10

    if len(branches) >= 1:
        maturity_score += 5

    if workflow_list:
        maturity_score += 5
    else:
        recommendations.append(
            "Introduce automated development workflows."
        )

    score += maturity_score

    # --------------------------------
    # Final status
    # --------------------------------

    if score >= 80:
        status = "excellent"
    elif score >= 60:
        status = "good"
    elif score >= 40:
        status = "needs_improvement"
    else:
        status = "critical"

    return {
        "score": score,
        "status": status,

        "category_scores": {
            "repository": repository_score,
            "ci_cd": ci_score,
            "development": development_score,
            "issues": issue_score,
            "maturity": maturity_score,
        },

        "signals": signals,

        "recommendations": recommendations,
    }