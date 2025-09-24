import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import Background from './Background';
import { getItems, updateItem } from './dailySpecialsStore';

interface Props {
  itemId: number;
  onDone: () => void;
  onBack?: () => void;
  userName?: string;
}

export default function CanteenAdminEditItem({ itemId, onDone, onBack, userName = 'User' }: Props) {
  const item = useMemo(() => getItems().find(i => i.id === itemId), [itemId]);
  const [name, setName] = useState(item?.name ?? '');
  const [price, setPrice] = useState(String(item?.price ?? ''));
  const [imageUri, setImageUri] = useState(item?.imageUri ?? '');

  const handleSave = () => {
    const n = name.trim();
    const p = Number(price);
    if (!n || isNaN(p)) return;
    updateItem(itemId, n, p, imageUri.trim() || undefined);
    onDone();
  };

  return (
    <Background>
      <View style={styles.container}>
        {/* Back button */}
        <View style={styles.topBar}>
          {!!onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* No profile/greeting on this screen as requested */}
        <Text style={styles.title}>Edit item in{`\n`}Daily Specials</Text>
        <TextInput
          placeholder="Enter Item Name..."
          placeholderTextColor="#666"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Item Price"
          placeholderTextColor="#666"
          keyboardType="numeric"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
        />
        <TextInput
          placeholder="Image URL (optional)"
          placeholderTextColor="#666"
          style={styles.input}
          value={imageUri}
          onChangeText={setImageUri}
        />
        {!!imageUri?.trim() && (
          <View style={styles.previewWrap}>
            <Image
              source={{ uri: imageUri.trim() }}
              style={styles.preview}
              resizeMode="cover"
            />
          </View>
        )}
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Proceed to Add</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 24, alignItems: 'center' },
  topBar: { width: '100%', height: 32, justifyContent: 'center', marginBottom: 8 },
  backButton: { paddingHorizontal: 4, paddingVertical: 2 },
  backIcon: { fontSize: 22, fontWeight: '700', color: '#111' },
  
  title: { fontSize: 26, fontWeight: '800', color: '#111', textAlign: 'center', marginBottom: 50, marginTop: 120 },
  input: { width: '100%', height: 54, borderWidth: 1, borderColor: '#ddd', borderRadius: 12, paddingHorizontal: 14, backgroundColor: 'rgba(255,255,255,0.95)', marginBottom: 14 },
  previewWrap: { width: '100%', alignItems: 'center', marginBottom: 14 },
  preview: { width: '100%', height: 140, borderRadius: 12, backgroundColor: '#f3f3f3' },
  button: { width: '100%', height: 52, borderRadius: 10, backgroundColor: '#4CAF50', alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  buttonText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
