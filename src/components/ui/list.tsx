import { FlashList, FlashListProps } from '@shopify/flash-list';
import React, { forwardRef } from 'react';

/**
 * Generic wrapper component for FlashList with standardized usage patterns.
 *
 * @template ItemT - The type of items in the list data array
 *
 * @example
 * ```typescript
 * interface TodoItem {
 *   id: string;
 *   title: string;
 *   completed: boolean;
 * }
 *
 * <List
 *   data={todos}
 *   renderItem={({ item }) => <TodoItemComponent item={item} />}
 *   keyExtractor={(item) => item.id}
 *   ListEmptyComponent={isLoading ? <SkeletonList/> : error ? <ErrorIllustration /> : <EmptyState />}
 *   ListFooterComponent={isLoading ? <LoadingSkeleton /> : null}
 * />
 * ```
 *
 * @remarks
 * **Required Usage Patterns:**
 *
 * 1. **ListEmptyComponent** - MUST be used for all empty states:
 *    - Skeleton loading state when initially loading data
 *    - Error state when data fetch fails
 *    - Empty state when no data exists
 *    - Use conditional rendering based on your loading/error states
 *
 * 2. **ListFooterComponent** - MUST be used for pagination loading:
 *    - Show a single item loading skeleton when `hasNextPage` or similar is true
 *    - Should only render when there's more data to load
 *    - Keep it minimal - typically just one skeleton item
 *
 * 3. **Performance Considerations:**
 *    - Always provide `keyExtractor` for optimal performance
 *    - Consider setting `estimatedItemSize` for better initial render
 *    - Use `getEstimatedItemSize` if items have varying heights
 *
 * @param props - All flashlist props with ItemT generic type
 */
const List = forwardRef<FlashList<any>, FlashListProps<any>>((props, ref) => {
  return <FlashList {...props} ref={ref} />;
});

export default List;
