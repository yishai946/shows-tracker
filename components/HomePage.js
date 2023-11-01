import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import Card from "./Card";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Home() {
  const [popularShows, setPopularShows] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPopularShows = async () => {
      let url = `https://www.episodate.com/api/most-popular?page=1`;
      fetch(url, { method: "Get" })
        .then((res) => res.json())
        .then((json) => {
          setPopularShows(json.tv_shows);
        });
    };

    fetchPopularShows();
  }, []);

  const updateSearch = (text) => {
    setSearch(text);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const handleSearch = () => {
    // Trigger the search when the "Enter" key is pressed
    searchShow();
  };

  const searchShow = async () => {
    try {
      const response = await fetch(
        `https://www.episodate.com/api/search?q=${search}&page=:page`
      );
      const data = await response.json();
      setPopularShows(data.tv_shows);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={searchShow}>
          <AntDesign name="search1" size={22} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          onChangeText={updateSearch}
          value={search}
          placeholder="Search..."
          placeholderTextColor="gray"
          // Listen for the "Enter" key press
          onSubmitEditing={handleSearch}
        />
        {search.length !== 0 && (
          <TouchableOpacity onPress={handleClearSearch}>
            <Feather name="x-circle" size={22} color="black" />
          </TouchableOpacity>
        )}
      </View>
      <ScrollView>
        {popularShows.length > 0 ? (
          <View style={styles.row}>
            {popularShows.map((show, index) => (
              <Card
                key={index}
                title={show.name}
                srcImg={show.image_thumbnail_path}
              />
            ))}
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 50,
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
    width: "80%",
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    height: 40,
    fontSize: 16,
  },
});
