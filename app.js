require('dotenv').config();
const express = require('express');
const https = require('https');
const querystring = require('querystring');

const fetchNearbyRestaurants = require('./utils/fetchNearbyRestaurants');
const fetchRestaurantUrl = require('./utils/fetchRestaurantUrl');
const randomPickRestaurant = require('./utils/randomPickRestaurant');
const createCarousels = require('./utils/createCarousels');
const columnTemplete = require('./utils/carouselColumnTemplete');

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.LINE_ACCESS_TOKEN;
let restaurantsList;
const app = express();

// middleware
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

app.get('/', (req, res) => {
	res.status(200).send('you have reached the restaurant-app server');
});

app.post('/webhook', async (req, res) => {
	const webhookEventObj = req.body.events[0];
	const replyToken = webhookEventObj.replyToken;
	let messages;
	// if user send a message to the bot
	if (webhookEventObj.type === 'message') {
		const messageObj = webhookEventObj.message;

		// if the type of the message is text
		if (messageObj.type === 'text') {
			switch (messageObj.text) {
				case 'start':
					messages = [
						{
							type: 'text',
							text: 'Please share your location.',
							quickReply: {
								items: [
									{
										type: 'action',
										action: {
											type: 'location',
											label: 'Send location',
										},
									},
								],
							},
						},
					];
					break;
				case 'show nearby restaurants (highest rating comes first)':
					const carouselTempletes = createCarousels(restaurantsList);
					messages = [
						...carouselTempletes,
						{
							type: 'text',
							text: "Don't know what to do next? You can...",
							quickReply: {
								items: [
									{
										type: 'action',
										action: {
											type: 'location',
											label: 'Change location',
										},
									},
									{
										type: 'action',
										action: {
											type: 'message',
											label: 'Pick a restaurant',
											text: 'pick a restaurant',
										},
									},
								],
							},
						},
					];

					break;
				case 'pick a restaurant':
					const restaurant = randomPickRestaurant(restaurantsList);
					messages = [
						{
							type: 'template',
							altText: 'this is a carousel template',
							template: {
								type: 'carousel',
								columns: [columnTemplete(restaurant)],
								imageAspectRatio: 'rectangle',
								imageSize: 'cover',
							},
						},
						{
							type: 'text',
							text: "Don't know what to do next? You can...",
							quickReply: {
								items: [
									{
										type: 'action',
										action: {
											type: 'location',
											label: 'Change location',
										},
									},
									{
										type: 'action',
										action: {
											type: 'message',
											label: 'Pick again',
											text: 'pick a restaurant',
										},
									},
									{
										type: 'action',
										action: {
											type: 'message',
											label: 'Show nearby',
											text: 'show nearby restaurants (highest rating comes first)',
										},
									},
								],
							},
						},
					];
					break;
				case 'menu':
					messages = [
						{
							type: 'template',
							altText: 'This is a buttons template',
							template: {
								type: 'buttons',
								thumbnailImageUrl:
									'https://res.cloudinary.com/dcc94ynkl/image/upload/v1651222906/menu_jhyzu2.jpg',
								imageAspectRatio: 'rectangle',
								imageSize: 'cover',
								imageBackgroundColor: '#FFFFFF',
								title: 'Menu',
								text: 'Please select',
								actions: [
									{
										type: 'message',
										label: 'Show nearby',
										text: 'show nearby restaurants (highest rating comes first)',
									},
									{
										type: 'message',
										label: 'Pick one',
										text: 'pick a restaurant',
									},
								],
							},
						},
					];
					break;
				default:
					messages = [
						{
							type: 'text',
							text: 'sorry, I dont understand...',
						},
					];
					break;
			}
		}
		// if the type of the message is location
		else if (messageObj.type === 'location') {
			const { latitude, longitude } = messageObj;
			// only fetch data if location has changed
			restaurantsList = await fetchNearbyRestaurants(latitude, longitude);
			restaurantsList.forEach(async function (restaurant) {
				const url = await fetchRestaurantUrl(restaurant.place_id);
				restaurant.url = url;
			});
			messages = [
				{
					type: 'template',
					altText: 'This is a buttons template',
					template: {
						type: 'buttons',
						thumbnailImageUrl:
							'https://res.cloudinary.com/dcc94ynkl/image/upload/v1651222906/menu_jhyzu2.jpg',
						imageAspectRatio: 'rectangle',
						imageSize: 'cover',
						imageBackgroundColor: '#FFFFFF',
						title: 'Menu',
						text: 'Please select',
						actions: [
							{
								type: 'message',
								label: 'Show nearby',
								text: 'show nearby restaurants (highest rating comes first)',
							},
							{
								type: 'message',
								label: 'Pick one',
								text: 'pick a restaurant',
							},
						],
					},
				},
			];
		}
	}

	// only send the request to line api endpoint if messages is not undefined
	if (messages) {
		// Request body
		const dataString = JSON.stringify({
			replyToken: replyToken,
			messages: messages,
		});

		// Request header
		const headers = {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + TOKEN,
		};

		// Options to pass into the request
		const webhookOptions = {
			hostname: 'api.line.me',
			path: '/v2/bot/message/reply',
			method: 'POST',
			headers: headers,
			body: dataString,
		};

		// Define request
		const request = https.request(webhookOptions, res => {
			res.on('data', d => {
				process.stdout.write(d);
			});
		});

		// Handle error
		request.on('error', err => {
			console.error(err);
		});

		// Send data
		request.write(dataString);
		request.end();
	}

	res.send('HTTP POST request sent to the webhook URL!');
});

app.listen(PORT, () => console.log(`Server is listening on http://localhost/${PORT}`));
