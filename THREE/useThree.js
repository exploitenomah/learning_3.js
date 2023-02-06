
import * as THREE from 'three';
import { useEffect, useMemo, useState } from 'react';
import WebGL from './webGL';

export class Options {
	constructor(options){
		if(options instanceof Object){
			const { canvas, antialias, animate, camera,  } = options
			this.canvas = canvas
			this.antialias = antialias
			this.animate = animate
			this.camera = camera
		}else{
			throw new Error('Please pass in the correct options.')
		}
	}
}

const checkOptions = (options) => {
	if(!(options instanceof Options)){
		throw new Error('Invalid Options!')
	}
}

const getRenderer = ({ canvas, antialias}) => {
	switch(canvas){
		case undefined: 
			return new THREE.WebGLRenderer();
		default: 
			if(canvas.current)return new THREE.WebGLRenderer({ canvas: canvas.current, antialias })
			else if(canvas.nodeName && canvas.nodeName.toLowerCase() === 'canvas'){
				return new THREE.WebGLRenderer({ canvas, antialias })
			} else return new THREE.WebGLRenderer();
	}
}

const handleResize = ({camera, renderer}) => {
	if(camera){
		if(camera.aspect) camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.shadowMap.enabled = true,
		renderer.shadowMap.type = THREE.PCFSoftShadowMap
		renderer.setPixelRatio(window.devicePixelRatio)
	}
}
export default function useThree(options){
	checkOptions(options);
	const { canvas, antialias, camera: defaultCam, animate } = useMemo(() => 
			({	
				canvas: options.canvas, 
				antialias: options.antialias,
				camera: options.camera,
				animate: options.animate
			}),
	[options.canvas, options.antialias, options.camera, options.animate])
	
	const [renderer, setRenderer] = useState(null)
	const [camera, setCamera] = useState(defaultCam)


	const scene = useMemo(() => new THREE.Scene(), [])


  useEffect(() => {
		if (WebGL.isWebGLAvailable() ) {

			if(renderer === null) setRenderer(getRenderer({canvas, antialias}))
			if(!camera) setCamera(new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 ))
			if(camera){
				camera.position.set( 0, 0, 100 );
				camera.lookAt( 0, 0, 0 )
			}
			if(renderer){
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );
			}
			function animation() {
				requestAnimationFrame(() => {
					if(typeof animate === 'function') animate()
					if(renderer) renderer.render( scene, camera );
					animation()
				});
			};
			animation();
			window.addEventListener('resize', () => {
				handleResize({ camera, renderer })
			})
		} else {
			const warning = WebGL.getWebGLErrorMessage();
			document.getElementById( 'container' ).appendChild( warning );
		}
		return () => {}
	}, [animate, antialias, camera, canvas, renderer, scene])

	return { renderer, camera, scene }
}