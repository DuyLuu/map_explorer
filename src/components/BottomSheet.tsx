import React, { forwardRef, useMemo } from 'react'
import { ViewStyle } from 'react-native'
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
  BottomSheetScrollView,
  type BottomSheetProps as GorhomBottomSheetProps
} from '@gorhom/bottom-sheet'

export interface BottomSheetProps extends Omit<GorhomBottomSheetProps, 'snapPoints'> {
  /** Snap points for the bottom sheet. Can be percentages (e.g., ['25%', '50%', '90%']) or pixel values */
  snapPoints?: (string | number)[]
  /** Whether to show backdrop */
  enableBackdrop?: boolean
  /** Custom backdrop opacity */
  backdropOpacity?: number
  /** Custom container style */
  containerStyle?: ViewStyle
  /** Custom backdrop style */
  backdropStyle?: ViewStyle
}

/**
 * Simple BottomSheet component wrapping @gorhom/bottom-sheet
 *
 * Features:
 * - Configurable snap points
 * - Optional backdrop with customizable opacity
 * - Forward ref support for accessing bottom sheet methods
 * - Clean API without complex theme integration
 *
 * @example
 * ```tsx
 * const bottomSheetRef = useRef<BottomSheet>(null)
 *
 * const handleOpen = () => bottomSheetRef.current?.expand()
 * const handleClose = () => bottomSheetRef.current?.close()
 *
 * return (
 *   <BottomSheet
 *     ref={bottomSheetRef}
 *     snapPoints={['25%', '50%', '90%']}
 *     enableBackdrop
 *     backdropOpacity={0.3}
 *     index={-1}
 *   >
 *     <BottomSheetView style={{ padding: 20 }}>
 *       <Text>Bottom Sheet Content</Text>
 *     </BottomSheetView>
 *   </BottomSheet>
 * )
 * ```
 */
export const BottomSheet = forwardRef<GorhomBottomSheet, BottomSheetProps>(
  (
    {
      snapPoints = ['25%', '50%', '90%'],
      enableBackdrop = true,
      backdropOpacity = 0.3,
      containerStyle,
      backdropStyle,
      children,
      ...props
    },
    ref
  ) => {
    // Memoize snap points to avoid unnecessary re-renders
    const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints])

    // Backdrop component
    const renderBackdrop = useMemo(
      () => (backdropProps: BottomSheetBackdropProps) =>
        <BottomSheetBackdrop {...backdropProps} opacity={backdropOpacity} style={backdropStyle} />,
      [backdropOpacity, backdropStyle]
    )

    return (
      <GorhomBottomSheet
        ref={ref}
        snapPoints={memoizedSnapPoints}
        backdropComponent={enableBackdrop ? renderBackdrop : undefined}
        style={containerStyle}
        {...props}
      >
        {children}
      </GorhomBottomSheet>
    )
  }
)

BottomSheet.displayName = 'BottomSheet'

// Re-export useful bottom sheet components for convenience
export { BottomSheetView, BottomSheetScrollView }

export default BottomSheet
