import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function TimelineScreen({ subscriptions }) {
  // Günlere göre sırala (1'den 31'e)
  const sorted = [...subscriptions].sort((a, b) => a.dueDate - b.dueDate);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Ödeme Haritası & Zaman Çizelgesi</Text>
      <Text style={styles.subTitle}>Bu ay ödemelerinizin günlere göre dağılımı:</Text>
      
      {sorted.length === 0 ? (
        <Text style={styles.emptyText}>Henüz ödeme eklenmedi.</Text>
      ) : (
        sorted.map((item, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.dayBadge}>
              <Text style={styles.dayText}>{item.dueDate}</Text>
              <Text style={styles.monthText}>GÜN</Text>
            </View>
            <View style={styles.line} />
            <View style={styles.detailsCard}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
              <Text style={styles.itemPrice}>{item.price} ₺</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 16 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginTop: 40 },
  subTitle: { color: '#64748B', fontSize: 13, marginBottom: 20, marginTop: 4 },
  emptyText: { color: '#94A3B8', marginTop: 20, textAlign: 'center' },
  timelineItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  dayBadge: { backgroundColor: '#4F46E5', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  dayText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  monthText: { color: '#C7D2FE', fontSize: 8 },
  line: { width: 20, height: 2, backgroundColor: '#334155' },
  detailsCard: { flex: 1, backgroundColor: '#1E293B', padding: 12, borderRadius: 10 },
  itemTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  itemCategory: { color: '#64748B', fontSize: 11 },
  itemPrice: { color: '#38BDF8', fontWeight: 'bold', marginTop: 4 }
});