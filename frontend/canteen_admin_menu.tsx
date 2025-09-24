import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, Alert, Image } from 'react-native';
import Background from './Background';
import { getItems, subscribe, setAvailable, deleteItem, SpecialItem } from './dailySpecialsStore';

interface Props {
  userName?: string;
  onBack: () => void;
  onOpenAdd: () => void;
  onOpenEdit: (id: number) => void;
}

export default function CanteenAdminMenu({ userName = 'User', onBack, onOpenAdd, onOpenEdit }: Props) {
  const [items, setItems] = useState<SpecialItem[]>(getItems());
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsub = subscribe(() => setItems(getItems()));
    return unsub;
  }, []);

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <Background>
      <View style={styles.container}>
        {/* Back button */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </View>
        {/* No profile/greeting on this screen as per request */}

        {/* Search */}
        <View style={styles.searchWrap}>
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#666"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Title + Add */}
        <View style={styles.titleRow}>
          <Text style={styles.sectionTitle}>Daily Specials</Text>
          <TouchableOpacity onPress={onOpenAdd} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add items</Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        <View style={{ gap: 14 }}>
          {filtered.map(item => (
            <View key={item.id} style={styles.card}>
              {!!item.imageUri?.trim() && (
                <Image
                  source={{ uri: item.imageUri.trim() }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
              )}
              <View style={styles.cardTopRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>₹{item.price}</Text>
                <Switch
                  value={item.available}
                  onValueChange={(val) => setAvailable(item.id, val)}
                  trackColor={{ false: '#ccc', true: '#9BE29B' }}
                  thumbColor={item.available ? '#22C55E' : '#f4f3f4'}
                />
              </View>
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.editBtn} onPress={() => onOpenEdit(item.id)}>
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => {
                    Alert.alert(
                      'Delete item',
                      `Are you sure you want to delete "${item.name}"?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Yes',
                          style: 'destructive',
                          onPress: () => deleteItem(item.id),
                        },
                      ],
                      { cancelable: true }
                    );
                  }}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 20 },
  topBar: { height: 32, justifyContent: 'center', marginBottom: 4 },
  backButton: { paddingHorizontal: 4, paddingVertical: 2 },
  backIcon: { fontSize: 22, fontWeight: '700', color: '#111' },
  
  searchWrap: { marginBottom: 18 },
  searchInput: { height: 42, borderRadius: 10, paddingHorizontal: 14, backgroundColor: 'rgba(255,255,255,0.92)', borderWidth: 1, borderColor: '#e3e3e3' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#111' },
  addButton: { paddingHorizontal: 14, paddingVertical: 6, backgroundColor: 'rgba(76,175,80,0.15)', borderRadius: 16, borderWidth: 1, borderColor: '#4CAF50' },
  addButtonText: { color: '#16A34A', fontWeight: '700' },
  card: { backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 12, borderWidth: 1, borderColor: '#e2e2e2', padding: 12, gap: 12 },
  itemImage: { width: '100%', height: 140, borderRadius: 10, backgroundColor: '#f2f2f2' },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemName: { fontSize: 18, fontWeight: '700', color: '#111' },
  itemPrice: { fontSize: 14, color: '#444', marginRight: 8 },
  actionRow: { flexDirection: 'row', gap: 12 },
  editBtn: { flex: 1, height: 38, borderRadius: 20, backgroundColor: '#e8f1ff', borderWidth: 1, borderColor: '#cfe2ff', alignItems: 'center', justifyContent: 'center' },
  deleteBtn: { flex: 1, height: 38, borderRadius: 20, backgroundColor: '#f6e5e5', borderWidth: 1, borderColor: '#f0bebe', alignItems: 'center', justifyContent: 'center' },
  actionText: { fontWeight: '700', color: '#222' },
});
