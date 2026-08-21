import httpx

from app.github_client import get_github_client


async def get_repository(owner: str, repo: str):
    """Get basic repository information."""

    client = await get_github_client()

    try:
        response = await client.get(
            f"/repos/{owner}/{repo}"
        )

        response.raise_for_status()

        return response.json()

    finally:
        await client.aclose()


async def get_branches(owner: str, repo: str):
    """Get repository branches."""

    client = await get_github_client()

    try:
        response = await client.get(
            f"/repos/{owner}/{repo}/branches"
        )

        response.raise_for_status()

        return response.json()

    finally:
        await client.aclose()


async def get_commits(owner: str, repo: str):
    """Get recent repository commits."""

    client = await get_github_client()

    try:
        response = await client.get(
            f"/repos/{owner}/{repo}/commits",
            params={"per_page": 10},
        )

        response.raise_for_status()

        return response.json()

    finally:
        await client.aclose()


async def get_pull_requests(owner: str, repo: str):
    """Get open pull requests."""

    client = await get_github_client()

    try:
        response = await client.get(
            f"/repos/{owner}/{repo}/pulls",
            params={
                "state": "open",
                "per_page": 10,
            },
        )

        response.raise_for_status()

        return response.json()

    finally:
        await client.aclose()


async def get_issues(owner: str, repo: str):
    """Get open issues."""

    client = await get_github_client()

    try:
        response = await client.get(
            f"/repos/{owner}/{repo}/issues",
            params={
                "state": "open",
                "per_page": 10,
            },
        )

        response.raise_for_status()

        return response.json()

    finally:
        await client.aclose()


async def get_workflows(owner: str, repo: str):
    """Get GitHub Actions workflows."""

    client = await get_github_client()

    try:
        response = await client.get(
            f"/repos/{owner}/{repo}/actions/workflows"
        )

        response.raise_for_status()

        return response.json()

    finally:
        await client.aclose()

async def get_repository_tree(owner: str, repo: str, branch: str):
    """Get the repository file tree."""

    client = await get_github_client()

    try:
        response = await client.get(
            f"/repos/{owner}/{repo}/git/trees/{branch}",
            params={"recursive": "1"},
        )

        response.raise_for_status()

        return response.json()

    finally:
        await client.aclose()


async def get_repository_content(
    owner: str,
    repo: str,
    path: str,
):
    """Get information about a file or directory."""

    client = await get_github_client()

    try:
        response = await client.get(
            f"/repos/{owner}/{repo}/contents/{path}"
        )

        response.raise_for_status()

        return response.json()

    finally:
        await client.aclose()