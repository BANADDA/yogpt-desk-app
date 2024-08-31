import figlet from 'figlet';
import React, { useEffect, useState } from 'react';
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui';

const TerminalController = (props) => {
  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput key={1}>Loading...</TerminalOutput>
  ]);

  useEffect(() => {
    // Generate ASCII art using figlet
    figlet.text('YoGPT', { font: 'Standard' }, (err, data) => {
      if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
      }
      setTerminalLineData([
        <TerminalOutput key={1}>
          <pre style={{ color: '#FF69B4' }}>{data}</pre>
        </TerminalOutput>,
        <TerminalOutput key={2}>Welcome to YoGPT Miner System!</TerminalOutput>
      ]);
    });
  }, []);

  return (
    <div className="container" style={{ height: '410px', overflow: 'hidden' }}>
      <Terminal
        name="YoGPT Terminal"
        colorMode={ColorMode.Dark}
        onInput={(terminalInput) => {
          console.log(`New terminal input received: '${terminalInput}'`);
          setTerminalLineData(prevData => [
            ...prevData,
            <TerminalOutput key={prevData.length + 1}>{terminalInput}</TerminalOutput>
          ]);
        }}
      >
        {terminalLineData}
      </Terminal>
    </div>
  );
};

export default TerminalController;
