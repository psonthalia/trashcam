import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, CardItem, Text, Button, Left, Body, Right } from 'native-base';
import { Dimensions } from 'react-native';
import { Image } from 'react-native';

export default class Redeem extends React.Component {
  render() {
    return (
        <ScrollView style={styles.container}>
          <Card style={styles.card}>
            <CardItem>
              <Left>
                <Body>
                <Text>McDonalds</Text>
                <Text note>15% Off Your Next Order</Text>
                </Body>
              </Left>
              <Right>
                <Text>10 Points</Text>
              </Right>
            </CardItem>
            <CardItem cardBody>
              <Image source={require('./assets/mcdonalds.png')} style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
              <Body>
              <Button transparent>
                <Text>REDEEM</Text>
              </Button>
              </Body>
            </CardItem>
          </Card>

          <Card style={styles.card}>
            <CardItem>
              <Left>
                <Body>
                <Text>Chipotle</Text>
                <Text note>20% Off Your Next Order</Text>
                </Body>
              </Left>
              <Right>
                <Text>20 Points</Text>
              </Right>
            </CardItem>
            <CardItem cardBody>
              <Image source={require('./assets/chipotle.gif')} style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
              <Body>
              <Button transparent>
                <Text>REDEEM</Text>
              </Button>
              </Body>
            </CardItem>
          </Card>

          <Card style={styles.card}>
            <CardItem>
              <Left>
                <Body>
                <Text>Taco Bell</Text>
                <Text note>One Free Taco</Text>
                </Body>
              </Left>
              <Right>
                <Text>40 Points</Text>
              </Right>
            </CardItem>
            <CardItem cardBody>
              <Image source={require('./assets/taco-bell.jpg')} style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
              <Body>
              <Button transparent>
                <Text>REDEEM</Text>
              </Button>
              </Body>
            </CardItem>
          </Card>

          <Card style={styles.card}>
            <CardItem>
              <Left>
                <Body>
                <Text>Subway</Text>
                <Text note>1 Free Six Inch</Text>
                </Body>
              </Left>
              <Right>
                <Text>50 Points</Text>
              </Right>
            </CardItem>
            <CardItem cardBody>
              <Image source={require('./assets/subway.jpeg')} style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
              <Body>
              <Button transparent>
                <Text>REDEEM</Text>
              </Button>
              </Body>
            </CardItem>
          </Card>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 16
  },
  card: {
    //width: Dimensions.get('window').width - 16,
  }
});
