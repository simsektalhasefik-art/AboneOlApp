import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import SubscriptionCard from './src/components/SubscriptionCard';

export default function App() {
  const [subscriptions, setSubscriptions] = useState([
    { id: '1', name: 'Spotify', price: 234, category: 'Müzik', billingDay: 3 },
    { id: '2', name: 'Netflix', price: 234, category: 'Eğlence', billingDay: 5 },
    { id: '3', name: 'Exxen', price: 567, category: 'Eğlence', billingDay: 15 },
  ]);

  // Toplam Hesaplamalar
  const monthlyTotal = subscriptions.reduce((sum, item) => sum + Number(item.price), 0);
  const yearlyTotal = monthlyTotal * 12;
  const dailyAvg = (monthlyTotal / 30).toFixed(2);

  // Tasarruf Analizi Mantığı
  const entertainmentSubs = subscriptions.filter(s => s.category === 'Eğlence' || ['netflix', 'exxen', 'disney'].some(k => s.name.toLowerCase().includes(k)));
  const hasMultipleEntertainment = entertainmentSubs.length > 1;

  const handleDelete = (id) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

  const handleCancel = (id) => {
    alert("İptal hatırlatıcısı takviminize eklendi!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AboneOl</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Ekle</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Ana Özet Kartı */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Aylık Toplam Harcama</Text>
          <Text style={styles.summaryValue}>{monthlyTotal.toFixed(2)} ₺</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Günlük Ort.</Text>
              <Text style={styles.statValue}>{dailyAvg} ₺</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Tahmini Yıllık</Text>
              <Text style={styles.statValue}>{yearlyTotal} ₺</Text>
            </View>
          </View>
        </View>

        {/* 💡 Akıllı Tasarruf Analizi Kartı */}
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Ionicons name="bulb-outline" size={22} color="#fbbf24" />
            <Text style={styles.insightTitle}>Tasarruf Analizi</Text>
          </View>
          
          {hasMultipleEntertainment ? (
            <Text style={styles.insightText}>
              Birden fazla ({entertainmentSubs.length} adet) dizi/film platformuna üyesiniz. Yılda toplam <Text style={styles.highlightText}>{(entertainmentSubs.reduce((a,b)=>a+b.price,0)*12)} ₺</Text> harcıyorsunuz. Birini askıya alarak tasarruf edebilirsiniz!
            </Text>
          ) : (
            <Text style={styles.insightText}>
              Abonelikleriniz dengeli görünüyor! Yıllık ödeme planlarına geçerek %15'e varan indirim kazanabilirsiniz.
            </Text>
          )}
        </View>

        {/* Abonelik Listesi Header */}
        <Text style={styles.sectionTitle}>Abonelikleriniz ({subscriptions.length})</Text>

        {/* Liste */}
        {subscriptions.map((item) => (
          <SubscriptionCard 
            key={item.id} 
            item={item} 
            onDelete={handleDelete}
            onCancel={handleCancel}
          />
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1329',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  addBtn: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  addBtnText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  summaryCard: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  summaryLabel: {
    color: '#c7d2fe',
    fontSize: 14,
  },
  summaryValue: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 8,
  },
  statLabel: {
    color: '#e0e7ff',
    fontSize: 11,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 2,
  },
  insightCard: {
    backgroundColor: '#1e1b4b',
    borderColor: '#4338ca',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  insightTitle: {
    color: '#fbbf24',
    fontWeight: 'bold',
    fontSize: 15,
  },
  insightText: {
    color: '#c7d2fe',
    fontSize: 13,
    lineHeight: 18,
  },
  highlightText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
});
