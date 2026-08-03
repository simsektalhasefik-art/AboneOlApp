import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import SummaryCards from '../components/SummaryCards';
import SubscriptionCard from '../components/SubscriptionCard';

export default function HomeScreen({ subscriptions, onDelete, onOpenModal }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AboneOl</Text>
        <TouchableOpacity style={styles.addBtn} onPress={onOpenModal}>
          <Text style={styles.addBtnText}>+ Ekle</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<SummaryCards subscriptions={subscriptions} />}
        renderItem={({ item }) => (
          <SubscriptionCard item={item} onDelete={onDelete} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Henüz bir abonelik veya ödeme eklemediniz.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  addBtn: { backgroundColor: '#4F46E5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#FFF', fontWeight: 'bold' },
  empty: { color: '#64748B', textAlign: 'center', marginTop: 40 }
});