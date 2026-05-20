import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import {
  ScratchIdeaScreen,
  type ScratchCategory,
} from './components/ScratchIdeaScreen';
import { BOY_IDEAS, COUPLE_IDEAS, GIRL_IDEAS } from './constants/dateIdeas';
import { shuffleDeck } from './utils/ideaDeck';

function takeNextWithoutRepeatUntilCycle(
  deckRef: React.MutableRefObject<string[]>,
  source: readonly string[],
): string {
  if (deckRef.current.length === 0) {
    deckRef.current = shuffleDeck(source);
  }
  return deckRef.current.pop()!;
}

export default function App() {
  const [screen, setScreen] = useState<'home' | 'scratch'>('home');
  const [scratchIdea, setScratchIdea] = useState('');
  const [scratchCategory, setScratchCategory] =
    useState<ScratchCategory>('girl');

  const girlDeckRef = useRef<string[]>(shuffleDeck(GIRL_IDEAS));
  const boyDeckRef = useRef<string[]>(shuffleDeck(BOY_IDEAS));
  const coupleDeckRef = useRef<string[]>(shuffleDeck(COUPLE_IDEAS));

  const openScratch = (category: ScratchCategory) => {
    const deckRef =
      category === 'girl'
        ? girlDeckRef
        : category === 'boy'
          ? boyDeckRef
          : coupleDeckRef;
    const source =
      category === 'girl' ? GIRL_IDEAS : category === 'boy' ? BOY_IDEAS : COUPLE_IDEAS;

    const idea = takeNextWithoutRepeatUntilCycle(deckRef, source);
    setScratchIdea(idea);
    setScratchCategory(category);
    setScreen('scratch');
  };

  const backFromScratch = () => {
    setScreen('home');
    setScratchIdea('');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <StatusBar style="auto" />

        {screen === 'scratch' ? (
          <ScratchIdeaScreen
            idea={scratchIdea}
            category={scratchCategory}
            onBack={backFromScratch}
          />
        ) : (
          <ScrollView
            contentContainerStyle={styles.homeScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.homeInner}>
              <Text style={styles.heading}>Choose Category</Text>
              <Text style={styles.subheading}>Select a category to get a surprise date idea</Text>
              <View style={styles.options}>
                {/* Girl */}
                <TouchableOpacity
                  style={[styles.circleButton, styles.girlBg]}
                  onPress={() => openScratch('girl')}
                >
                  <Ionicons name="woman" size={42} color="#E84393" />
                </TouchableOpacity>
                {/* Boy */}
                <TouchableOpacity
                  style={[styles.circleButton, styles.boyBg]}
                  onPress={() => openScratch('boy')}
                >
                  <Ionicons name="person" size={42} color="#2563EB" />
                </TouchableOpacity>
                {/* Couple */}
                <TouchableOpacity
                  style={[styles.circleButton, styles.coupleBg]}
                  onPress={() => openScratch('couple')}
                >
                  <Ionicons name="people" size={42} color="#F97316" />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },

  homeScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  homeInner: {
    alignItems: 'center',
  },

  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    marginBottom: 5,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },

  subheading: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },

  options: {
    flexDirection: 'row',
    gap: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  circleButton: {
    width: 95,
    height: 95,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  girlBg: {
    backgroundColor: '#FCE7F3',
  },

  boyBg: {
    backgroundColor: '#DBEAFE',
  },

  coupleBg: {
    backgroundColor: '#FFE7DB',
  },
});