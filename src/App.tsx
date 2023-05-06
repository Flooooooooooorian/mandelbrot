import React, {useEffect, useRef, useState} from 'react';
import './App.css';

function App() {

    const [size, setSize] = useState<number>(500)
    const [view, setView] = useState<number[][]>( [...Array(size)].map(e => Array(size)))

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

    const draw = (context: CanvasRenderingContext2D) => {
        const dot = (x: number, y: number, color: string) => {
            context.fillStyle = color
            context.fillRect(x, y, x + 10, y + 10)
        }

        context.clearRect(0, 0, context.canvas.width, context.canvas.height)

        for (let i = 0; i < context.canvas.width; i++) {
            for (let j = 0; j < context.canvas.height; j++) {
                dot(i, j, view[i][j] === 1000 ? 'black' : `#fff`)
            }
        }
    }

    useEffect(() => {
        console.log('redraw')
        draw(canvasRef.current!.getContext('2d')!)
    }, [view])

    useEffect(() => {
        console.log('resize')
        const emptyView = [...Array(size)].map(e => Array(size))

        for (let x = 0; x < emptyView.length; x++) {
            for (let y = 0; y < emptyView[x].length; y++) {
                emptyView[x][y] = calcMandelBrot(x / size, y / size)
            }
        }

        setView(emptyView)
    }, [size])

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <input type='number' value={size} onChange={event => setSize(Number(event.target.value))}/>
            <canvas ref={canvasRef} width={size} height={size} style={{border: "black 1px solid"}}/>
        </div>
    );
}

export default App;
