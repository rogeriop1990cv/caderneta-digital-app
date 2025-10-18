// src/components/FloatingMenuButton.tsx

import React, { useState } from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const menuItems = [
  { key: 'divida', label: 'Nova Dívida', icon: 'payments', ordem: 2 },
  { key: 'cliente', label: 'Novo Cliente', icon: 'person-add', ordem: 1 },
].sort((a, b) => b.ordem - a.ordem)

interface FloatingMenuButtonProps {
  onMenuItemPress: (key: string) => void
}

const FloatingMenuButton: React.FC<FloatingMenuButtonProps> = ({ onMenuItemPress }) => {
  const [isOpen, setIsOpen] = useState(false)
  const animation = React.useRef(new Animated.Value(0)).current

  // 1. Alterna o estado do menu e inicia a animação
  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1

    Animated.spring(animation, {
      toValue,
      friction: 5, // Ajuda a dar um efeito de "mola"
      useNativeDriver: false,
    }).start()

    setIsOpen(!isOpen)
  }

  // 2. Animação para rotacionar o ícone principal (de '+' para 'x')
  const rotation = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
  }

  // 3. Renderiza os botões de menu
  const renderMenuItems = () => {
    return menuItems.map((item, index) => {
      // Calcula o deslocamento vertical
      const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -55 * (index + 1)],
      })

      const itemStyle = {
        opacity: animation,
        transform: [{ translateY }],
      }

      return (
        <Animated.View key={item.key} style={[styles.menuItemAnimated, itemStyle]}>
          <TouchableOpacity
            style={styles.menuItemButton}
            onPress={() => {
              toggleMenu() // Fecha o menu
              onMenuItemPress(item.key) // Executa a ação
            }}
          >
            {/* O texto dita a largura do TouchableOpacity */}
            <Text style={styles.menuItemText}>{item.label}</Text>
          </TouchableOpacity>
        </Animated.View>
      )
    })
  }

  return (
    <View style={styles.fullScreenContainer}>
      <View style={styles.container}>
        {renderMenuItems()}
        <TouchableOpacity style={styles.fabButton} onPress={toggleMenu} activeOpacity={0.7}>
          <Animated.Text style={[styles.fabText, rotation]}>+</Animated.Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    backgroundColor: '#f0f0f0',
    height: 130,
    marginRight: 10,
  },
  container: {
    position: 'absolute',
    right: 10,
    alignItems: 'flex-end',
  },
  // --- Estilos do FAB Principal ---
  fabButton: {
    backgroundColor: '#007AFF', // Cor azul padrão
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6, // Para Android
  },
  fabText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  // --- Estilos dos Itens do Menu ---
  menuItemWrapper: {},
  menuItemButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  menuItemAnimated: {
    height: 5,
    alignSelf: 'flex-end',
  },
  menuItemText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    height: 20,
    width: 150,
  },
})

export default FloatingMenuButton
