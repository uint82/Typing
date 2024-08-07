
// nggak tau mau di apakan
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import './TypingGraph.css';

const TypingGraph = ({ typingData, isTestActive, isTestEnded }) => {
    if (!isTestActive && !isTestEnded) {
        return null; 
      }

  return (
    <div className="typing-graph">
      <LineChart width={600} height={300} data={typingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="wordNumber" stroke="#d4d4d4" />
        <YAxis yAxisId="left" stroke="#d4d4d4" />
        <YAxis yAxisId="right" orientation="right" stroke="#d4d4d4" />
        <Tooltip contentStyle={{ backgroundColor: '#2c2c2c', border: 'none', color: '#d4d4d4' }} />
        <Line yAxisId="left" type="monotone" dataKey="wpm" stroke="#569cd6" dot={false} />
        <Line yAxisId="right" type="monotone" dataKey="incorrectChars" stroke="#6a9955" dot={false} />
        {typingData.map((entry, index) => 
          entry.isSignificantError && (
            <ReferenceLine key={index} x={entry.wordNumber} stroke="#f44747" />
          )
        )}
      </LineChart>
    </div>
  );
};

export default TypingGraph;