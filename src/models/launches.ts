import { log, flatMap } from "../deps.ts"

interface Launch {
	flightNumber: number
	mission: string
	rocket: string
	customers:Array<string>
	launchDate: Number
	upcoming: boolean
	success?: boolean
	target?: string
}
const launches = new Map<number, Launch>()

async function downloadLaunchData() {
	log.info('downloading launch data...')

	const response = await fetch('https://api.spacexdata.com/v3/launches', {
		method: 'GET'
	})

	if (!response.ok) {
		log.warning('problem downloading launch data')
		throw new Error('launch data download failed')
	} 

	const launchData = await response.json()
	for (const launch of launchData){
		const payloads = launch['rocket']['second_stage']['payloads']
		const customers = flatMap(payloads, (payload : any) => payload['customers'])

		const flightData = {
			flightNumber: launch['flight_number'],
			mission: launch['mission_name'],
			rocket: launch['rocket']['rocket_name'],
			launchDate: launch['launch_date_unix'],
			upcoming:launch['upcoming'],
			success: launch['launch_success'],
			customers: customers
		}

		launches.set(flightData.flightNumber, flightData)
		console.log(flightData)
		log.info(JSON.stringify(flightData))
	}
}

await downloadLaunchData()
log.info(`Downloaded data for ${launches.size} SpaceX launches.`)

export const getAll = () => Array.from(launches.values())

export const getOne = (id :  number) => {
	if (launches.has(id)) return launches.get(id)
	return null
}

export const addOne = (data : Launch) => {
	launches.set(data.flightNumber, Object.assign(data, { 
		upcoming: true,
		customers: [ 'You, campione ;)', 'NASA']
	}))
}

export const removeOne = (id :  number) => {
	const abortedLaunch = launches.get(id)
	if (abortedLaunch) {
		abortedLaunch.upcoming = false
		abortedLaunch.success = false
	}
	return abortedLaunch
}