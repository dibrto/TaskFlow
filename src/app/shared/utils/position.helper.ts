import { BoardTask } from "@interfaces/board-task";

// below this gap two positions are treated as equal and the column has to be renumbered
const MIN_GAP = 1e-6;

// returns null when there is no room left at this place; the caller then renumbers the column
export default function getNewPosition(tasks: BoardTask[], index: number): number | null {
    const prev = tasks[index + 1];
    const next = tasks[index - 1];

    // empty
    if (!next && !prev) return 1000;

    // last
    if (!prev) return next.position < MIN_GAP ? null : next.position / 2;

    // first
    if (!next) return prev.position + 1000;

    // between
    if (next.position - prev.position < MIN_GAP) return null;

    return (next.position + prev.position) / 2;
}
