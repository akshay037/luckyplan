import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Canvas,
  Group,
  LinearGradient,
  Path,
  Rect,
  RoundedRect,
  Skia,
  vec,
} from '@shopify/react-native-skia';

const { width } = Dimensions.get('window');

type ScratchCardProps = {
  idea: string;
};

export function ScratchCard({ idea }: ScratchCardProps) {
  const CARD_WIDTH = Math.min(width - 40, 360);
  const CARD_HEIGHT = 240;
  const RADIUS = 24;

  /** Skia often paints one frame after layout; hiding text until then avoids a flash through a transparent canvas. */
  const [paintFoilFirst, setPaintFoilFirst] = useState(false);

  useLayoutEffect(() => {
    setPaintFoilFirst(false);
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setPaintFoilFirst(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [idea]);

  const [paths, setPaths] = useState<any[]>([]);
  const currentPath = useRef<any>(null);

  const createPath = (x: number, y: number) => {
    const path = Skia.Path.Make();
    path.moveTo(x, y);
    currentPath.current = path;
    setPaths((prev) => [...prev, path]);
  };

  const updatePath = (x: number, y: number) => {
    currentPath.current?.lineTo(x, y);
    setPaths((prev) => [...prev]);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      createPath(locationX, locationY);
    },

    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      updatePath(locationX, locationY);
    },
  });

  return (
    <View
      style={[
        styles.card,
        {
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
        },
      ]}
      {...panResponder.panHandlers}
    >
      {/* REVEALED CONTENT (mounted after foil so it does not flash through Skia before first paint) */}
      <View style={styles.content}>
        {paintFoilFirst ? (
          <Text style={styles.idea}>{idea}</Text>
        ) : (
          <View style={styles.ideaPlaceholder} />
        )}
      </View>

      {/* SCRATCH LAYER */}
      <Canvas style={StyleSheet.absoluteFillObject}>
        <Group>
          {/* BASE FOIL BACKGROUND (not flat anymore) */}
          <RoundedRect
            x={0}
            y={0}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            r={RADIUS}
          >
            <LinearGradient
              start={vec(0, 0)}
              end={vec(CARD_WIDTH, CARD_HEIGHT)}
              colors={[
                '#2c2c2c',
                '#6b6b6b',
                '#d6d6d6',
                '#ffffff',
                '#c2c2c2',
                '#4a4a4a',
                '#1f1f1f',
              ]}
            />
          </RoundedRect>

          {/* STRONG FOIL SHINE BAND (key realism layer) */}
          <Rect
            x={-CARD_WIDTH}
            y={CARD_HEIGHT * 0.1}
            width={CARD_WIDTH * 3}
            height={CARD_HEIGHT * 0.25}
            transform={[{ rotate: -0.55 }]}
          >
            <LinearGradient
              start={vec(0, 0)}
              end={vec(CARD_WIDTH * 2, 0)}
              colors={[
                'rgba(255,255,255,0)',
                'rgba(255,255,255,0.15)',
                'rgba(255,255,255,0.85)',
                'rgba(255,255,255,0.15)',
                'rgba(255,255,255,0)',
              ]}
            />
          </Rect>

          {/* SECONDARY SOFT GLOW */}
          <Rect
            x={-CARD_WIDTH * 0.2}
            y={CARD_HEIGHT * 0.6}
            width={CARD_WIDTH * 1.5}
            height={CARD_HEIGHT * 0.2}
            transform={[{ rotate: 0.4 }]}
          >
            <LinearGradient
              start={vec(0, 0)}
              end={vec(CARD_WIDTH, 0)}
              colors={[
                'rgba(255,255,255,0)',
                'rgba(255,255,255,0.25)',
                'rgba(255,255,255,0)',
              ]}
            />
          </Rect>

          {/* SUBTLE NOISE / GRAIN LAYER (fake but effective) */}
          <RoundedRect
            x={0}
            y={0}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            r={RADIUS}
            opacity={0.05}
          >
            <LinearGradient
              start={vec(0, 0)}
              end={vec(CARD_WIDTH, CARD_HEIGHT)}
              colors={[
                '#000000',
                '#ffffff',
                '#000000',
                '#ffffff',
              ]}
            />
          </RoundedRect>

          {/* DEPTH DARK EDGE */}
          <RoundedRect
            x={0}
            y={0}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            r={RADIUS}
            color="rgba(0,0,0,0.08)"
          />

          {/* SCRATCH ERASE LAYERS */}
          {paths.map((path, index) => (
            <Path
              key={index}
              path={path}
              color="transparent"
              style="stroke"
              strokeWidth={50}
              strokeCap="round"
              strokeJoin="round"
              blendMode="clear"
            />
          ))}
        </Group>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 12,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },

  idea: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
  },

  ideaPlaceholder: {
    minHeight: 56,
    width: '100%',
  },
});
