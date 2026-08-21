import base64

from app.github_client import get_github_client


def print_github_error(response):
    """
    Print detailed GitHub API error information.
    """

    if response.is_error:
        print("================================")
        print("GITHUB ERROR")
        print("STATUS:", response.status_code)
        print("RESPONSE:", response.text)
        print(
            "PERMISSIONS:",
            response.headers.get(
                "X-Accepted-GitHub-Permissions"
            ),
        )
        print("================================")


async def create_branch(
    owner: str,
    repo: str,
    branch_name: str,
    base_branch: str,
):
    """
    Create a new branch from the base branch.
    If the branch already exists, reuse it.
    """

    client = await get_github_client()

    try:
        # Get base branch
        response = await client.get(
            f"/repos/{owner}/{repo}/git/ref/heads/{base_branch}"
        )

        print_github_error(response)
        response.raise_for_status()

        base_data = response.json()
        base_sha = base_data["object"]["sha"]

        # Check whether ForgeOps branch already exists
        response = await client.get(
            f"/repos/{owner}/{repo}/git/ref/heads/{branch_name}"
        )

        if response.status_code == 200:
            print(f"Branch '{branch_name}' already exists. Reusing it.")
            return response.json()

        if response.status_code != 404:
            print_github_error(response)
            response.raise_for_status()

        # Create branch only if it doesn't exist
        response = await client.post(
            f"/repos/{owner}/{repo}/git/refs",
            json={
                "ref": f"refs/heads/{branch_name}",
                "sha": base_sha,
            },
        )

        print_github_error(response)
        response.raise_for_status()

        return response.json()

    finally:
        await client.aclose()

async def create_or_update_file(
    owner: str,
    repo: str,
    path: str,
    content: str,
    branch: str,
    commit_message: str,
):
    """
    Create or update a file in a repository.
    """

    client = await get_github_client()

    try:
        # --------------------------------
        # Encode file content
        # --------------------------------

        encoded_content = base64.b64encode(
            content.encode("utf-8")
        ).decode("utf-8")

        # --------------------------------
        # Check whether file already exists
        # --------------------------------

        response = await client.get(
            f"/repos/{owner}/{repo}/contents/{path}",
            params={
                "ref": branch,
            },
        )

        sha = None

        if response.status_code == 200:
            sha = response.json()["sha"]

        elif response.status_code != 404:
            print_github_error(response)
            response.raise_for_status()

        # --------------------------------
        # Create / update file
        # --------------------------------

        payload = {
            "message": commit_message,
            "content": encoded_content,
            "branch": branch,
        }

        if sha:
            payload["sha"] = sha

        response = await client.put(
            f"/repos/{owner}/{repo}/contents/{path}",
            json=payload,
        )

        print_github_error(response)

        response.raise_for_status()

        return response.json()

    finally:
        await client.aclose()


async def create_pull_request(
    owner: str,
    repo: str,
    title: str,
    body: str,
    head: str,
    base: str,
):
    """
    Create a Pull Request.
    """

    client = await get_github_client()

    try:
        response = await client.post(
            f"/repos/{owner}/{repo}/pulls",
            json={
                "title": title,
                "body": body,
                "head": head,
                "base": base,
            },
        )

        print_github_error(response)

        response.raise_for_status()

        return response.json()

    finally:
        await client.aclose()