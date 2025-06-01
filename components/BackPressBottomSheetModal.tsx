import { BottomSheetModal, BottomSheetModalProps } from "@gorhom/bottom-sheet";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { BackHandler } from "react-native";

// eslint-disable-next-line react/display-name
export const BackPressBottomSheetModal = forwardRef<
  BottomSheetModal | null,
  BottomSheetModalProps
>(({ children, onChange, ...restProps }, forwardedRef) => {
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const modalRef = useRef<BottomSheetModal>(null);

  const onBackPress = useCallback(() => {
    if (modalRef.current !== null) {
      modalRef.current?.close();
      return true;
    }
  }, [modalRef]);

  useEffect(() => {
    if (currentIndex !== -1) {
      const re = BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => re.remove();
    }
  }, [currentIndex, onBackPress]);

  useImperativeHandle<
    BottomSheetModal | null,
    BottomSheetModal | null
  >(forwardedRef, () => {
    return modalRef.current;
  }, [modalRef]);

  return (
    <BottomSheetModal
      ref={modalRef}
      onChange={(index, position, type) => {
        setCurrentIndex(index);
        onChange?.(index, position, type);
      }}
      {...restProps}
    >
      {children}
    </BottomSheetModal>
  );
});
