import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import { useTheme } from "@/hooks/useTheme";
import { BackPressBottomSheetModal } from "@/components/BackPressBottomSheetModal";
import { ThemedText } from "@/components/ThemedText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// eslint-disable-next-line react/display-name
export const TranslationResultSheet = forwardRef<BottomSheetModal, any>(
  (_props, ref) => {
    const { surfaceContainer, onSurfaceVariant, green, red } = useTheme();

    return (
      <BackPressBottomSheetModal<boolean>
        ref={ref}
        style={{ backgroundColor: surfaceContainer, borderRadius: 50 }}
        handleIndicatorStyle={{ backgroundColor: onSurfaceVariant }}
        backgroundStyle={{ backgroundColor: surfaceContainer }}
        enableDismissOnClose
        stackBehavior={"push"}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...{
              appearsOnIndex: 0,
              disappearsOnIndex: -1,
              pressBehavior: "none",
              ...props,
            }}
          />
        )}
      >
        {(data) => {
          if (data.data === undefined) {
            return null;
          }

          return (
            <BottomSheetView
              style={{
                display: "flex",
                padding: 20,
                paddingBottom: 50,
                gap: 20,
                alignItems: "center",
              }}
            >
              {data.data ? (
                <>
                  <MaterialIcons
                    name="sentiment-very-dissatisfied"
                    color={red}
                    size={64}
                  />
                  <ThemedText type={"title"}>
                    This food is not safe to consume!
                  </ThemedText>
                </>
              ) : (
                <>
                  <MaterialIcons
                    name="sentiment-very-satisfied"
                    color={green}
                    size={64}
                  />
                  <ThemedText type={"title"}>
                    This food is safe to consume!
                  </ThemedText>
                </>
              )}
            </BottomSheetView>
          );
        }}
      </BackPressBottomSheetModal>
    );
  },
);
