import { getClientes } from '@/database/services/ClienteService'
import { createDivida } from '@/database/services/DividaService'
import { Picker } from '@react-native-picker/picker'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
// Você pode precisar instalar o picker: npx expo install @react-native-picker/picker

export default function DividaCreateScreen() {
  const [clientes, setClientes] = useState<{ id: number; nome: string }[]>([])
  const [clienteIdSelecionado, setClienteIdSelecionado] = useState<number | undefined>(undefined)

  const [valor, setValor] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [loading, setLoading] = useState(true)

  // 1. Carregar a lista de clientes ao iniciar
  useEffect(() => {
    const loadClientes = async () => {
      try {
        const list = await getClientes()       
        setClientes(list)

        // Define o primeiro cliente como padrão, se houver
        if (list.length > 0) {
          setClienteIdSelecionado(list[0].id)
        }
      } catch (error) {
        console.error('Erro ao carregar clientes:', error)
        Alert.alert('Erro', 'Não foi possível carregar a lista de clientes.')
      } finally {
        setLoading(false)
      }
    }
    loadClientes()
  }, [])

  const handleSave = async () => {
    const valorNumerico = parseFloat(valor.replace(',', '.'))

    if (!clienteIdSelecionado || isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Erro', 'Selecione um cliente e insira um valor válido.')
      return
    }

    // A data de registro será a data atual
    const dataRegistro = new Date().toISOString()

    setLoading(true)
    try {
      const newId = await createDivida(clienteIdSelecionado, valorNumerico, dataRegistro, observacoes.trim())

      Alert.alert(
        'Sucesso!',
        `Dívida de R$ ${valorNumerico.toFixed(2)} registrada para o cliente ID ${clienteIdSelecionado}.`
      )
      router.back()
    } catch (error) {
      console.error('Erro ao registrar dívida:', error)
      Alert.alert('Erro', 'Não foi possível registrar a dívida.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Carregando clientes...</Text>
      </View>
    )
  }

  if (clientes.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.infoText}>Nenhum cliente cadastrado.</Text>
        <Button title="Cadastrar Novo Cliente" onPress={() => router.push('/create')} />
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Cliente *</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={clienteIdSelecionado}
          onValueChange={(itemValue) => setClienteIdSelecionado(itemValue as number)}
          style={styles.picker}
        >
          {clientes.map((c) => (
            <Picker.Item key={c.id} label={c.nome} value={c.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Valor *</Text>
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={setValor}
        placeholder="R$ 0,00"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Observações</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={observacoes}
        onChangeText={setObservacoes}
        placeholder="Descrição da compra..."
        multiline
        numberOfLines={4}
      />

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? 'Registrando...' : 'Registrar Dívida'}
          onPress={handleSave}
          disabled={loading}
          color="#007AFF"
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', minHeight: '100%' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 15, marginBottom: 5, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  buttonContainer: { marginTop: 30, borderRadius: 8, overflow: 'hidden' },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  picker: { height: 50, width: '100%' },
  infoText: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
})
