import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';

import api from '../../services/api';
import formatValue from '../../utils/formatValue';
import { useIsFocused, useNavigation } from '@react-navigation/native';


import {
  Container,
  Header,
  HeaderTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  formattedPrice: string;
}

interface Food{
  product: Product;
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Food[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function loadFavorites(): Promise<void> {
      if (isFocused) {
        const {data} = await api.get('/favorites');
        setFavorites(data);
      }
    }

    loadFavorites();
  }, []);

  const navigation = useNavigation();

  async function handleNavigate(id: number): Promise<void> {
    // Navigate do ProductDetails page
    navigation.navigate(`FoodDetails`, { id });
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus favoritos</HeaderTitle>
      </Header>

      <FoodsContainer>
      <FoodList>
          {favorites.map(food => (
            <Food
              key={food.product.id}
              onPress={() => handleNavigate(food.product.id)}
              activeOpacity={0.6}
              testID={`food-${food.product.id}`}
            >
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: food.product.image }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{food.product.name}</FoodTitle>
                <FoodPricing>{`R$${food.product.price}`}</FoodPricing>
              </FoodContent>
            </Food>
          ))}
          </FoodList>
      </FoodsContainer>
    </Container>
  );
};

export default Favorites;
