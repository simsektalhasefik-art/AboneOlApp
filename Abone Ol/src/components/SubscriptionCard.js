import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SubscriptionCard({ item, onDelete }) {
  const handleCancel = () => {
    if (item.cancelUrl) {
      Linking.openURL(item.cancelUrl).catch(() => {
        Alert.alert('Hata', 'İptal sayfası açılamadı.');
      });
    } else {
      Alert.alert('Bilgi', 'Bu özel kategori için otomatik iptal linki bulunmuyor.');
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <View style={[styles.iconBox, { backgroundColor: item.color || '#6366F1' }]}>
          <Ionicons name={item.icon || 'card'} size={24} color="#FFF" />
        </View>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.category} • Ayın {item.dueDate}. günü</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.price}>{item.price} ₺</Text>
        <View style={styles.actions}>
          {item.cancelUrl && (
            <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>İptal Et</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  leftSection: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  name: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  category: { color: '#64748B', fontSize: 12, marginTop: 2 },
  rightSection: { alignItems: 'flex-end' },
  price: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold' },
  actions: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  cancelBtn: { backgroundColor: '#334155', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 8 },
  cancelText: { color: '#F59E0B', fontSize: 11, fontWeight: 'bold' },
  deleteBtn: { padding: 4 }
});