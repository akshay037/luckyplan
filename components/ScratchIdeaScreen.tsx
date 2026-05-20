import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ScratchCard } from './ScratchCard';

export type ScratchCategory = 'girl' | 'boy' | 'couple';

type Props = {
  idea: string;
  category: ScratchCategory;
  onBack: () => void;
};

const categoryTitle: Record<ScratchCategory, string> = {
  girl: 'Girl',
  boy: 'Boy',
  couple: 'Couple',
};

export function ScratchIdeaScreen({ idea, category, onBack }: Props) {
  return (

    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.badge}>🎁 Scratch Coupon</Text>
        <Text style={styles.heading}>Your Surprise Date Idea</Text>
        <Text style={styles.subheading}>
          {categoryTitle[category]} Edition
        </Text>
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.hint}>
          Scratch the card below to reveal your idea
        </Text>
        <View style={styles.cardWrap}>
          <ScratchCard key={idea} idea={idea} />
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 40,
  },

  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },

  cardContainer: {
    marginTop: 100,
  },

  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 10,
  },

  backText: {
    fontSize: 15,
    color: '#2D6CDF',
    fontWeight: '600',
  },

  badge: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6C5CE7',
    backgroundColor: '#EDEAFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },

  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },

  subheading: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 6,
  },

  hint: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 14,
  },

  cardWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },

});