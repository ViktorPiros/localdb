import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Button, Image, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

// Определяем интерфейс для продукта
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

// Определяем интерфейс для свойств компонента ProductCard
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const db = SQLite.openDatabase('cart.db');

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => (
  <View style={styles.card}>
    <Image source={{ uri: product.image }} style={styles.image} />
    <Text style={styles.title}>{product.title}</Text>
    <Text style={styles.price}>{product.price} $</Text>
    <Text style={styles.description}>{product.description}</Text>
    <Button title="Добавить в корзину" onPress={() => onAddToCart(product)} />
  </View>
);

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
    createCartTable();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  const createCartTable = () => {
    db.transaction((tx: any) => { // Используем any
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS cart (id INTEGER PRIMARY KEY NOT NULL, title TEXT, price REAL);'
      );
    });
  };

  const handleAddToCart = (product: Product) => {
    db.transaction((tx: any) => { // Используем any
      tx.executeSql('INSERT INTO cart (title, price) VALUES (?, ?)', [product.title, product.price]);
      alert(`${product.title} добавлен в корзину!`);
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts().finally(() => setRefreshing(false));
  };

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} onAddToCart={handleAddToCart} />}
      keyExtractor={item => item.id.toString()}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  price: {
    fontSize: 16,
    color: '#888',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
});

export default ProductList;