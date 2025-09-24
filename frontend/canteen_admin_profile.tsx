import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import Background from './Background';

interface Props {
  userName?: string;
  username?: string;
  onSave: (name: string, username: string, photoUri?: string) => void;
  onBack: () => void;
  currentPhotoUri?: string;
}

export default function CanteenAdminProfile({ userName = 'User', username = '', onSave, onBack, currentPhotoUri }: Props) {
  const [name, setName] = useState(userName);
  const [uname, setUname] = useState(username);
  const [photo, setPhoto] = useState<string | undefined>(currentPhotoUri);
  const [photoError, setPhotoError] = useState<string | null>(null);

  useEffect(() => {
    const prefetchImage = async () => {
      if (photo) {
        try {
          await Image.prefetch(photo);
          setPhotoError(null);
        } catch (error) {
          setPhotoError('Could not load this image URL');
        }
      }
    };
    const timeoutId = setTimeout(prefetchImage, 500);
    return () => clearTimeout(timeoutId);
  }, [photo]);

  const onChangeText = (text: string) => {
    setPhoto(text.trim());
  };

  return (
    <Background>
      <View style={styles.container}>
        {/* Back button */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Profile</Text>

        {/* Photo preview */}
        <View style={styles.photoRow}>
          <Image
            source={photo ? { uri: photo } : require('./assets/profile-icon.png')}
            style={styles.photo}
            onError={() => setPhotoError('Could not load this image URL')}
            onLoad={() => setPhotoError(null)}
          />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.label}>Photo URL</Text>
            <TextInput
              placeholder="https://..."
              placeholderTextColor="#666"
              value={photo ?? ''}
              onChangeText={onChangeText}
              style={styles.input}
            />
            {!!photoError && <Text style={styles.error}>{photoError}</Text>}
            <Text style={styles.hint}>Paste a public image link (ending in .png/.jpg). We'll add gallery upload next.</Text>
            <TouchableOpacity
              onPress={() => setPhoto('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=256&auto=format&fit=crop')}
              style={styles.sampleBtn}
            >
              <Text style={styles.sampleText}>Use sample image</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          placeholder="Enter name"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        {/* Username */}
        <Text style={styles.label}>Username</Text>
        <TextInput
          placeholder="Enter username"
          placeholderTextColor="#666"
          value={uname}
          onChangeText={setUname}
          style={styles.input}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => onSave(name.trim() || 'User', uname.trim(), photo)}
        >
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 20 },
  topBar: { height: 32, justifyContent: 'center', marginBottom: 8 },
  backButton: { paddingHorizontal: 4, paddingVertical: 2 },
  backIcon: { fontSize: 22, fontWeight: '700', color: '#111' },
  title: { fontSize: 26, fontWeight: '800', color: '#111', marginVertical: 12 },
  label: { color: '#444', marginTop: 10, marginBottom: 6, fontWeight: '600' },
  input: { height: 48, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 12, backgroundColor: 'rgba(255,255,255,0.96)' },
  photoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  photo: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#e5e5e5' },
  hint: { fontSize: 12, color: '#777', marginTop: 4 },
  error: { fontSize: 12, color: '#d32f2f', marginTop: 4 },
  sampleBtn: { marginTop: 6 },
  sampleText: { color: '#007BFF', fontWeight: '600' },
  saveBtn: { marginTop: 18, height: 50, borderRadius: 10, backgroundColor: '#4CAF50', alignItems: 'center', justifyContent: 'center' },
  saveText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
