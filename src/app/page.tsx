'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { evaluate, type MathJsStatic } from 'mathjs';

const Editor = dynamic(() => import('./components/Editor'), { ssr: false });
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function Home() {
  const [script, setScript] = useState('');
  const [plotData, setPlotData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parseScript = async () => {
      try {
        setError(null);
        const math: MathJsStatic = await import('mathjs');
        const scope: any = {};
        math.evaluate(script, scope);

        const variables = Object.keys(scope);

        if (variables.length === 1) {
          const x = scope[variables[0]];
          setPlotData({
            data: [
              {
                x: Array.isArray(x) ? x : [x],
                y: Array(Array.isArray(x) ? x.length : 1).fill(0),
                mode: 'markers',
                marker: { size: 12 },
              },
            ],
            layout: {
              xaxis: { title: variables[0] },
              yaxis: { visible: false },
              showlegend: false,
            },
          });
        } else if (variables.length === 2) {
          const [x, y] = variables.map((v) => scope[v]);
          setPlotData({
            data: [
              {
                x: Array.isArray(x) ? x : [x],
                y: Array.isArray(y) ? y : [y],
                mode: 'markers',
                marker: { size: 12 },
              },
            ],
            layout: {
              xaxis: { title: variables[0] },
              yaxis: { title: variables[1] },
              showlegend: false,
            },
          });
        } else if (variables.length === 3) {
          const [x, y, z] = variables.map((v) => scope[v]);
          setPlotData({
            data: [
              {
                x: Array.isArray(x) ? x : [x],
                y: Array.isArray(y) ? y : [y],
                z: Array.isArray(z) ? z : [z],
                mode: 'markers',
                marker: { size: 4 },
                type: 'scatter3d',
              },
            ],
            layout: {
              scene: {
                xaxis: { title: variables[0] },
                yaxis: { title: variables[1] },
                zaxis: { title: variables[2] },
              },
            },
          });
        } else {
          setPlotData(null);
        }
      } catch (err: any) {
        console.error('Error parsing script:', err);
        setError(err.message);
        setPlotData(null);
      }
    };

    parseScript();
  }, [script]);

  return (
    <div className="flex h-screen">
      <div className="w-1/2 border-r">
        <Editor script={script} setScript={setScript} />
      </div>
      <div className="w-1/2">
        {error ? (
          <div className="text-red-500 p-4">{error}</div>
        ) : plotData ? (
          <Plot data={plotData.data} layout={plotData.layout} />
        ) : (
          <div className="p-4">Define 1-3 variables in the script to see the plot.</div>
        )}
      </div>
    </div>
  );
}
