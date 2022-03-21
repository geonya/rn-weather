import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import {
	View,
	StyleSheet,
	Dimensions,
	Text,
	ScrollView,
	ActivityIndicator,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "3238da6bd63d7b84c8b845568b8d93aa";
const icons = {
	Clouds: "cloudy",
	Clear: "day-sunny",
	Rain: "rain",
	Snow: "snows",
	Drizzle: "rains",
	Thunderstorm: "lightning",
};

export default function App() {
	const [city, setCity] = useState("Loading...");
	const [days, setDays] = useState([]);
	const [ok, setOk] = useState(true);
	const getWeather = async () => {
		const { granted } = await Location.requestForegroundPermissionsAsync();
		if (!granted) {
			setOk(false);
		}
		const {
			coords: { latitude, longitude },
		} = await Location.getCurrentPositionAsync({
			accuracy: 6,
		});
		const location = await Location.reverseGeocodeAsync(
			// 위도와 경도로 주소를 가져옴
			{
				latitude,
				longitude,
			},
			{ useGoogleMaps: false }
		);
		setCity(location[0].city);
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
		);
		const json = await response.json();
		setDays(json.daily);
	};
	useEffect(() => {
		getWeather();
	}, []);
	return (
		<View style={styles.container}>
			<View style={styles.city}>
				<Text style={styles.cityName}>{city}</Text>
			</View>
			<ScrollView
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.weather}
			>
				{days.length === 0 ? (
					<View style={{ ...styles.day, alignItems: "center" }}>
						<ActivityIndicator
							color="white"
							style={{ marginTop: 10 }}
							size="large"
						/>
					</View>
				) : (
					days.map((day, index) => (
						<View key={index} style={styles.day}>
							<Text style={styles.date}>
								{new Date(day.dt * 1000)
									.toISOString()
									.substring(2, 10)}
							</Text>
							<View
								style={{
									width: "100%",
									flexDirection: "row",
									alignItems: "flex-end",
									justifyContent: "space-between",
								}}
							>
								<Text style={styles.temp}>
									{parseFloat(day.temp.day).toFixed(1)}
								</Text>
								<Fontisto
									name={icons[day.weather[0].main]}
									size={90}
									color="white"
								/>
							</View>

							<Text style={styles.description}>
								{day.weather[0].main}
							</Text>
							<Text style={styles.smallDescription}>
								{day.weather[0].description}
							</Text>
						</View>
					))
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#48dbfb",
	},
	city: {
		flex: 1.2,
		justifyContent: "center",
		alignItems: "center",
	},
	cityName: {
		color: "#fff",
		fontSize: 68,
		fontWeight: "500",
	},
	weather: {},
	day: {
		width: SCREEN_WIDTH,
		alignItems: "flex-start",
		paddingHorizontal: 50,
	},
	date: {
		color: "#fff",
		fontSize: 25,
	},
	temp: {
		color: "#fff",
		fontWeight: "500",
		fontSize: 80,
	},
	description: {
		color: "#fff",
		marginTop: -10,
		fontSize: 40,
	},
	smallDescription: {
		color: "#fff",
		fontSize: 20,
	},
});
