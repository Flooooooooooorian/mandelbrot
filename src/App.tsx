import React, {useEffect, useRef, useState} from 'react';
import './App.css';

type Settings = {
    size: number,
    center: {
        x: number,
        y: number
    },
    zoom: number
}

function App() {

    const [settings, setSettings] = useState<Settings>({size: 900, center: {x: 0, y: 0}, zoom: 1})
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const canvasRef = useRef<HTMLCanvasElement>(null)

    const calcMandelBrot = (x: number, y: number) => {
        let real = 0;
        let imaginary = 0;
        let iteration = 0;
        const max_iteration = 1000;
        while (real * real + imaginary * imaginary <= 4 && iteration < max_iteration) {
            const temp_real = real * real - imaginary * imaginary + x;
            imaginary = 2 * real * imaginary + y;
            real = temp_real;
            iteration++;
        }
        return iteration;
    }

    const drawDot = (x: number, y: number, color: string) => {
        const context = canvasRef.current!.getContext('2d')!

        context.fillStyle = color
        context.fillRect(x, y, 1, 1)
    }

    const reDraw = () => {
        const emptyView = [...Array(settings.size)].map(e => Array(settings.size))

        for (let x = 0; x < emptyView.length; x++) {
            for (let y = 0; y < emptyView[x].length; y++) {

                const gridCooardinates = {
                    x: ((x - settings.size / 2) / settings.size) / settings.zoom + (settings.center.x / settings.zoom),
                    y: ((y - settings.size / 2) / settings.size) / settings.zoom + (settings.center.y / settings.zoom)
                }
                emptyView[x][y] = calcMandelBrot(gridCooardinates.x, gridCooardinates.y)
                drawDot(x, y, emptyView[x][y] === 1000 ? 'black' : '#fff')
            }
        }

        const context = canvasRef.current!.getContext('2d')!
        context.fillStyle = 'red'
        context.fillRect((settings.size / 2) - 2, (settings.size / 2) - 2, 4, 4)
    }

    useEffect(() => {
        console.log('calc...')

        if (timerRef.current) {
            clearTimeout(timerRef.current)
        }
        timerRef.current = setTimeout(() => {
            console.log('change')
            reDraw()
        }, 1000)

    }, [settings])

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div>
                <label>Size</label>
                <input type='number' value={settings.size}
                       onChange={event => setSettings(prevState => ({
                           ...prevState,
                           size: Number(event.target.value)
                       }))}/>
                <label>Center</label>
                <input type='number' value={settings.center.x}
                       onChange={event => setSettings(prevState => ({
                           ...prevState,
                           center: {...prevState.center, x: Number(event.target.value)}
                       }))}/>
                <input type='number' value={settings.center.y}
                       onChange={event => setSettings(prevState => ({
                           ...prevState,
                           center: {...prevState.center, y: Number(event.target.value)}
                       }))}/>
                <label>Zoom</label>
                <input type='number' value={settings.zoom} step={0.1}
                       onChange={event => setSettings(prevState => ({
                           ...prevState,
                           zoom: Number(event.target.value)
                       }))}/>
            </div>
            <canvas ref={canvasRef} width={settings.size} height={settings.size} style={{border: "black 1px solid"}}/>
        </div>
    );
}

export default App;
