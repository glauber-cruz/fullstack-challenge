export class CursorPagination {
  static create(results: any[], limit: number) {
    const hasMore = results.length > limit;
    const nextCursor = hasMore ? results[results.length - 1].id : null;

    return {
      nextCursor,
      limit,
      results: hasMore ? results.slice(0, limit) : results,
    };
  }
}
