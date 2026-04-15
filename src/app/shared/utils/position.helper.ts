import { BoardTask } from "@interfaces/board";

export default function getNewPosition(tasks: BoardTask[], index: number) {
    const prev = tasks[index + 1];
    const next = tasks[index - 1];

    // empty
    if (!next && !prev) return 1000;

    // last
    if (!prev) return next.position / 2;

    // first
    if (!next) return prev.position + 1000;

    // between
    return (next.position + prev.position) / 2;
}
