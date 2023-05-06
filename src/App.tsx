import React, {useEffect, useRef, useState} from 'react';
import './App.css';

function App() {

    const [center, setCenter] = useState({x: -100, y: -100})
    const [size, setSize] = useState<number>(900)

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

    useEffect(() => {
        console.log('resize')
        const emptyView = [...Array(size)].map(e => Array(size))

        for (let x = 0; x < emptyView.length; x++) {
            for (let y = 0; y < emptyView[x].length; y++) {
                emptyView[x][y] = calcMandelBrot((x + center.x) / size, (y + center.y) / size)
                drawDot(x, y, emptyView[x][y] === 1000 ? 'black' : '#fff')
            }
        }
    }, [size, center])

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div>
                <label>Size</label>
                <input type='number' value={size} onChange={event => setSize(Number(event.target.value))}/>
                <label>Center</label>
                <input type='number' value={center.x} onChange={event => setCenter(prevState => ({...prevState, x: Number(event.target.value)}))}/>
                <input type='number' value={center.y} onChange={event => setCenter(prevState => ({...prevState, y: Number(event.target.value)}))}/>
            </div>
            <canvas ref={canvasRef} width={size} height={size} style={{border: "black 1px solid"}}/>
        </div>
    );
}

export default App;
