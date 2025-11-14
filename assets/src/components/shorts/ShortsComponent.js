// assets/src/components/shorts/ShortsComponent.js
import { useState, useRef } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import ShortItem from "./ShortItem";

const viewabilityConfig = {
  viewAreaCoveragePercentThreshold: 50,
};

export default function ShortsComponent({ items }) {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setVisibleIndex(viewableItems[0].index);
    }
  });

  return (
    <View
      style={styles.container}
      onLayout={(e) => setLayout(e.nativeEvent.layout)}
    >
      <FlatList
        data={items}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ShortItem
            url={item.url}
            visible={index === visibleIndex}
            layout={layout}
          />
        )}
        keyExtractor={(item) => item.id}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewRef.current}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
