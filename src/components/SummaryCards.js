import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SummaryCards({ subscriptions = [], monthlyTotal }) {
  // Eğer dışarıdan monthlyTotal gelmediyse, düşmesini engellemek için güvenli hesapla
  const safeList = Array.isArray(subscriptions) ? subscriptions : [];
  
  const computedTotal = monthlyTotal !== undefined 
    ? monthlyTotal 
    : safeList.reduce((sum, item) => sum + Number(item?.price || 0), 0);

  const dailyAvg = (computedTotal / 30).toFixed(2);
  const weeklyAvg = (computedTotal / 4).toFixed(2);

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryLabel}>Aylık Toplam Harcama</Text>
      <Text style={styles.summaryValue}>{computedTotal.toFixed(2)} ₺</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Günlük Ort.</Text>
          <Text style={styles.statValue}>{dailyAvg} ₺</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Haftalık Ort.</Text>
          <Text style={styles.statValue}>{weeklyAvg} ₺</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: { backgroundColor: '#4f46e5', borderRadius: 16, padding: 20, marginBottom: 16 },
  summaryLabel: { color: '#c7d2fe', fontSize: 14 },
  summaryValue: { color: '#ffffff', fontSize: 32, fontWeight: 'bold', marginVertical: 8 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  statBox: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 10, borderRadius: 8 },
  statLabel: { color: '#e0e7ff', fontSize: 11 },
  statValue: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', marginTop: 2 }
});
