const generateArt = () => {
    const canvas = document.createElement('canvas');
	canvas.id = 'art';
	canvas.height = '500';
	canvas.width = '500';
	canvas.style.border = `5px solid ${appList[0].color}`;
	canvas.style.background = '#000000'

    let particleContext = canvas.getContext('2d')

    let canvasHeight = 500
    let canvasWidth = 500

    let radius = 100

    let radiusScale = 1
    let radiusMin = 1
    let radiusMax = 2

    let isMouseDown = false

    const blue = '#458588'
    const red = '#cc241d'
    const yellow = '#d79921'
    const purlpe= '#b16286'



    const colors = [blue,red,yellow,purlpe]


    let mouseX = window.innerWidth - canvasWidth
    let mouseY = window.innerHeight - canvasHeight

    let genParticles = (numParticles) => {
        let particles = []
        for (let i = 0; i < numParticles; i++ ){
            let particle = {
                position: { x: mouseX, y: mouseY },
				shift: { x: mouseX, y: mouseY },
				size: 1,
				angle: 0,
				speed: 0.01+Math.random()*0.09,
				targetSize: 1,
				fillColor: `#${(Math.random()*0xFFFFFF<<0).toString(16)}`,
				orbit: radius *.5 + ( radius* .5 * Math.random())
            }
            particles.push(particle)
        }
        return particles
    }

    let handleMouseMove = (e) => {
        let rect = canvas.getBoundingClientRect()
        mouseX = e.clientX - rect.left
        mouseY = e.clientY - rect.top
    }

    let mouseDownToggle = (e) => {
        isMouseDown = true
    }

    let mouseUpToggle = (e) => {
        isMouseDown = false
    }

    let handleResize = (e) => {
        canvas.width = canvasWidth
        canvas.height = canvasHeight

        // canvas.style.position = 'absolute'

        // canvas.style.left = (window.innerWidth - canvasWidth) *.5 + 'px'
        // canvas.style.top = (window.innerHeight - canvasHeight) *.5 + 'px'
    }

    let orbit = (particles) => {
        // console.log(particles)
        let context = canvas.getContext('2d')

    //     context.clearRect(0, 0, canvas.width, canvas.height)
    //    particleContext.clearRect(0, 0, canvas.width, canvas.height)

        if(isMouseDown){
            radiusScale += (radiusMax - radiusScale) * 0.02
        } else {
            radiusScale -= (radiusScale - radiusMin) * 0.02
        }

        radiusScale = Math.min(radiusScale,radiusMax)

        particleContext.fillStyle = 'rgba(0,0,0,0.05)'

        particleContext.fillRect(0, 0, particleContext.canvas.width, particleContext.canvas.height);
        for (let i = 0 ; i < particles.length; i++){
            let particle = particles[i]

            // console.log(particle.position)
            let op = {x: particle.position.x, y: particle.position.y}

            particle.angle += particle.speed

            particle.shift.x += ( mouseX - particle.shift.x) * (particle.speed);
			particle.shift.y += ( mouseY - particle.shift.y) * (particle.speed);

            particle.position.x = particle.shift.x + Math.cos(i + particle.angle) * (particle.orbit*radiusScale);
			particle.position.y = particle.shift.y + Math.sin(i + particle.angle) * (particle.orbit*radiusScale);


            particle.position.x = Math.max( Math.min( particle.position.x, canvasWidth ), 0 );
			particle.position.y = Math.max( Math.min( particle.position.y, canvasHeight ), 0 );

			particle.size += ( particle.targetSize - particle.size ) * 0.5;

            if( Math.round( particle.size ) == Math.round( particle.targetSize ) ) {
				particle.targetSize = 1 + Math.random() * 7;
			}

			particleContext.beginPath();
			particleContext.fillStyle = particle.fillColor;
			particleContext.strokeStyle = particle.fillColor;
			particleContext.lineWidth = particle.size;
			particleContext.moveTo(op.x, op.y);
			particleContext.lineTo(particle.position.x, particle.position.y);
			particleContext.stroke();
			particleContext.arc(particle.position.x, particle.position.y, particle.size/2, 0, Math.PI*2, true);
			particleContext.fill();
        }
        }


    let orbitInterval

    const initOrbit = () => {
       let context = canvas.getContext('2d')

    // canvas.removeEventListener('mousedown', initOrbit)

        window.addEventListener('mousemove', handleMouseMove, false)
        canvas.addEventListener('mousedown', mouseDownToggle, false)
        canvas.addEventListener('mouseup', mouseUpToggle, false )
        window.addEventListener('resize', handleResize, false);

       let particles =  genParticles(13)

       handleResize()

       orbitInterval = setInterval(()=> {
           orbit(particles)
       }, 20 )
    }

    const clearOrbit = () => {
        window.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mousedown', mouseDownToggle, false)
        canvas.removeEventListener('mouseup', mouseUpToggle, false )
        window.removeEventListener('resize', handleResize, false);

        clearInterval(orbitInterval)
        particleContext.clearRect(0, 0, canvas.width, canvas.height)
    }
    canvas.addEventListener('mousedown', initOrbit)
    // canvas.addEventListener('mouseleave', clearOrbit)
    // canvas.addEventListener('mouseup', clearOrbit)
    display.append(canvas)

}
