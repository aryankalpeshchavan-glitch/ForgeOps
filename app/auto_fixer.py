from app.github_actions import (
    create_branch,
    create_or_update_file,
    create_pull_request,
)


CI_WORKFLOW = """name: ForgeOps CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          if [ -f requirements.txt ]; then
            pip install -r requirements.txt
          fi

      - name: Run tests
        run: |
          if [ -d tests ]; then
            pytest
          else
            echo "No tests directory found."
          fi
"""


async def fix_ci(
    owner: str,
    repo: str,
    base_branch: str,
):
    """
    Create a CI workflow through a new branch
    and open a Pull Request.
    """

    branch_name = "forgeops/fix-ci"

    # 1. Create branch

    await create_branch(
        owner=owner,
        repo=repo,
        branch_name=branch_name,
        base_branch=base_branch,
    )

    # 2. Create workflow

    await create_or_update_file(
        owner=owner,
        repo=repo,
        path=".github/workflows/ci.yml",
        content=CI_WORKFLOW,
        branch=branch_name,
        commit_message="Add ForgeOps CI workflow",
    )

    # 3. Create Pull Request

    pull_request = await create_pull_request(
        owner=owner,
        repo=repo,
        title="Add CI workflow",
        body=(
            "## ForgeOps Automated Fix\n\n"
            "ForgeOps detected that this repository "
            "does not have a GitHub Actions CI workflow.\n\n"
            "This Pull Request adds a basic Python CI workflow."
        ),
        head=branch_name,
        base=base_branch,
    )

    return {
        "branch": branch_name,
        "pull_request": {
            "number": pull_request["number"],
            "title": pull_request["title"],
            "url": pull_request["html_url"],
        },
    }