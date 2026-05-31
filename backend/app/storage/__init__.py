from pathlib import Path
from typing import Protocol


class PrivateStorage(Protocol):
    def put(self, key: str, content: bytes, *, content_type: str) -> None:
        pass

    def get(self, key: str) -> bytes:
        pass


class InMemoryPrivateStorage:
    def __init__(self) -> None:
        self._objects: dict[str, bytes] = {}

    def put(self, key: str, content: bytes, *, content_type: str) -> None:
        self._objects[key] = content

    def get(self, key: str) -> bytes:
        if key in self._objects:
            return self._objects[key]
        if key.startswith("dev-seed/"):
            return _dev_seed_placeholder_content(key)
        raise KeyError(key)


class LocalPrivateStorage:
    def __init__(self, root_path: str | Path) -> None:
        self._root_path = Path(root_path).resolve()

    def put(self, key: str, content: bytes, *, content_type: str) -> None:
        path = self._path_for_key(key)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)

    def get(self, key: str) -> bytes:
        path = self._path_for_key(key)
        if not path.is_file():
            if key.startswith("dev-seed/"):
                return _dev_seed_placeholder_content(key)
            raise KeyError(key)
        return path.read_bytes()

    def _path_for_key(self, key: str) -> Path:
        path = (self._root_path / key).resolve()
        if not path.is_relative_to(self._root_path):
            raise KeyError(key)
        return path


def _dev_seed_placeholder_content(key: str) -> bytes:
    if key.endswith(".png"):
        return b"\x89PNG\r\n\x1a\nipb-smart-reserve-hub-dev-seed"
    return b"%PDF-1.4\nipb-smart-reserve-hub-dev-seed\n%%EOF"
