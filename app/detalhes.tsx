import { deleteTodasDivida, getDividaAtiva, getDividasIdByCliente, IDivida } from '@/database/services/DividaService'
import somarDividas from '@/utils/somarDividas'
import * as ER from 'expo-router'
import React from 'react'
import { Alert, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

// Componente para renderizar cada item da lista
const ClienteItem = ({ cliente }: { cliente: IDivida }) => {
  // Adicione a lógica para navegar para os detalhes do cliente ao clicar
  return (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.clienteNome}>{cliente.observacoes}</Text>
      </View>
      <Text style={styles.dividaValor}>
        {/* Formatação para moeda (ajuste conforme a necessidade) */}
        R$ {cliente?.valor?.toFixed(2).replace('.', ',')}
      </Text>
    </View>
  )
}

export default function DetalhesDividaScreen() {
  const [listaDividas, setListaDividas] = React.useState<IDivida[]>([])
  const [totalDivida, setTotalDivda] = React.useState(0)
  const [quitarDivida, setQuitarDivida] = React.useState<true | false>(false)
  const { id } = ER.useLocalSearchParams()

  React.useEffect(() => {
    const loadData = async () => {
      const dividas = ((await getDividasIdByCliente(id)) || []) as IDivida[]
      const temDivida = await getDividaAtiva(id)
      const totalSoma = somarDividas(dividas)

      setQuitarDivida(temDivida)
      setListaDividas(dividas)
      setTotalDivda(totalSoma)
    }
    loadData()
  }, [id])
  console.log({ listaDividas })

  const renderItem = ({ item }: { item: IDivida }) => <ClienteItem cliente={item} />

  const handleQuitarDivida = async () => {
    await deleteTodasDivida(id)
    ER.router.push('/')
  }

  const handleDividaPress = () => {
    Alert.alert(
      'Confirmação',
      'Você tem certeza que deseja continuar?',
      [
        { text: 'Sim', onPress: handleQuitarDivida },
        { text: 'Não', style: 'cancel', onPress: () => setQuitarDivida(false) },
      ],
      { cancelable: true }
    )
  }

  console.log({ quitarDivida })

  return (
    <View style={styles.content}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={listaDividas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()} // Use um ID único
          contentContainerStyle={listaDividas.length === 0 ? styles.listEmptyContent : undefined}
          ListEmptyComponent={() => (
            <View style={styles.loadingContainer}>
              <Text style={styles.infoText}>Nenhum divida cadastrado.</Text>
              <Button title="Cadastrar Novo Divida" onPress={() => ER.router.push('/divida')} />
            </View>
          )}
          style={styles.list}
        />
      </View>
      <TouchableOpacity
        disabled={quitarDivida}
        style={[
          styles.itemContainer,
          { marginBottom: 60 },
          !quitarDivida ? styles.dividaValorAtiva : styles.dividaValorInativa,
        ]}
        onPress={handleDividaPress}
      >
        <View>
          <View style={styles.textContainer}>
            <Text style={styles.clienteNome}>teste</Text>
          </View>
          <Text style={[styles.dividaValor, !quitarDivida ? styles.dividaValorAtiva : styles.dividaValorInativa]}>
            {/* Formatação para moeda (ajuste conforme a necessidade) */}
            R$ {totalDivida.toFixed(2).replace('.', ',')}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    marginBottom: 12,
    padding: 10,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  inputText: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  content: {
    flex: 1,
    display: 'flex',
  },
  list: {},
  listEmptyContent: {
    flex: 1, // Para centralizar o conteúdo vazio
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // Pode querer adicionar estilos de tamanho aqui se a FlatList não estiver em flex: 1 total
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },

  // Estilos para o item da FlatList
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50', // Uma cor para destaque
  },
  textContainer: {
    flex: 1,
  },
  clienteNome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  clienteDetalhe: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  dividaValor: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  dividaValorAtiva: {
    color: '#D32F2F',
    borderLeftColor: '#D32F2F',
  },
  dividaValorInativa: {
    color: 'green',
    borderLeftColor: 'green',
  },
})
