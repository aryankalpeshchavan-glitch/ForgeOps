import os

from fastapi import FastAPI

from app.github_auth import get_installation_token
from app.github_client import get_github_client
from app.github_repository import (
    get_branches,
    get_commits,
    get_issues,
    get_pull_requests,
    get_repository,
    get_repository_tree,
    get_workflows,
)
from app.repository_analyzer import analyze_repository_tree
from app.health_analyzer import calculate_health_score
from app.forgeops_engine import generate_forgeops_report
from app.auto_fixer import fix_ci


app = FastAPI(
    title="ForgeOps",
    description=(
        "Autonomous GitHub Repository Engineering Platform "
        "for code quality, security, testing, DevOps analysis, "
        "and AI-powered development assistance."
    ),
    version="0.1.0",
)


@app.get("/")
async def root():
    return {
        "name": "ForgeOps",
        "status": "running",
        "version": "0.1.0",
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "ForgeOps",
        "version": "0.1.0",
    }


@app.get("/github/test")
async def github_test():

    installation_id = os.getenv("GITHUB_INSTALLATION_ID")

    if not installation_id:
        return {
            "success": False,
            "error": "GITHUB_INSTALLATION_ID is not configured",
        }

    try:
        await get_installation_token(
            int(installation_id)
        )

        return {
            "success": True,
            "message": "GitHub App authentication successful",
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
        }


@app.get("/github/repositories")
async def github_repositories():

    try:
        client = await get_github_client()

        try:
            response = await client.get(
                "/installation/repositories"
            )

            response.raise_for_status()

            data = response.json()

        finally:
            await client.aclose()

        repositories = []

        for repo in data.get("repositories", []):

            repositories.append({
                "name": repo["name"],
                "full_name": repo["full_name"],
                "private": repo["private"],
                "default_branch": repo["default_branch"],
                "html_url": repo["html_url"],
                "description": repo["description"],
                "language": repo["language"],
                "fork": repo["fork"],
                "stars": repo["stargazers_count"],
                "open_issues": repo["open_issues_count"],
            })

        return {
            "success": True,
            "count": len(repositories),
            "repositories": repositories,
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e),
        }


@app.get(
    "/github/repositories/{owner}/{repo}/overview"
)
async def repository_overview(
    owner: str,
    repo: str,
):

    try:

        repository = await get_repository(
            owner,
            repo,
        )

        branches = await get_branches(
            owner,
            repo,
        )

        commits = await get_commits(
            owner,
            repo,
        )

        pull_requests = await get_pull_requests(
            owner,
            repo,
        )

        issues = await get_issues(
            owner,
            repo,
        )

        workflows = await get_workflows(
            owner,
            repo,
        )

        return {
            "success": True,

            "repository": {
                "name": repository["name"],
                "full_name": repository["full_name"],
                "description": repository["description"],
                "private": repository["private"],
                "default_branch": repository["default_branch"],
                "language": repository["language"],
                "stars": repository["stargazers_count"],
                "fork": repository["fork"],
            },

            "branches": {
                "count": len(branches),
                "names": [
                    branch["name"]
                    for branch in branches
                ],
            },

            "commits": {
                "count": len(commits),
                "recent": [
                    {
                        "sha": commit["sha"],
                        "message": commit["commit"]["message"],
                        "author": (
                            commit["commit"]["author"]["name"]
                        ),
                    }
                    for commit in commits
                ],
            },

            "pull_requests": {
                "open": len(pull_requests),
            },

            "issues": {
                "open": len(issues),
            },

            "github_actions": {
                "workflow_count": len(
                    workflows.get("workflows", [])
                ),
                "workflows": [
                    {
                        "name": workflow["name"],
                        "state": workflow["state"],
                    }
                    for workflow in workflows.get(
                        "workflows",
                        []
                    )
                ],
            },
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e),
        }


@app.get(
    "/github/repositories/{owner}/{repo}/health"
)
async def repository_health(
    owner: str,
    repo: str,
):

    try:

        repository = await get_repository(
            owner,
            repo,
        )

        branches = await get_branches(
            owner,
            repo,
        )

        commits = await get_commits(
            owner,
            repo,
        )

        pull_requests = await get_pull_requests(
            owner,
            repo,
        )

        issues = await get_issues(
            owner,
            repo,
        )

        workflows = await get_workflows(
            owner,
            repo,
        )

        health = calculate_health_score(
            repository=repository,
            branches=branches,
            commits=commits,
            pull_requests=pull_requests,
            issues=issues,
            workflows=workflows,
        )

        return {
            "success": True,
            "repository": repository["full_name"],
            "health": health,
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e),
        }
@app.get(
    "/github/repositories/{owner}/{repo}/analyze"
)
async def analyze_repository(
    owner: str,
    repo: str,
):

    try:

        repository = await get_repository(
            owner,
            repo,
        )

        branch = repository["default_branch"]

        tree = await get_repository_tree(
            owner,
            repo,
            branch,
        )

        analysis = analyze_repository_tree(
            tree
        )

        return {
            "success": True,
            "repository": repository["full_name"],
            "default_branch": branch,
            "analysis": analysis,
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e),
        }
@app.get(
    "/github/repositories/{owner}/{repo}/report"
)
async def forgeops_report(
    owner: str,
    repo: str,
):

    try:

        repository = await get_repository(
            owner,
            repo,
        )

        branches = await get_branches(
            owner,
            repo,
        )

        commits = await get_commits(
            owner,
            repo,
        )

        pull_requests = await get_pull_requests(
            owner,
            repo,
        )

        issues = await get_issues(
            owner,
            repo,
        )

        workflows = await get_workflows(
            owner,
            repo,
        )

        tree = await get_repository_tree(
            owner,
            repo,
            repository["default_branch"],
        )

        report = generate_forgeops_report(
            repository=repository,
            branches=branches,
            commits=commits,
            pull_requests=pull_requests,
            issues=issues,
            workflows=workflows,
            tree=tree,
        )

        return {
            "success": True,
            "report": report,
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e),
        }
@app.post(
    "/github/repositories/{owner}/{repo}/fix/ci"
)
async def fix_repository_ci(
    owner: str,
    repo: str,
):

    try:

        repository = await get_repository(
            owner,
            repo,
        )

        base_branch = repository[
            "default_branch"
        ]

        result = await fix_ci(
            owner=owner,
            repo=repo,
            base_branch=base_branch,
        )

        return {
            "success": True,
            "message": (
                "ForgeOps created a CI fix "
                "Pull Request."
            ),
            "result": result,
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e),
        }