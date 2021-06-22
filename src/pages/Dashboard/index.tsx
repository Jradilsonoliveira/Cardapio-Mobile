import React, { useEffect, useState } from 'react';
import { Image, ScrollView } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../assets/logo-header.png';
import SearchInput from '../../components/SearchInput';

import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  FilterContainer,
  Title,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles';


interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  formattedPrice: string;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const navigation = useNavigation();

  async function handleNavigate(id: number): Promise<void> {
    // Navigate do ProductDetails page
    navigation.navigate(`FoodDetails`, { id });
  }

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const foodsResponse = await api.get('/products', {
        params: {
          name_like: searchValue,
        },
      });

      if (foodsResponse.status === 200) {
        setFoods(
          foodsResponse.data.map((food: Food) => ({
            ...food,
            formattedPrice: formatValue(food.price),
          })),
        );
      }
    }

    loadFoods();
  }, [searchValue]);


  return (
    <Container>
      <Header>
        <Image style={{width: 35, height: 35}} source={Logo} />
        <Icon
          name="log-out"
          size={24}
          color="#FFB84D"
          onPress={() => navigation.navigate('Home')}
        />
      </Header>
      <FilterContainer>
        <SearchInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Qual comida você procura?"
        />
      </FilterContainer>
      <ScrollView>
        <FoodsContainer>
          <Title>Pratos</Title>
          <FoodList>
            {foods.map(food => (
              <Food
                key={food.id}
                onPress={() => handleNavigate(food.id)}
                activeOpacity={0.6}
                testID={`food-${food.id}`}
              >
                <FoodImageContainer>
                  <Image
                    style={{ width: 88, height: 88 }}
                    source={{ uri: food.image }}
                  />
                </FoodImageContainer>
                <FoodContent>
                  <FoodTitle>{food.name}</FoodTitle>
                  <FoodDescription>{food.description}</FoodDescription>
                  <FoodPricing>{food.formattedPrice}</FoodPricing>
                </FoodContent>
              </Food>
            ))}
          </FoodList>
        </FoodsContainer>
      </ScrollView>
    </Container>
  );
};

export default Dashboard;
