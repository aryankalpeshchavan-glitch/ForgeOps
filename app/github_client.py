import os

import httpx

from app.github_auth import get_installation_token


GITHUB_API_URL = "https://api.github.com"


async def get_github_client() -> httpx.AsyncClient:
    """Create an authenticated GitHub API client."""

    installation_id = os.getenv("GITHUB_INSTALLATION_ID")

    if not installation_id:
        raise ValueError("GITHUB_INSTALLATION_ID is not configured")

    token = await get_installation_token(int(installation_id))

    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    return httpx.AsyncClient(
        base_url=GITHUB_API_URL,
        headers=headers,
    )