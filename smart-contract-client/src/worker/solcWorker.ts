/// <reference lib="webworker" />
importScripts('https://cdnjs.cloudflare.com/ajax/libs/solc/0.8.20/solc.min.js');

self.onmessage = async (event) => {
    const { sourceCode } = event.data;

    const input = {
        language: 'Solidity',
        sources: {
            'Contract.sol': { content: sourceCode },
        },
        settings: { outputSelection: { '*': { '*': ['*'] } } },
    };

    const solc = (self as any).solc;
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    self.postMessage(output);
};
