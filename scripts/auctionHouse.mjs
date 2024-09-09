import fs from 'fs'
import 'dotenv/config'

const itemIds = [
	// Ores
	210930, // Bismuth *
	210931, // Bismuth **
	210932, // Bismuth ***
	210933, // Aqirite *
	210934, // Aqirite **
	210935, // Aqirite ***
	210936, // Ironclaw Ore *
	210937, // Ironclaw Ore **
	210938, // Ironclaw Ore ***

	// Herbs
	210796, // Mycobloom *
	210797, // Mycobloom **
	210798, // Mycobloom ***
	210799, // Luredrop *
	210800, // Luredrop **
	210801, // Luredrop ***
	210802, // Orbinid *
	210803, // Orbinid **
	210804, // Orbinid ***
	210805, // Blessing Blossom *
	210806, // Blessing Blossom **
	210807, // Blessing Blossom ***
	210808, // Arathor's Spear *
	210809, // Arathor's Spear **
	210810, // Arathor's Spear ***
]

const fetchOAuth = async () => {
	const response = await fetch('https://us.battle.net/oauth/token?grant_type=client_credentials', {
		method: 'POST',
		headers: {
			Authorization: `Basic ${btoa(`${process.env.BATTLENET_CLIENT_ID}:${process.env.BATTLENET_CLIENT_SECRET}`)}`,
		},
	})
	const json = await response.json()

	return json
}

const fetchAuctions = async (access_token) => {
	const response = await fetch(
		`https://eu.api.blizzard.com/data/wow/auctions/commodities?namespace=dynamic-eu&locale=en_US&access_token=${access_token}`
	)
	const json = await response.json()

	return json
}

const fetchItem = async (itemId, access_token) => {
	const response = await fetch(
		`https://eu.api.blizzard.com/data/wow/item/${itemId}?namespace=static-eu&locale=en_US&access_token=${access_token}`
	)
	const json = await response.json()

	return json
}

const oAuth = await fetchOAuth()
const { access_token } = oAuth

const auctionHouse = await fetchAuctions(access_token)
const { auctions } = auctionHouse

const refinedItems = itemIds.map(async (itemId) => {
	const itemData = await fetchItem(itemId, access_token)
	const itemName = itemData.name

	let itemAuctions = auctions.filter((auction) => auction.item.id === itemId)
	const totalAuctions = itemAuctions.length

	let itemPrice = 0
	if (totalAuctions > 0) {
		itemAuctions.sort((a, b) => {
			if (a.unit_price < b.unit_price) {
				return -1
			}
			if (a.unit_price > b.unit_price) {
				return 1
			}
			return 0
		})

		itemPrice = itemAuctions[0].unit_price / 10000
	}

	return {
		id: itemId,
		name: itemName,
		auctions: totalAuctions,
		price: itemPrice,
	}
})

const items = await Promise.all(refinedItems)

const filename = `src/data/worldofwarcraft/auctions.json`
fs.writeFileSync(filename, JSON.stringify(items, null, 2))
