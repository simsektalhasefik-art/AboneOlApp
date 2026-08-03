import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, TouchableOpacity } from 'react-native';

export default function AddModal({ visible, initialData, servicesData, onClose, onSave }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [billingDay, setBillingDay] = useState('');
  const [category, setCategory] = useState('Eğlence');
  const [period, setPeriod] = useState('monthly'); // 'monthly' veya 'yearly'

  // Düzenleme modunda verileri forma doldur
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setPrice(initialData.price ? String(initialData.price) : '');
      setBillingDay(initialData.billingDay ? String(initialData.billingDay) : '');
      setCategory(initialData.category || 'Eğlence');
      setPeriod(initialData.period || 'monthly');
    } else {
      setName('');
      setPrice('');
      setBillingDay('');
      setCategory('Eğlence');
      setPeriod('monthly');
    }
  }, [initialData, visible]);

  const handleSave = () => {
    if (!name || !price) return;
    onSave({
      name,
      price: Number(price),
      billingDay: Number(billingDay) || 1,
      category,
      period,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {initialData ? 'Abonelik Bilgilerini Güncelle' : 'Yeni Abonelik / Ödeme Ekle'}
          </Text>

          {/* Abonelik Adı Input */}
          <TextInput
            placeholder="Abonelik Adı (ör: Netflix)"
            placeholderTextColor="#64748b"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          {/* Ödeme Periyodu Seçimi (Aylık / Yıllık) */}
          <View style={styles.periodSelector}>
            <TouchableOpacity
              style={[styles.periodOption, period === 'monthly' && styles.periodActive]}
              onPress={() => setPeriod('monthly')}
            >
              <Text style={[styles.periodText, period === 'monthly' && styles.periodTextActive]}>Aylık Ödeme</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.periodOption, period === 'yearly' && styles.periodActive]}
              onPress={() => setPeriod('yearly')}
            >
              <Text style={[styles.periodText, period === 'yearly' && styles.periodTextActive]}>Yıllık Ödeme</Text>
            </TouchableOpacity>
          </View>

          {/* Tutar Input */}
          <TextInput
            placeholder={period === 'yearly' ? 'Yıllık Tutar (₺)' : 'Aylık Tutar (₺)'}
            placeholderTextColor="#64748b"
            keyboardType="numeric"
            style={styles.input}
            value={price}
            onChangeText={setPrice}
          />

          {/* Ödeme Günü Input */}
          <TextInput
            placeholder="Ödeme Günü (Ayın kaçıncı günü: 1-31)"
            placeholderTextColor="#64748b"
            keyboardType="numeric"
            style={styles.input}
            value={billingDay}
            onChangeText={setBillingDay}
          />

          {/* Butonlar */}
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelModalBtn} onPress={onClose}>
              <Text style={styles.btnText}>Vazgeç</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveModalBtn} onPress={handleSave}>
              <Text style={[styles.btnText, { fontWeight: 'bold' }]}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20 },
  modalTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  input: { backgroundColor: '#0f172a', color: '#ffffff', padding: 12, borderRadius: 8, marginBottom: 12 },
  periodSelector: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  periodOption: { flex: 1, padding: 10, backgroundColor: '#0f172a', borderRadius: 8, alignItems: 'center' },
  periodActive: { backgroundColor: '#4f46e5' },
  periodText: { color: '#94a3b8', fontSize: 13 },
  periodTextActive: { color: '#ffffff', fontWeight: 'bold' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelModalBtn: { flex: 1, backgroundColor: '#334155', padding: 12, borderRadius: 8, alignItems: 'center' },
  saveModalBtn: { flex: 1, backgroundColor: '#6366f1', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#ffffff' },
});
