import { 
	log,
	join,
	parse,
	BufReader,
	pick,
  } from "../deps.ts";

type Planet = Record<string, string>

let planets : Array<Planet>

const loadPlanetsData = async() => {
	const path = join('.', 'data', 'kepler_exoplanets_nasa.csv')

	const file = await Deno.open(path)
	const bufReader = new BufReader(file)
	const result = await parse(
		bufReader, 
		{
			skipFirstRow: true, 
			// header: true, // old version
			comment: '#'
		}
	)
	
	Deno.close(file.rid)

	const planets = (result as Array<Planet>).filter(planet => {
		return (planet.koi_disposition === 'CONFIRMED' 
			&& Number(planet.koi_prad) > 0.5 
			&& Number(planet.koi_prad) < 1.5 
			&&  Number(planet.koi_smass) > 0.78 
			&&  Number(planet.koi_smass) < 1.04 
			&& Number(planet.koi_srad) > 0.99 
			&& Number(planet.koi_prad) < 1.01
		)}
	)

	return planets.map(planet => pick(planet, [
		'koi_prad',
		'koi_smass',
		'koi_srad',
		'kepler_name',
		'koi_count',
		'koi_steff',
		'koi_period'
	]))
}

planets = await loadPlanetsData()

export const getAll = () => planets


