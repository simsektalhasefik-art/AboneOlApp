import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function SubscriptionCard({ item, onDelete, onCancel, onEdit }) {
  
  // Güvenli ve Renkli İkon Eşleşmesi
  const renderLogo = (name) => {
    const cleanName = (name || '').toLowerCase().trim();

    if (cleanName.includes('spotify')) {
      return <FontAwesome5 name="spotify" size={24} color="#1DB954" />;
    }
    if (cleanName.includes('netflix')) {
      return <MaterialCommunityIcons name="netflix" size={28} color="#E50914" />;
    }
    if (cleanName.includes('youtube')) {
      return <FontAwesome5 name="youtube" size={22} color="#FF0000" />;
    }
    if (cleanName.includes('exxen')) {
      return <MaterialCommunityIcons name="play-box" size={26} color="#FACC15" />;
    }
    if (cleanName.includes('amazon') || cleanName.includes('prime')) {
      return <FontAwesome5 name="amazon" size={22} color="#00A8E1" />;
    }
    if (cleanName.includes('icloud') || cleanName.includes('apple')) {
      return <FontAwesome5 name="apple" size={24} color="#A2AAAD" />;
    }

    return <Ionicons name="card-outline" size={24} color="#6366f1" />;
  };

  const isYearly = item.period === 'yearly';
  const monthlyDisplayPrice = isYearly ? (Number(item.price) / 12).toFixed(2) : item.price;

  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          {renderLogo(item.name)}
        </View>
        <View>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>
            {item.category || 'Genel'} • Ayın {item.billingDay || '1'}. günü
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{item.price} ₺</Text>
          <Text style={styles.periodBadge}>{isYearly ? '/ yıl' : '/ ay'}</Text>
        </View>
        
        {isYearly && (
          <Text style={styles.monthlyEquivalent}>({monthlyDisplayPrice} ₺/ay)</Text>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item)}>
            <Ionicons name="pencil-outline" size={16} color="#60a5fa" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => onCancel(item.id)}>
            <Text style={styles.cancelText}>İptal Et</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={16} color="#ef4444" />
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
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
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
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  price: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  periodBadge: {
    color: '#94a3b8',
    fontSize: 11,
  },
  monthlyEquivalent: {
    color: '#38bdf8',
    fontSize: 10,
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  editBtn: {
    padding: 4,
    backgroundColor: '#0f172a',
    borderRadius: 6,
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
    padding: 4,
    backgroundColor: '#0f172a',
    borderRadius: 6,
  }
});
