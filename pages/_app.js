import { useEffect } from 'react'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {

	useEffect(() => {
		window.addEventListener("error", (event) => {
			console.log(event);
			event.preventDefault() 
		})
		return () => {
			window.removeEventListener('error', (...args) => {
				console.log('rmovec', args)
			})
		}
	}, [])
  return <Component {...pageProps} />
}

export default MyApp
