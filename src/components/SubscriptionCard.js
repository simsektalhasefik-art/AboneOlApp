import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Popüler servislerin marka slug'ları
const LOGO_MAPPING = {
  spotify: 'spotify',
  netflix: 'netflix',
  exxen: 'exxen',
  youtube: 'youtube',
  disney: 'disneyplus',
  prime: 'amazonprime',
  apple: 'apple'
};

export default function SubscriptionCard({ item, onDelete, onCancel }) {
  const getLogoUrl = (name) => {
    if (!name) return null;
    const cleanName = name.toLowerCase().trim();
    for (const key in LOGO_MAPPING) {
      if (cleanName.includes(key)) {
        return `https://cdn.simpleicons.org/${LOGO_MAPPING[key]}`;
      }
    }
    return null;
  };

  const logoUrl = getLogoUrl(item.name);

  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          {logoUrl ? (
            <Image source={{ uri: logoUrl }} style={styles.logoImage} resizeMode="contain" />
          ) : (
            <Ionicons name="card-outline" size={24} color="#3b82f6" />
          )}
        </View>
        <View>
          <Text style={styles.title}>{item.name}</Text>

          <Text style={styles.subtitle}>
            {item.category || 'Genel'} • Ayın {item.billingDay || '1'}. günü
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.price}>{item.price} ₺</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => onCancel(item.id)}>
            <Text style={styles.cancelText}>İptal Et</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 26,
    height: 26,
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  price: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cancelBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cancelText: {
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 2,
  }
});
