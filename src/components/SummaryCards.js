import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SummaryCards({ subscriptions }) {
  // Toplam Aylık Harcamayı Hesapla
  const monthlyTotal = subscriptions.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    return sum + (item.billingCycle === 'Yıllık' ? price / 12 : price);
  }, 0);

  const dailyTotal = monthlyTotal / 30;
  const weeklyTotal = (monthlyTotal / 30) * 7;

  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.mainCard]}>
        <Text style={styles.cardTitle}>Aylık Toplam</Text>
        <Text style={styles.mainPrice}>{monthlyTotal.toFixed(2)} ₺</Text>
      </View>
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Günlük Ort.</Text>
          <Text style={styles.subPrice}>{dailyTotal.toFixed(2)} ₺</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Haftalık Ort.</Text>
          <Text style={styles.subPrice}>{weeklyTotal.toFixed(2)} ₺</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  mainCard: { backgroundColor: '#4F46E5', marginBottom: 10 },
  card: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  cardTitle: { color: '#94A3B8', fontSize: 12, fontWeight: 'bold' },
  mainPrice: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginTop: 4 },
  subPrice: { color: '#38BDF8', fontSize: 18, fontWeight: 'bold', marginTop: 4 }
});