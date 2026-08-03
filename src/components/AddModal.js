import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { PREDEFINED_SERVICES, INITIAL_CATEGORIES } from '../data/servicesData';

export default function AddModal({ visible, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState(INITIAL_CATEGORIES[0]);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [newCatInput, setNewCatInput] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);

  const handleSelectPreset = (service) => {
    setSelectedPreset(service);
    setName(service.name);
    setCategory(service.category);
  };

  const handleAddCategory = () => {
    if (newCatInput.trim()) {
      const updated = [...categories, newCatInput.trim()];
      setCategories(updated);
      setCategory(newCatInput.trim());
      setNewCatInput('');
    }
  };

  const handleSubmit = () => {
    if (!name || !price || !dueDate) return;
    
    onAdd({
      id: Date.now().toString(),
      name,
      price: parseFloat(price),
      dueDate: parseInt(dueDate),
      category,
      billingCycle: 'Aylık',
      color: selectedPreset ? selectedPreset.color : '#6366F1',
      icon: selectedPreset ? selectedPreset.icon : 'card',
      cancelUrl: selectedPreset ? selectedPreset.cancelUrl : null
    });

    // Formu Sıfırla
    setName(''); setPrice(''); setDueDate(''); setSelectedPreset(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Yeni Abonelik / Ödeme Ekleyin</Text>
          <ScrollView style={{ maxHeight: 400 }}>
            <Text style={styles.label}>Hızlı Seçim (Global Servisler):</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetRow}>
              {PREDEFINED_SERVICES.map((s, idx) => (
                <TouchableOpacity key={idx} style={[styles.chip, selectedPreset?.name === s.name && styles.activeChip]} onPress={() => handleSelectPreset(s)}>
                  <Text style={styles.chipText}>{s.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TextInput placeholder="Abonelik Adı (örn: Spor Salonu)" placeholderTextColor="#64748B" style={styles.input} value={name} onChangeText={setName} />
            <TextInput placeholder="Aylık Tutar (₺)" placeholderTextColor="#64748B" keyboardType="numeric" style={styles.input} value={price} onChangeText={setPrice} />
            <TextInput placeholder="Ödeme Günü (Ayın Kaçıncı Günü? 1-31)" placeholderTextColor="#64748B" keyboardType="numeric" style={styles.input} value={dueDate} onChangeText={setDueDate} />

            <Text style={styles.label}>Kategori Seçin:</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat, idx) => (
                <TouchableOpacity key={idx} style={[styles.catChip, category === cat && styles.activeCatChip]} onPress={() => setCategory(cat)}>
                  <Text style={{ color: category === cat ? '#FFF' : '#94A3B8', fontSize: 12 }}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.addCatRow}>
              <TextInput placeholder="Yeni Kategori Ekle..." placeholderTextColor="#64748B" style={[styles.input, { flex: 1, marginBottom: 0 }]} value={newCatInput} onChangeText={setNewCatInput} />
              <TouchableOpacity style={styles.addCatBtn} onPress={handleAddCategory}>
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>+</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}><Text style={{ color: '#FFF' }}>Vazgeç</Text></TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}><Text style={{ color: '#FFF', fontWeight: 'bold' }}>Kaydet</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1E293B', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  title: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  label: { color: '#94A3B8', fontSize: 12, marginTop: 10, marginBottom: 5 },
  input: { backgroundColor: '#0F172A', color: '#FFF', padding: 12, borderRadius: 8, marginBottom: 10 },
  presetRow: { marginBottom: 10 },
  chip: { backgroundColor: '#334155', padding: 8, borderRadius: 8, marginRight: 6 },
  activeChip: { backgroundColor: '#4F46E5' },
  chipText: { color: '#FFF', fontSize: 12 },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  catChip: { backgroundColor: '#0F172A', padding: 6, borderRadius: 6, marginRight: 6, marginBottom: 6 },
  activeCatChip: { backgroundColor: '#4F46E5' },
  addCatRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  addCatBtn: { backgroundColor: '#10B981', padding: 12, borderRadius: 8, marginLeft: 8 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelBtn: { backgroundColor: '#475569', padding: 12, borderRadius: 8, flex: 1, marginRight: 5, alignItems: 'center' },
  saveBtn: { backgroundColor: '#4F46E5', padding: 12, borderRadius: 8, flex: 1, marginLeft: 5, alignItems: 'center' }
});