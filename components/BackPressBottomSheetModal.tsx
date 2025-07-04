import { BottomSheetModal, BottomSheetModalProps } from "@gorhom/bottom-sheet";
import {
  RefAttributes,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { BackHandler } from "react-native";

export const BackPressBottomSheetModal = <T,>({
  children,
  onChange,
  ref,
  ...restProps
}: BottomSheetModalProps<T> & RefAttributes<BottomSheetModal>) => {
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
  >(ref, () => {
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
};
