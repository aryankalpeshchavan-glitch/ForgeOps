import os
import time

import httpx
import jwt
from dotenv import load_dotenv

load_dotenv()


def create_app_jwt() -> str:
    """Create a JWT for authenticating as the GitHub App."""

    app_id = os.getenv("GITHUB_APP_ID")
    private_key_path = os.getenv("GITHUB_APP_PRIVATE_KEY_PATH")

    if not app_id:
        raise ValueError("GITHUB_APP_ID is not configured")

    if not private_key_path:
        raise ValueError("GITHUB_APP_PRIVATE_KEY_PATH is not configured")

    with open(private_key_path, "r") as key_file:
        private_key = key_file.read()

    now = int(time.time())

    payload = {
        "iat": now - 60,
        "exp": now + (9 * 60),
        "iss": app_id,
    }

    return jwt.encode(
        payload,
        private_key,
        algorithm="RS256",
    )


async def get_installation_token(installation_id: int) -> str:
    """Generate an installation access token for the GitHub App."""

    app_jwt = create_app_jwt()

    url = (
        f"https://api.github.com/app/installations/"
        f"{installation_id}/access_tokens"
    )

    headers = {
        "Authorization": f"Bearer {app_jwt}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            url,
            headers=headers,
        )

    response.raise_for_status()

    return response.json()["token"]