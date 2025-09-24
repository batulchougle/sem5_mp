import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Platform } from 'react-native';
import Background from './Background';
import Login from './Login';
import CanteenAdminMenu from './canteen_admin_menu';
import CanteenAdminAddItem from './canteen_admin_add_item';
import CanteenAdminEditItem from './canteen_admin_edit_item';
import CanteenAdminProfile from './canteen_admin_profile';

type Props = {
  userName?: string;
  currentUsername?: string;
};

export default function CanteenAdminHP({ userName = 'User', currentUsername = '' }: Props) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [logout, setLogout] = useState(false);
  const [view, setView] = useState<'home' | 'menu' | 'add' | 'edit' | 'profile'>('home');
  const [editId, setEditId] = useState<number | null>(null);
  const [displayName, setDisplayName] = useState(userName);
  const [accountUsername, setAccountUsername] = useState(currentUsername);
  const [displayPhotoUri, setDisplayPhotoUri] = useState<string | undefined>(undefined);

  if (logout) return <Login />;

  // Nested routing for Menu -> Add/Edit
  if (view === 'menu') {
    return (
      <CanteenAdminMenu
        userName={userName}
        onBack={() => setView('home')}
        onOpenAdd={() => setView('add')}
        onOpenEdit={(id) => { setEditId(id); setView('edit'); }}
      />
    );
  }
  if (view === 'add') {
    return <CanteenAdminAddItem onDone={() => setView('menu')} onBack={() => setView('menu')} />;
  }
  if (view === 'edit' && editId != null) {
    return <CanteenAdminEditItem itemId={editId} onDone={() => setView('menu')} onBack={() => setView('menu')} />;
  }
  if (view === 'profile') {
    return (
      <CanteenAdminProfile
        userName={displayName}
        currentPhotoUri={displayPhotoUri}
        onSave={(n: string, u: string, photo?: string) => {
          setDisplayName(n);
          setAccountUsername(u);
          setDisplayPhotoUri(photo);
          setView('home');
        }}
        onBack={() => setView('home')}
      />
    );
  }

  return (
    <Background>
      <View style={styles.container}>
        {/* Header with profile and greeting */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => setShowProfileMenu((s) => !s)} activeOpacity={0.8}>
            <Image
              source={ displayPhotoUri ? { uri: displayPhotoUri } : require('./assets/profile-icon.png') }
              style={styles.profilePic}
            />
          </TouchableOpacity>
          <View style={styles.greetingWrap}>
            <Text style={styles.greeting}>Hello!!</Text>
            <Text style={styles.userName}>{displayName}</Text>
          </View>
          {showProfileMenu && (
            <>
              {/* Backdrop to close on outside tap */}
              <TouchableOpacity
                style={styles.backdrop}
                activeOpacity={1}
                onPress={() => setShowProfileMenu(false)}
              />
              <View style={styles.profileMenu}>
                <TouchableOpacity style={styles.profileMenuItem} onPress={() => setLogout(true)}>
                  <Text style={styles.profileMenuText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#666"
            style={styles.searchInput}
          />
        </View>

        {/* Big tiles */}
        <View style={styles.tilesGrid}>
          <TouchableOpacity
            style={styles.tile}
            activeOpacity={0.9}
            onPress={() => {
              if (showProfileMenu) setShowProfileMenu(false);
              setView('menu');
            }}
          >
            <Image
              source={require('./assets/menu_image.png') }
              style={styles.tileImage}
            />
            <Text style={styles.tileLabel}>Menu</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.tile, styles.tileEmphasis]} activeOpacity={0.9}>
            <Image
              source={ require('./assets/order_image.png')}
              style={styles.tileImage}
            />
            <Text style={styles.tileLabel}>Orders</Text>
          </TouchableOpacity>

          {/* Profile tile */}
          <TouchableOpacity
            style={styles.tile}
            activeOpacity={0.9}
            onPress={() => {
              if (showProfileMenu) setShowProfileMenu(false);
              setView('profile');
            }}
          >
            <Image
              source={require('./assets/shop.png')}
              style={styles.tileImage}
            />
            <Text style={styles.tileLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: '#ddd',
  },
  // Profile dropdown
  profileMenu: {
    position: 'absolute',
    top: 34,
    left: 0,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    paddingVertical: 6,
    minWidth: 140,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    zIndex: 3000,
  },
  profileMenuItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  profileMenuText: {
    fontSize: 16,
    color: '#111',
    fontWeight: '600',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2000,
  },
  greetingWrap: {
    flexDirection: 'column',
  },
  greeting: {
    fontSize: 16,
    color: '#111',
    fontWeight: '600',
  },
  userName: {
    fontSize: 18,
    color: '#111',
    fontWeight: '800',
  },
  searchWrap: {
    marginBottom: 18,
  },
  searchInput: {
    height: 42,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: '#e3e3e3',
  },
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
    columnGap: 18,
    marginTop: 12,
  },
  tile: {
    width: '46%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    padding: 10,
  },
  tileEmphasis: {
    borderColor: '#bdbdbd',
    elevation: 3,
  },
  tileImage: {
    width: 72,
    height: 72,
    marginBottom: 8,
  },
  tileLabel: {
    fontSize: 18,
    color: '#111',
    fontWeight: '700',
  },
});
