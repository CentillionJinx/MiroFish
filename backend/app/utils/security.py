import re

def is_safe_id(identifier: str) -> bool:
    """
    Checks if the given identifier is safe to use in file paths.
    Only allows alphanumeric characters, underscores, and hyphens.

    Args:
        identifier: The identifier to check (e.g., simulation_id, report_id, project_id)

    Returns:
        bool: True if safe, False otherwise
    """
    if not identifier or not isinstance(identifier, str):
        return False
    return bool(re.match(r'^[a-zA-Z0-9_-]+$', identifier))
